const { system_init, execute } = require('../core_logic');
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

test('Function execution with missing input', () => {
    const context = {};
    expect(() => execute('process_text', context)).toThrow('No function or template found with name: process_text');
});

test('Template execution with valid input', () => {
    const context = { text: 'hello world' };
    const result = execute('text_processor', context);
    
    expect(result.status).toBe('success');
    expect(result.result).toBe('HELLO WORLD');
    expect(result.format).toBe('string');
});

test('Template execution with missing input', () => {
    const context = {};
    expect(() => execute('text_processor', context)).toThrow();
});
