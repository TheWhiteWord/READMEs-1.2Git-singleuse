const { chatWithLLM, generateCode, analyzeState, processUserIntent } = require('../js/llm_interaction');
const assert = require('assert');

describe('LLM Interaction', () => {
    it('should chat with LLM and receive a valid response', async () => {
        const message = 'Hello, LLM!';
        try {
            const response = await chatWithLLM(message);
            assert.strictEqual(typeof response, 'string');
            assert.ok(response.length > 0, 'Response should not be empty');
        } catch (error) {
            assert.fail(`Failed to chat with LLM: ${error.message}`);
        }
    });

    it('should generate code based on a prompt', async () => {
        const prompt = 'Generate a function to add two numbers in JavaScript.';
        try {
            const code = await generateCode(prompt);
            assert.strictEqual(typeof code, 'string');
            assert.ok(code.includes('function'), 'Generated code should include a function');
        } catch (error) {
            assert.fail(`Failed to generate code with LLM: ${error.message}`);
        }
    });

    it('should analyze the system state and provide feedback', async () => {
        const state = { key: 'value' };
        try {
            const feedback = await analyzeState(state);
            assert.strictEqual(typeof feedback, 'string');
            assert.ok(feedback.length > 0, 'Feedback should not be empty');
        } catch (error) {
            assert.fail(`Failed to analyze state with LLM: ${error.message}`);
        }
    });

    it('should process user intent and generate an execution plan', async () => {
        const readmeContent = '# Sample README\n## Section';
        const systemState = { functions: {}, warmholes: {} };
        try {
            const plan = await processUserIntent(readmeContent, systemState);
            assert.strictEqual(typeof plan, 'object');
            assert.ok(plan.steps, 'Plan should contain steps');
        } catch (error) {
            assert.fail(`Failed to process user intent with LLM: ${error.message}`);
        }
    });

    it('should handle LLM API errors gracefully', async () => {
        const invalidMessage = null; // Invalid input to trigger an error
        try {
            await chatWithLLM(invalidMessage);
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.strictEqual(error.message, 'Invalid response from LLM');
        }

        const invalidPrompt = null; // Invalid input to trigger an error
        try {
            await generateCode(invalidPrompt);
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.strictEqual(error.message, 'Invalid response from LLM');
        }

        const invalidState = null; // Invalid input to trigger an error
        try {
            await analyzeState(invalidState);
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.strictEqual(error.message, 'Invalid response from LLM');
        }

        const invalidReadmeContent = null; // Invalid input to trigger an error
        try {
            await processUserIntent(invalidReadmeContent, systemState);
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.strictEqual(error.message, 'Invalid response from LLM');
        }
    });
});
