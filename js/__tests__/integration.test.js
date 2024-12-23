const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const rimraf = require('rimraf');
const { chat, save, showHistory, execute } = require('../ide_extension');
const { loadState, saveState } = require('../state');
const { initGitRepo, createNewBranch, commitChanges } = require('../git_manager');
const { chatWithLLM, generateCode } = require('../llm_interaction');

jest.mock('../llm_interaction');

describe('System Integration Tests', () => {
    const testStateFile = path.join(__dirname, '../state.json');
    const testFilePath = path.join(__dirname, '../test.txt');
    const gitDir = path.join(__dirname, '../.git');

    // Helper function to log Git status
    const logGitStatus = (context) => {
        try {
            const branch = execSync('git branch --show-current').toString().trim();
            const status = execSync('git status --porcelain').toString();
            console.log(`[${context}] Current branch: ${branch}`);
            console.log(`[${context}] Git status: ${status || 'clean'}`);
        } catch (error) {
            console.error(`Error logging git status (${context}):`, error.message);
        }
    };

    beforeAll(() => {
        // Clean up any existing Git repository
        [
            gitDir,
            path.join(gitDir, 'config'),
            path.join(gitDir, 'hooks'),
            path.join(gitDir, 'info')
        ].forEach(dir => {
            try {
                rimraf.sync(dir);
            } catch (error) {
                console.error(`Error removing ${dir}:`, error.message);
            }
        });

        // Initialize fresh Git repository
        let retries = 3;
        while (retries > 0) {
            try {
                execSync('git init --bare');
                execSync('git config core.bare false');
                retries = 0; // Success
            } catch (error) {
                console.error(`Error initializing git (retries left: ${retries}):`, error.message);
                retries--;
                if (retries === 0) throw error;
            }
        }

        // Configure Git
        try {
            execSync('git config user.email "test@example.com"');
            execSync('git config user.name "Test User"');
            execSync('git checkout -b main');
            execSync('touch .gitkeep');
            execSync('git add .');
            execSync('git commit -m "Initial commit"');
        } catch (error) {
            console.error('Error in Git setup:', error.message);
            throw error;
        }
    });

    beforeEach(() => {
        // Log initial state
        logGitStatus('beforeEach start');

        // Clean working directory
        try {
            execSync('git clean -fd');
        } catch (error) {
            console.error('Error cleaning working directory:', error.message);
        }

        // Create new test branch
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const branchName = `test-${timestamp}`;
        try {
            execSync(`git checkout -b ${branchName}`);
        } catch (error) {
            console.error('Error creating test branch:', error.message);
        }

        // Create test file and state
        fs.writeFileSync(testFilePath, `test-content-${timestamp}`);
        
        // Log final state
        logGitStatus('beforeEach end');
    });

    afterEach(() => {
        // Log initial state
        logGitStatus('afterEach start');

        // Clean up test files
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }

        // Switch back to main branch
        try {
            const currentBranch = execSync('git branch --show-current').toString().trim();
            execSync('git checkout main');
            execSync(`git branch -D ${currentBranch}`);
        } catch (error) {
            console.error('Error cleaning up test branch:', error.message);
        }

        // Log final state
        logGitStatus('afterEach end');
    });

    test('Full workflow: Chat -> Execute -> Save -> Show History', async () => {
        // Mock LLM responses
        chatWithLLM.mockResolvedValue('Mock LLM response');
        generateCode.mockResolvedValue('function test() { return true; }');

        // Test chat functionality
        await chat('Test message');
        expect(chatWithLLM).toHaveBeenCalledWith('Test message');

        // Test function execution
        await execute('testFunction', ['arg1', 'arg2']);
        expect(generateCode).toHaveBeenCalled();

        // Test state management
        const testState = { test: 'value' };
        saveState(testState);
        const loadedState = loadState();
        expect(loadedState).toEqual(testState);

        // Test Git integration
        save();
        const history = showHistory();
        expect(history).toBeDefined();
    });

    test('State persistence across Git operations', () => {
        // Save initial state
        const initialState = { key: 'value' };
        saveState(initialState);

        // Perform Git operations
        createNewBranch();
        commitChanges();

        // Verify state is preserved
        const loadedState = loadState();
        expect(loadedState).toEqual(initialState);
    });

    test('Error handling and recovery', async () => {
        // Mock LLM error
        chatWithLLM.mockRejectedValue(new Error('LLM error'));

        // Test error handling in chat
        await chat('Test message');
        expect(chatWithLLM).toHaveBeenCalled();

        // Test state preservation during errors
        const testState = { error: 'test' };
        saveState(testState);
        const loadedState = loadState();
        expect(loadedState).toEqual(testState);
    });

    test('System state consistency', async () => {
        // Test state changes during operations
        const initialState = { status: 'initial' };
        saveState(initialState);

        // Simulate system operations
        await execute('updateState', ['new status']);
        save();

        // Verify state consistency
        const finalState = loadState();
        expect(finalState).toBeDefined();
        expect(Object.keys(finalState)).toContain('status');
    });
});
