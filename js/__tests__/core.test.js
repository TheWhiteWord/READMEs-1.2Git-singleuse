const { system_init, execute, navigateWarmhole, systemState, saveState, loadState } = require('../core_logic');
const fs = require('fs');
const path = require('path');

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
    return context.text.toUpperCase();
- output_format: string

# Warmhole: test_warmhole
- description: "Test warmhole"
- state_transfer: ["text"]
- condition: "true"
- next_warmhole: "next_test"

# Warmhole: next_test
- description: "Next test warmhole"
- state_transfer: []
- condition: "true"
- next_warmhole: ""
`;

// Path to the state file
const stateFilePath = path.join(__dirname, '../state.json');

// Helper function to reset state file
function resetStateFile() {
    if (fs.existsSync(stateFilePath)) {
        fs.unlinkSync(stateFilePath);
    }
}

// Run tests
console.log('Starting tests...');

// Test system initialization
try {
    resetStateFile();
    const initResult = system_init(testMd);
    console.log('Initialization test:', initResult);
} catch (error) {
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

// Test state persistence
try {
    saveState();
    loadState();
    console.log('State persistence test:', systemState);
} catch (error) {
    console.error('State persistence failed:', error);
}

// Print final state
console.log('Final system state:', systemState);
