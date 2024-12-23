const { system_init, execute, navigateWarmhole, loadState, saveState, systemState } = require('../js/core_logic');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Core Logic', () => {
    before(() => {
        // Setup: Ensure the state file exists
        const stateFilePath = path.join(__dirname, '../js/state.json');
        if (!fs.existsSync(stateFilePath)) {
            fs.writeFileSync(stateFilePath, JSON.stringify(systemState, null, 2));
        }
    });

    it('should initialize the system with README content', async () => {
        const readmeContent = '# Sample README\n## Section';
        const result = await system_init(readmeContent);
        assert.strictEqual(typeof result, 'object');
    });

    it('should execute a function or template', async () => {
        const context = { message: 'test' };
        const result = await execute('process_intent', context);
        assert.strictEqual(typeof result, 'object');
    });

    it('should navigate through a warmhole', async () => {
        const result = await navigateWarmhole('intent_processor');
        assert.strictEqual(typeof result, 'object');
    });

    it('should load and save the system state', async () => {
        loadState();
        assert.strictEqual(typeof systemState, 'object');
        saveState();
        const stateFilePath = path.join(__dirname, '../js/state.json');
        const savedState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
        assert.deepStrictEqual(savedState, systemState);
    });
});
