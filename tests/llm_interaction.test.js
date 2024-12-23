const { chatWithLLM, generateCode, analyzeState, processUserIntent } = require('../js/llm_interaction');
const assert = require('assert');

describe('LLM Interaction', () => {
    it('should chat with LLM and receive a valid response', async () => {
        const message = 'Hello, LLM!';
        const response = await chatWithLLM(message);
        assert.strictEqual(typeof response, 'string');
    });

    it('should generate code based on a prompt', async () => {
        const prompt = 'Generate a function to add two numbers in JavaScript.';
        const code = await generateCode(prompt);
        assert.strictEqual(typeof code, 'string');
    });

    it('should analyze the system state and provide feedback', async () => {
        const state = { key: 'value' };
        const feedback = await analyzeState(state);
        assert.strictEqual(typeof feedback, 'string');
    });

    it('should process user intent and generate an execution plan', async () => {
        const readmeContent = '# Sample README\n## Section';
        const systemState = { functions: {}, warmholes: {} };
        const plan = await processUserIntent(readmeContent, systemState);
        assert.strictEqual(typeof plan, 'object');
        assert.ok(plan.steps);
    });
});
