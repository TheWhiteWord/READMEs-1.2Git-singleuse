const { chatWithLLM, generateCode, analyzeState } = require('./llm_interaction');
const { loadState, saveState } = require('./state');
const { initGitRepo, createNewBranch, commitChanges, showGitHistory, switchBranch } = require('./git_manager');

initGitRepo();
createNewBranch();

let state = loadState();

/**
 * Chat with the LLM and display the response.
 * @param {string} message - The message to send to the LLM.
 */
async function chat(message) {
    const response = await chatWithLLM(message);
    console.log('LLM:', response);
}

/**
 * Save the current state and commit changes.
 */
function save() {
    saveState(state);
    commitChanges();
    console.log('State saved and changes committed.');
}

/**
 * Display the session history.
 */
function showHistory() {
    showGitHistory();
}

/**
 * Execute a function defined in the system.
 * @param {string} functionName - The name of the function to execute.
 * @param {Array} args - The arguments to pass to the function.
 */
async function execute(functionName, args) {
    // Example implementation, replace with actual function execution logic
    const result = await generateCode(`Execute function ${functionName} with arguments ${args}`);
    console.log('Execution result:', result);
}

module.exports = {
    chat,
    save,
    showHistory,
    execute
};
