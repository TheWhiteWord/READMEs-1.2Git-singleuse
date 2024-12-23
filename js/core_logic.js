const cacheMetadata = require('./cache_metadata');
const { chatWithLLM, analyzeState } = require('./llm_interaction');
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
function system_init(readmeContent) {
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
                console.log("Found function:", def.name);
                systemState.functions[def.name] = def;
            }
        });
        
        // Parse Templates
        templateBlocks.forEach(block => {
            const def = parseTemplateDef(block.raw);
            if (def) {
                console.log("Found template:", def.name);
                systemState.templates[def.name] = def;
            }
        });
        
        // Parse Warmholes
        warmholeBlocks.forEach(block => {
            const def = parseWarmholeDef(block.raw);
            if (def) {
                console.log("Found warmhole:", def.name);
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
        return {
            status: "initialized",
            ...stats
        };
    } catch (error) {
        logSystem('Initialization failed', { error: error.message });
        throw error;
    }
}

/**
 * Execute a function or template
 */
function execute(name, context = {}) {
    logSystem(`Executing ${name}`, { context });
    
    try {
        // Check if function exists
        const fn = systemState.functions[name];
        if (fn) {
            // Execute function with context
            const result = executeFunctionDef(fn, context);
            saveState();
            return result;
        }
        
        // Check if template exists
        const template = systemState.templates[name];
        if (template) {
            // Execute template with context
            const result = executeTemplateDef(template, context);
            saveState();
            return result;
        }
        
        throw new Error(`No function or template found with name: ${name}`);
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
function executeTemplateDef(templateDef, context) {
    // Include the llm object in the context
    context.llm = {
        processUserIntent: (message) => {
            // Simulate the LLM processing user intent
            return `Processed intent: ${message}`;
        }
    };

    // Replace placeholders in transform
    let code = templateDef.transform;
    Object.entries(context).forEach(([key, value]) => {
        code = code.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    // Execute transformed code
    try {
        // Create a proper function that returns the result
        code = `
            return (function(context) { 
                ${code}
            })(arguments[0]);
        `;
        const result = new Function('context', code)(context);
        return {
            status: "success",
            result,
            format: templateDef.outputFormat
        };
    } catch (error) {
        logSystem('Template execution failed', { error: error.message, code });
        return {
            status: "error",
            error: error.message,
            format: "error"
        };
    }
}

/**
 * Navigate through warmhole
 */
function navigateWarmhole(id) {
    logSystem(`Navigating warmhole: ${id}`);
    
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
    
    // Update current context
    systemState.currentContext = {
        warmhole: warmhole.next_warmhole,
        ...systemState.variables
    };
    
    saveState();
    return {
        status: "navigated",
        to: warmhole.next_warmhole,
        state_transferred: warmhole.state_transfer
    };
}

/**
 * Process user intent and determine execution path
 */
async function processUserIntent(message, context = {}) {
    logSystem('Processing user intent', { message, context });
    
    try {
        // Ask LLM to analyze intent and plan execution
        const plan = await chatWithLLM(JSON.stringify({
            type: 'analyze_intent',
            message,
            context: {
                systemState: context.systemState,
                currentWarmhole: context.activeWarmhole,
                availableFunctions: Object.keys(systemState.functions),
                availableWarmholes: Object.keys(systemState.warmholes)
            }
        }));

        // Check if the response is JSON
        let parsedPlan;
        try {
            parsedPlan = JSON.parse(plan);
        } catch (error) {
            // Handle plain text response
            logSystem('Received plain text response from LLM', { plan });
            parsedPlan = { steps: [{ type: 'message', content: plan }] };
        }

        // Execute the plan
        const result = await executeLLMPlan(parsedPlan);
        saveState();
        return result;
    } catch (error) {
        logSystem('Intent processing failed', { error: error.message });
        throw error;
    }
}

/**
 * Execute plan provided by LLM
 */
async function executeLLMPlan(plan) {
    logSystem('Executing LLM plan', plan);
    
    const results = [];
    for (const step of plan.steps) {
        switch (step.type) {
            case 'navigate':
                results.push(await navigateWarmholeLLM(step.warmhole, step.context));
                break;
            case 'execute':
                results.push(await executeFunctionLLM(step.function, step.input));
                break;
            case 'optimize':
                results.push(await optimizeWarmholeLLM(step.warmhole, step.optimization));
                break;
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
    processUserIntent,
    executeLLMPlan,
    navigateWarmholeLLM,
    executeFunctionLLM,
    optimizeWarmholeLLM,
    saveState,
    loadState
};
