const { chatWithLLM, generateCode, analyzeState, processUserIntent } = require('../js/llm_interaction');
const assert = require('assert');

describe('LLM Interaction', () => {
    it('should chat with LLM and receive a valid response', async () => {
        const message = 'Hello, LLM!';
        try {
            const response = await chatWithLLM(message);
            assert.strictEqual(typeof response, 'string');
        } catch (error) {
            assert.fail('Failed to chat with LLM');
        }
    });

    it('should generate code based on a prompt', async () => {
        const prompt = 'Generate a function to add two numbers in JavaScript.';
        try {
            const code = await generateCode(prompt);
            assert.strictEqual(typeof code, 'string');
        } catch (error) {
            assert.fail('Failed to generate code with LLM');
        }
    });

    it('should analyze the system state and provide feedback', async () => {
        const state = { key: 'value' };
        try {
            const feedback = await analyzeState(state);
            assert.strictEqual(typeof feedback, 'string');
        } catch (error) {
            assert.fail('Failed to analyze state with LLM');
        }
    });

    it('should process user intent and generate an execution plan', async () => {
        const readmeContent = '# Sample README\n## Section';
        const systemState = { functions: {}, warmholes: {} };
        try {
            const plan = await processUserIntent(readmeContent, systemState);
            assert.strictEqual(typeof plan, 'object');
            assert.ok(plan.steps);
        } catch (error) {
            assert.fail('Failed to process user intent with LLM');
        }
    });
});
