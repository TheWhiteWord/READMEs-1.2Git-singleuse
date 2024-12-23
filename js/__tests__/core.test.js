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
test('System Initialization', () => {
    resetStateFile();
    const initResult = system_init(testMd);
    expect(initResult.status).toBe('initialized');
    expect(initResult.functions).toBe(1);
    expect(initResult.templates).toBe(1);
    expect(initResult.warmholes).toBe(2);
    console.log('Initialization test:', initResult);
});

// Test function execution
test('Function Execution', () => {
    const execResult = execute('test_function', { input: 'hello world' });
    expect(execResult.status).toBe('success');
    expect(execResult.result).toBe('HELLO WORLD');
    expect(execResult.format).toBe('string');
    console.log('Execution test:', execResult);
});

// Test warmhole navigation
test('Warmhole Navigation', () => {
    const navResult = navigateWarmhole('test_warmhole');
    expect(navResult.status).toBe('navigated');
    expect(navResult.to).toBe('next_test');
    expect(systemState.variables.text).toBe('hello world');
    console.log('Navigation test:', navResult);
});

// Test state persistence
test('State Persistence', () => {
    saveState();
    loadState();
    expect(systemState.variables.text).toBe('hello world');
    console.log('State persistence test:', systemState);
});

// Test LLM-driven execution (mocked)
test('LLM-Driven Execution', async () => {
    const mockChatWithLLM = jest.fn().mockResolvedValue(JSON.stringify({
        steps: [
            { type: 'navigate', warmhole: 'test_warmhole', context: { text: 'hello world' } },
            { type: 'execute', function: 'test_function', input: { text: 'hello world' } }
        ],
        userMessage: 'Execution complete'
    }));
    const originalChatWithLLM = require('../llm_interaction').chatWithLLM;
    require('../llm_interaction').chatWithLLM = mockChatWithLLM;

    const result = await processUserIntent('Process text', { systemState, activeWarmhole: 'test_warmhole' });
    expect(result.status).toBe('complete');
    expect(result.message).toBe('Execution complete');
    expect(result.results.length).toBe(2);

    // Restore original function
    require('../llm_interaction').chatWithLLM = originalChatWithLLM;
    console.log('LLM-Driven Execution test:', result);
});

// Print final state
console.log('Final system state:', systemState);
