const { system_init, execute, navigateWarmhole, processUserIntent, loadState, saveState, systemState } = require('./core_logic');
const fs = require('fs');
const path = require('path');

// Helper function to load README content
function loadReadmeContent() {
    const readmePath = path.join(__dirname, '../README.md');
    if (fs.existsSync(readmePath)) {
        return fs.readFileSync(readmePath, 'utf8');
    }
    throw new Error('README.md file not found in the root directory');
}

// Initialize the system
function initializeSystem() {
    const readmeContent = loadReadmeContent();
    const initResult = system_init(readmeContent);
    console.log('System initialization result:', initResult);
}

// Test function execution
async function testFunctionExecution() {
    try {
        loadState(); // Load the state before execution
        const execResult = await execute('process_intent', { message: 'hello world' });
        console.log('Function execution result:', execResult);
        saveState(); // Save the state after execution
    } catch (error) {
        console.error('Function execution failed:', error);
    }
}

// Test warmhole navigation
function testWarmholeNavigation() {
    try {
        loadState(); // Load the state before navigation
        const navResult = navigateWarmhole('intent_processor');
        console.log('Warmhole navigation result:', navResult);
        saveState(); // Save the state after navigation
    } catch (error) {
        console.error('Warmhole navigation failed:', error);
    }
}

// Test user intent processing
async function testUserIntentProcessing() {
    try {
        loadState(); // Load the state before processing user intent
        const result = await processUserIntent('Process this dataset and generate a report', {
            systemState,
            activeWarmhole: 'intent_processor'
        });
        console.log('User intent processing result:', result);
        saveState(); // Save the state after processing user intent
    } catch (error) {
        console.error('User intent processing failed:', error);
    }
}

// Run all tests
async function runTests() {
    loadState();
    initializeSystem();
    await testFunctionExecution();
    testWarmholeNavigation();
    await testUserIntentProcessing();
    console.log('All tests completed');
    saveState();
}

runTests();
