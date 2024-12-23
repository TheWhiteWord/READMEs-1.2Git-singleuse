const cacheMetadata = require('./cache_metadata');
const { chatWithLLM, processUserIntent } = require('./llm_interaction');
const { extractByRegex, parseFunctionDef, parseTemplateDef, parseWarmholeDef } = require('./parse_utils');
const fs = require('fs');
const path = require('path');

// Global state object with complete structure
const systemState = {
    metadata: {},
    variables: {},
    previousOutput: null,
    currentContext: null,
    warmholes: {},
    functions: {},
    templates: {},
    cache: {},
    llmContext: {
        history: [],
        goals: [],
        decisions: [],
        optimizations: []
    }
};

// Path to the state file
const stateFilePath = path.join(__dirname, 'state.json');

// Logging functionality
function logSystem(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    if (data) {
        console.log(JSON.stringify(data, null, 2));
    }
    
    // Try to write to a log file
    try {
        fs.appendFileSync('system.log', logMessage + '\n');
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
}

/**
 * Save the system state to a file
 */
function saveState() {
    try {
        fs.writeFileSync(stateFilePath, JSON.stringify(systemState, null, 2));
        logSystem('System state saved successfully');
    } catch (error) {
        logSystem('Failed to save system state', { error: error.message });
    }
}

/**
 * Load the system state from a file
 */
function loadState() {
    try {
        if (fs.existsSync(stateFilePath)) {
            const stateData = fs.readFileSync(stateFilePath, 'utf8');
            Object.assign(systemState, JSON.parse(stateData));
            logSystem('System state loaded successfully');
        }
    } catch (error) {
        logSystem('Failed to load system state', { error: error.message });
    }
}

/**
 * Initialize the system
 */
async function system_init(readmeContent) {
    logSystem('Initializing system...');
    
    try {
        // Store content
        systemState.variables.readme_content = readmeContent;
        
        // Parse core sections using regex extraction
        const functionBlocks = extractByRegex(readmeContent, /# Function:[\s\S]*?(?=\n# |$)/);
        const templateBlocks = extractByRegex(readmeContent, /# Template:[\s\S]*?(?=\n# |$)/);
        const warmholeBlocks = extractByRegex(readmeContent, /# Warmhole:[\s\S]*?(?=\n# |$)/);
        
        // Parse Functions
        functionBlocks.forEach(block => {
            const def = parseFunctionDef(block.raw);
            if (def) {
                systemState.functions[def.name] = def;
            }
        });
        
        // Parse Templates
        templateBlocks.forEach(block => {
            const def = parseTemplateDef(block.raw);
            if (def) {
                systemState.templates[def.name] = def;
            }
        });
        
        // Parse Warmholes
        warmholeBlocks.forEach(block => {
            const def = parseWarmholeDef(block.raw);
            if (def) {
                delete def.next_warmhole; // Remove next_warmhole property
                systemState.warmholes[def.name] = def;
            }
        });
        
        // Cache metadata for faster access
        systemState.metadata = cacheMetadata(readmeContent);
        
        const stats = {
            functions: Object.keys(systemState.functions).length,
            templates: Object.keys(systemState.templates).length,
            warmholes: Object.keys(systemState.warmholes).length
        };
        
        logSystem('System initialized successfully', stats);
        saveState();

        // Analyze the README content to determine the user intent and generate an execution plan
        const plan = await processUserIntent(readmeContent, systemState);

        // Execute the first step of the plan
        if (plan.steps && plan.steps.length > 0) {
            const firstStep = plan.steps[0];
            await executeLLMPlan({ steps: [firstStep] });
        }

        return plan;
    } catch (error) {
        logSystem('Initialization failed', { error: error.message });
        throw error;
    }
}

/**
 * Execute a function, template, or plan
 */
async function execute(nameOrPlan, context = {}, llm = true) {
    logSystem(`Executing ${nameOrPlan}`, { context });

    try {
        // Load the state before execution
        loadState();

        // Check if the input is a plan
        if (typeof nameOrPlan === 'object' && nameOrPlan.steps) {
            return await executeLLMPlan(nameOrPlan);
        }

        // Check if function exists
        const fn = systemState.functions[nameOrPlan];
        if (fn) {
            // Pass user inputs and system state to the LLM if llm is true
            let parsedResponse = { input: context };
            if (llm) {
                const llmResponse = await chatWithLLM(JSON.stringify({
                    type: 'execute_function',
                    function: nameOrPlan,
                    input: context,
                    systemState: systemState
                }));

                try {
                    parsedResponse = JSON.parse(llmResponse);
                } catch (error) {
                    parsedResponse = { input: { message: llmResponse } };
                }

                if (parsedResponse.error) {
                    throw new Error(parsedResponse.error);
                }
            }

            // Execute function with context
            const result = executeFunctionDef(fn, parsedResponse.input);
            
            // Save the state after execution
            saveState();
            return result;
        }

        // Check if template exists
        const template = systemState.templates[nameOrPlan];
        if (template) {
            // Pass user inputs and system state to the LLM if llm is true
            let parsedResponse = { input: context };
            if (llm) {
                const llmResponse = await chatWithLLM(JSON.stringify({
                    type: 'execute_template',
                    template: nameOrPlan,
                    input: context,
                    systemState: systemState
                }));

                try {
                    parsedResponse = JSON.parse(llmResponse);
                } catch (error) {
                    parsedResponse = { input: { message: llmResponse } };
                }

                if (parsedResponse.error) {
                    throw new Error(parsedResponse.error);
                }
            }

            // Execute template with context
            const result = await executeTemplateDef(template, parsedResponse.input);
            
            // Save the state after execution
            saveState();
            return result;
        }

        throw new Error(`No function or template found with name: ${nameOrPlan}`);
    } catch (error) {
        logSystem('Execution failed', { error: error.message });
        throw error;
    }
}

/**
 * Execute function definition
 */
function executeFunctionDef(fnDef, context) {
    const template = systemState.templates[fnDef.template];
    if (!template) {
        throw new Error(`Template not found: ${fnDef.template}`);
    }
    
    return executeTemplateDef(template, {
        ...context,
        [fnDef.input.name]: context.input
    });
}

/**
 * Execute template definition
 */
async function executeTemplateDef(templateDef, context) {
    // Call the LLM processing function
    const llmResponse = await chatWithLLM(JSON.stringify({
        type: 'execute_template',
        template: templateDef.name,
        input: context,
        systemState: systemState
    }));

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(llmResponse);
    } catch (error) {
        logSystem('Received plain text response from LLM', { llmResponse });
        parsedResponse = { result: llmResponse };
    }

    if (parsedResponse.error) {
        throw new Error(parsedResponse.error);
    }

    // Execute the transform function with the parsed response
    const transformFunction = new Function('context', 'execute', 'chatWithLLM', templateDef.transform);
    const result = await transformFunction(parsedResponse.result, execute, chatWithLLM);

    return {
        status: "success",
        result: result,
        format: templateDef.outputFormat
    };
}

/**
 * Navigate through warmhole
 */
async function navigateWarmhole(id) {
    logSystem(`Navigating warmhole: ${id}`);
    
    // Load the state before navigation
    loadState();

    const warmhole = systemState.warmholes[id];
    if (!warmhole) {
        throw new Error(`Warmhole not found: ${id}`);
    }
    
    // Initialize context if null
    if (!systemState.currentContext) {
        systemState.currentContext = {};
    }
    
    // Update state based on state_transfer
    if (warmhole.state_transfer) {
        warmhole.state_transfer.forEach(variable => {
            if (systemState.currentContext[variable] !== undefined) {
                systemState.variables[variable] = systemState.currentContext[variable];
            }
        });
    }
    
    // Store previous output
    systemState.previousOutput = systemState.currentContext?.output;
    
    // Ask LLM to decide the next warmhole
    const llmResponse = await chatWithLLM(JSON.stringify({
        type: 'decide_next_warmhole',
        currentWarmhole: id,
        context: systemState.currentContext,
        systemState: systemState
    }));

    let nextWarmhole;
    try {
        nextWarmhole = JSON.parse(llmResponse).next_warmhole;
    } catch (error) {
        nextWarmhole = llmResponse;
    }

    if (!nextWarmhole) {
        throw new Error('LLM did not provide a next warmhole');
    }

    // Update current context
    systemState.currentContext = {
        warmhole: nextWarmhole,
        ...systemState.variables
    };
    
    // Save the state after navigation
    saveState();
    return {
        status: "navigated",
        to: nextWarmhole,
        state_transferred: warmhole.state_transfer
    };
}

/**
 * Execute plan provided by LLM
 */
async function executeLLMPlan(plan) {
    logSystem('Executing LLM plan', plan);
    
    const results = [];
    for (const step of plan.steps) {
        logSystem(`Processing step: ${JSON.stringify(step)}`);
        switch (step.type) {
            case 'navigate':
                logSystem(`Navigating to warmhole: ${step.warmhole}`);
                const navigateResult = await navigateWarmhole(step.warmhole);
                results.push(navigateResult);
                break;
            case 'execute':
                logSystem(`Executing function: ${step.function}`);
                const executeResult = await execute(step.function, step.input);
                results.push(executeResult);
                break;
            case 'optimize':
                logSystem(`Optimizing warmhole: ${step.warmhole}`);
                const optimizeResult = await optimizeWarmholeLLM(step.warmhole, step.optimization);
                results.push(optimizeResult);
                break;
            default:
                logSystem(`Unknown step type: ${step.type}`);
                throw new Error(`Unknown step type: ${step.type}`);
        }
    }

    return {
        status: 'complete',
        message: plan.userMessage,
        results,
        activeWarmhole: systemState.currentContext?.warmhole
    };
}

/**
 * LLM-driven warmhole navigation
 */
async function navigateWarmholeLLM(warmholeId, context = {}) {
    logSystem(`LLM navigating to warmhole: ${warmholeId}`, context);
    
    const warmhole = systemState.warmholes[warmholeId];
    if (!warmhole) {
        throw new Error(`Warmhole not found: ${warmholeId}`);
    }

    // Let LLM evaluate navigation condition
    const shouldNavigate = await chatWithLLM(JSON.stringify({
        type: 'evaluate_condition',
        warmhole: warmholeId,
        condition: warmhole.condition,
        context: {
            ...context,
            systemState: systemState.variables,
            currentContext: systemState.currentContext
        }
    }));

    if (!JSON.parse(shouldNavigate).allowed) {
        // Let LLM suggest alternative warmhole
        const alternative = await chatWithLLM(JSON.stringify({
            type: 'suggest_alternative',
            rejected: warmholeId,
            context: systemState.currentContext
        }));
        
        const alternativeWarmhole = JSON.parse(alternative).suggestion;
        if (alternativeWarmhole) {
            return navigateWarmholeLLM(alternativeWarmhole, context);
        }
        
        throw new Error(`Navigation to ${warmholeId} denied by LLM with no alternative`);
    }

    // Perform navigation with state transfer
    systemState.previousOutput = systemState.currentContext?.output;
    systemState.currentContext = {
        warmhole: warmholeId,
        ...context,
        ...systemState.variables
    };

    // Update state based on state_transfer
    if (warmhole.state_transfer) {
        warmhole.state_transfer.forEach(variable => {
            if (context[variable] !== undefined) {
                systemState.variables[variable] = context[variable];
            }
        });
    }

    // Save the state after navigation
    saveState();
    return {
        status: 'navigated',
        to: warmholeId,
        stateTransferred: warmhole.state_transfer
    };
}

/**
 * LLM-driven function execution
 */
async function executeFunctionLLM(name, input) {
    logSystem(`LLM executing function: ${name}`, input);
    
    // Let LLM validate and potentially modify input
    const validatedInput = await chatWithLLM(JSON.stringify({
        type: 'validate_input',
        function: name,
        input,
        context: systemState.currentContext
    }));

    const result = execute(name, JSON.parse(validatedInput));
    saveState();
    return result;
}

/**
 * LLM-driven warmhole optimization
 */
async function optimizeWarmholeLLM(warmholeId, optimization) {
    logSystem(`LLM optimizing warmhole: ${warmholeId}`, optimization);
    
    const warmhole = systemState.warmholes[warmholeId];
    if (!warmhole) {
        throw new Error(`Warmhole not found: ${warmholeId}`);
    }

    // Let LLM suggest optimizations
    const optimizationPlan = await chatWithLLM(JSON.stringify({
        type: 'optimize_warmhole',
        warmhole,
        optimization,
        context: systemState.currentContext
    }));

    const plan = JSON.parse(optimizationPlan);
    
    // Apply optimizations
    if (plan.modifications) {
        Object.assign(warmhole, plan.modifications);
    }

    saveState();
    return {
        status: 'optimized',
        warmhole: warmholeId,
        optimizations: plan.modifications
    };
}

module.exports = {
    system_init,
    execute,
    navigateWarmhole,
    systemState,
    // Export helper functions for testing
    logSystem,
    executeLLMPlan,
    navigateWarmholeLLM,
    executeFunctionLLM,
    optimizeWarmholeLLM,
    saveState,
    loadState
};
