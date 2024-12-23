const { system_init, execute, navigateWarmhole, systemState } = require('../core_logic');

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
    debugger; // Breakpoint 1: Before initialization
    const initResult = system_init(testMd);
    debugger; // Breakpoint 2: After initialization
    console.log('Initialization test:', initResult);
} catch (error) {
    debugger; // Breakpoint 3: If error occurs
    console.error('Initialization failed:', error);
}

// Test function execution
try {
    debugger; // Breakpoint 4: Before function execution
    const execResult = execute('test_function', { input: 'hello world' });
    debugger; // Breakpoint 5: After function execution
    console.log('Execution test:', execResult);
} catch (error) {
    debugger; // Breakpoint 6: If error occurs
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
