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
    const regex = /# Function:\s+(\w+)\n-\s*description:\s*"([^"]+)"\n-\s*input:\s*(\w+):\s*(\w+)\n-\s*output:\s*(\w+):\s*(\w+)\n-\s*template:\s*(\w+)/;
    const match = content.match(regex);
    if (!match) return null;
    
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
    const regex = /# Template:\s+(\w+)\n-\s*input_placeholder:\s*"([^"]+)"\n-\s*transform:\s*\|([^-]+)\n-\s*output_format:\s*(\w+)/;
    const match = content.match(regex);
    if (!match) return null;
    
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
        state_transfer: match[3].split(',').map(s => s.trim()),
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
        
        // Parse functions
        const functions = extractByRegex(readmeContent, '# Function:[\\s\\S]*?```');
        functions.forEach(fn => {
            const def = parseFunctionDef(fn[0]);
            if (def) systemState.functions[def.name] = def;
        });
        
        // Parse templates
        const templates = extractByRegex(readmeContent, '# Template:[\\s\\S]*?```');
        templates.forEach(tmpl => {
            const def = parseTemplateDef(tmpl[0]);
            if (def) systemState.templates[def.name] = def;
        });
        
        // Parse warmholes
        const warmholes = extractByRegex(readmeContent, '# Warmhole:[\\s\\S]*?```');
        warmholes.forEach(wh => {
            const def = parseWarmholeDef(wh[0]);
            if (def) systemState.warmholes[def.name] = def;
        });
        
        // Cache metadata
        systemState.metadata = cacheMetadata(readmeContent);
        
        logSystem('System initialized successfully', {
            sections: sections.length,
            functions: Object.keys(systemState.functions).length,
            templates: Object.keys(systemState.templates).length,
            warmholes: Object.keys(systemState.warmholes).length
        });
        
        return {
            status: "initialized",
            sections: sections.length,
            functions: Object.keys(systemState.functions).length,
            templates: Object.keys(systemState.templates).length,
            warmholes: Object.keys(systemState.warmholes).length
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
        const result = new Function('context', `return ${code}`)(context);
        return {
            status: "success",
            result,
            format: templateDef.outputFormat
        };
    } catch (error) {
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
    
    // Update state based on state_transfer
    if (warmhole.state_transfer) {
        warmhole.state_transfer.forEach(variable => {
            systemState.variables[variable] = systemState.currentContext[variable];
        });
    }
    
    // Store previous output
    systemState.previousOutput = systemState.currentContext?.output;
    
    // Update current context
    systemState.currentContext = warmhole.next_warmhole;
    
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
