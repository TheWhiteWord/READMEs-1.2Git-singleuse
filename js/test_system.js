const { system_init, execute, navigateWarmhole, processUserIntent, loadState, saveState, systemState } = require('./core_logic');
const fs = require('fs');

// Helper function to load README content
function loadReadmeContent() {
    const readmePath = '../README.md';
    if (fs.existsSync(readmePath)) {
        return fs.readFileSync(readmePath, 'utf8');
    }
    throw new Error('README.md file not found');
}

// Initialize the system
function initializeSystem() {
    const readmeContent = loadReadmeContent();
    const initResult = system_init(readmeContent);
    console.log('System initialization result:', initResult);
}

// Test function execution
function testFunctionExecution() {
    try {
        const execResult = execute('process_intent', { message: 'hello world' });
        console.log('Function execution result:', execResult);
    } catch (error) {
        console.error('Function execution failed:', error);
    }
}

// Test warmhole navigation
function testWarmholeNavigation() {
    try {
        const navResult = navigateWarmhole('intent_processor');
        console.log('Warmhole navigation result:', navResult);
    } catch (error) {
        console.error('Warmhole navigation failed:', error);
    }
}

// Test user intent processing
async function testUserIntentProcessing() {
    try {
        const result = await processUserIntent('Process this dataset and generate a report', {
            systemState,
            activeWarmhole: 'intent_processor'
        });
        console.log('User intent processing result:', result);
    } catch (error) {
        console.error('User intent processing failed:', error);
    }
}

// Run all tests
function runTests() {
    loadState();
    initializeSystem();
    testFunctionExecution();
    testWarmholeNavigation();
    testUserIntentProcessing().then(() => {
        console.log('All tests completed');
        saveState();
    });
}

runTests();
