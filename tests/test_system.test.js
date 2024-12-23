const { initializeSystem, testFunctionExecution, testWarmholeNavigation, testUserIntentProcessing, testLLMInteraction } = require('../js/test_system');
const { systemState } = require('../js/core_logic');
const assert = require('assert');

describe('Test System', () => {
    it('should initialize the system', () => {
        initializeSystem();
        assert.strictEqual(typeof systemState, 'object');
    });

    it('should execute a function', async () => {
        await testFunctionExecution();
        assert.strictEqual(typeof systemState.previousOutput, 'object');
    });

    it('should navigate through a warmhole', async () => {
        await testWarmholeNavigation();
        assert.strictEqual(typeof systemState.currentContext, 'object');
    });

    it('should process user intent', async () => {
        await testUserIntentProcessing();
        assert.strictEqual(typeof systemState.currentContext, 'object');
    });

    it('should interact with the LLM', async () => {
        await testLLMInteraction();
        assert.strictEqual(typeof systemState.previousOutput, 'object');
    });
});
