const { system_init, execute, navigateWarmhole, systemState } = require('../core_logic');
const fs = require('fs');
const path = require('path');

// Sample README content for testing
const sampleReadmeContent = `
# Function: process_text
- description: "Processes input text"
- input: text: string
- output: result: string
- template: text_processor

# Template: text_processor
- input_placeholder: "{{text}}"
- transform: |
    return context.text.toUpperCase();
- output_format: string

# Warmhole: start
- description: "Start warmhole"
- state_transfer: ["text"]
- condition: "true"
- next_warmhole: "process"

# Warmhole: process
- description: "Process warmhole"
- state_transfer: ["result"]
- condition: "true"
- next_warmhole: "end"

# Warmhole: end
- description: "End warmhole"
- state_transfer: []
- condition: "true"
- next_warmhole: ""
`;

// Initialize the system with sample content
beforeAll(() => {
    system_init(sampleReadmeContent);
});

test('Function execution with valid input', () => {
    const context = { input: 'hello world' };
    const result = execute('process_text', context);
    
    expect(result.status).toBe('success');
    expect(result.result).toBe('HELLO WORLD');
    expect(result.format).toBe('string');
});

test('Warmhole navigation and state transfer', () => {
    // Initial context
    let context = { text: 'hello world' };
    
    // Navigate to start warmhole
    let navResult = navigateWarmhole('start');
    expect(navResult.status).toBe('navigated');
    expect(navResult.to).toBe('process');
    expect(systemState.variables.text).toBe('hello world');
    
    // Execute function in process warmhole
    const execResult = execute('process_text', { text: systemState.variables.text });
    expect(execResult.status).toBe('success');
    expect(execResult.result).toBe('HELLO WORLD');
    
    // Update context with result
    context = { result: execResult.result };
    
    // Navigate to process warmhole
    navResult = navigateWarmhole('process');
    expect(navResult.status).toBe('navigated');
    expect(navResult.to).toBe('end');
    expect(systemState.variables.result).toBe('HELLO WORLD');
    
    // Navigate to end warmhole
    navResult = navigateWarmhole('end');
    expect(navResult.status).toBe('navigated');
    expect(navResult.to).toBe('');
});
