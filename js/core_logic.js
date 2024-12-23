const cacheMetadata = require('./cache_metadata');
const fs = require('fs');

// Global state object with complete structure
const systemState = {
    metadata: {},
    variables: {},
    previousOutput: null,
    currentContext: null,
    warmholes: {},
    functions: {},
    templates: {},
    cache: {}
};

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
 * Extract content using regex pattern
 */
function extractByRegex(content, pattern) {
    const matches = [];
    const regex = new RegExp(pattern, 'g');
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push(match);
    }
    return matches;
}

/**
 * Parse function definition from markdown
 */
function parseFunctionDef(content) {
    console.log("Parsing function:", content); // Debug log
    const regex = /# Function:\s*(\w+)\s*\n-\s*description:\s*"([^"]+)"\s*\n-\s*input:\s*(\w+):\s*(\w+)\s*\n-\s*output:\s*(\w+):\s*(\w+)\s*\n-\s*template:\s*(\w+)/;
    const match = content.match(regex);
    if (!match) {
        console.log("No match for function"); // Debug log
        return null;
    }
    
    return {
        name: match[1],
        description: match[2],
        input: { name: match[3], type: match[4] },
        output: { name: match[5], type: match[6] },
        template: match[7]
    };
}

/**
 * Parse template definition from markdown
 */
function parseTemplateDef(content) {
    console.log("Parsing template:", content); // Debug log
    const regex = /# Template:\s*(\w+)\s*\n-\s*input_placeholder:\s*"([^"]+)"\s*\n-\s*transform:\s*\|([\s\S]*?)(?=\n-|$)\n-\s*output_format:\s*(\w+)/;
    const match = content.match(regex);
    if (!match) {
        console.log("No match for template"); // Debug log
        return null;
    }
    
    return {
        name: match[1],
        placeholder: match[2],
        transform: match[3].trim(),
        outputFormat: match[4]
    };
}

/**
 * Parse warmhole definition from markdown
 */
function parseWarmholeDef(content) {
    const regex = /# Warmhole:\s+(\w+)\n-\s*description:\s*"([^"]+)"\n-\s*state_transfer:\s*\[([^\]]+)\]\n-\s*condition:\s*"([^"]+)"\n-\s*next_warmhole:\s*"([^"]+)"/;
    const match = content.match(regex);
    if (!match) return null;
    
    return {
        name: match[1],
        description: match[2],
        state_transfer: match[3].split(',').map(s => s.trim().replace(/['"]/g, '')), // Remove quotes
        condition: match[4],
        next_warmhole: match[5]
    };
}

/**
 * Initialize the system
 */
function system_init(readmeContent) {
    logSystem('Initializing system...');
    
    try {
        // Store content
        systemState.variables.readme_content = readmeContent;
        
        // Parse core sections
        const sections = extractByRegex(readmeContent, '^##\\s+(.+)$');
        
        // Parse Functions
        const functionBlocks = readmeContent.match(/# Function:[\s\S]*?(?=\n# |$)/g) || [];
        functionBlocks.forEach(block => {
            const def = parseFunctionDef(block);
            if (def) {
                console.log("Found function:", def.name); // Debug log
                systemState.functions[def.name] = def;
            }
        });
        
        // Parse Templates
        const templateBlocks = readmeContent.match(/# Template:[\s\S]*?(?=\n# |$)/g) || [];
        templateBlocks.forEach(block => {
            const def = parseTemplateDef(block);
            if (def) {
                console.log("Found template:", def.name); // Debug log
                systemState.templates[def.name] = def;
            }
        });
        
        // Parse Warmholes
        const warmholeBlocks = readmeContent.match(/# Warmhole:[\s\S]*?(?=\n# |$)/g) || [];
        warmholeBlocks.forEach(block => {
            const def = parseWarmholeDef(block);
            if (def) {
                console.log("Found warmhole:", def.name); // Debug log
                systemState.warmholes[def.name] = def;
            }
        });
        
        // Cache metadata
        systemState.metadata = cacheMetadata(readmeContent);
        
        const stats = {
            sections: sections.length,
            functions: Object.keys(systemState.functions).length,
            templates: Object.keys(systemState.templates).length,
            warmholes: Object.keys(systemState.warmholes).length
        };
        
        logSystem('System initialized successfully', stats);
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
            return executeFunctionDef(fn, context);
        }
        
        // Check if template exists
        const template = systemState.templates[name];
        if (template) {
            // Execute template with context
            return executeTemplateDef(template, context);
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
    
    return {
        status: "navigated",
        to: warmhole.next_warmhole,
        state_transferred: warmhole.state_transfer
    };
}

module.exports = {
    system_init,
    execute,
    navigateWarmhole,
    systemState,
    // Export helper functions for testing
    parseFunctionDef,
    parseTemplateDef,
    parseWarmholeDef,
    logSystem
};
