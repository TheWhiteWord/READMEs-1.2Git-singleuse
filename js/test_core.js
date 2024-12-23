const { system_init, execute, navigateWarmhole, systemState } = require('./core_logic');

// Test data
const testMd = `
# Function: test_function
- description: "A test function"
- input: text: string
- output: result: string
- template: test_template

# Template: test_template
- input_placeholder: "{{text}}"
- transform: |
    return context.text.toUpperCase()
- output_format: string

# Warmhole: test_warmhole
- description: "Test warmhole"
- state_transfer: ["text"]
- condition: "true"
- next_warmhole: "next_test"
`;

// Run tests
console.log('Starting tests...');

// Test system initialization
try {
    debugger; // Add breakpoint here
    const initResult = system_init(testMd);
    console.log('Initialization test:', initResult);
} catch (error) {
    debugger; // Add breakpoint for errors
    console.error('Initialization failed:', error);
}

// Test function execution
try {
    const execResult = execute('test_function', { input: 'hello world' });
    console.log('Execution test:', execResult);
} catch (error) {
    console.error('Execution failed:', error);
}

// Test warmhole navigation
try {
    const navResult = navigateWarmhole('test_warmhole');
    console.log('Navigation test:', navResult);
} catch (error) {
    console.error('Navigation failed:', error);
}

// Print final state
console.log('Final system state:', systemState);
