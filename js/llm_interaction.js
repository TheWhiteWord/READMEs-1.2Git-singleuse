const axios = require('axios');

/**
 * Sends a message to the LLM and receives a response.
 * @param {string} message - The message to send to the LLM.
 * @returns {Promise<string>} - The response from the LLM.
 */
async function chatWithLLM(message) {
    try {
        const response = await axios.post('https://api.example.com/llm', { request: message });
        return response.data;
    } catch (error) {
        console.error('Error interacting with LLM:', error);
        throw error;
    }
}

/**
 * Uses the LLM to generate code based on a prompt.
 * @param {string} prompt - The prompt to send to the LLM.
 * @returns {Promise<string>} - The generated code from the LLM.
 */
async function generateCode(prompt) {
    try {
        const response = await axios.post('https://api.llm.example.com/generate', { prompt });
        return response.data.code;
    } catch (error) {
        console.error('Error generating code with LLM:', error);
        return 'Error generating code.';
    }
}

/**
 * Uses the LLM to analyze the system state and provide feedback.
 * @param {Object} state - The current system state.
 * @returns {Promise<string>} - The feedback from the LLM.
 */
async function analyzeState(state) {
    try {
        const response = await axios.post('https://api.example.com/analyze', { state });
        return response.data;
    } catch (error) {
        console.error('Error analyzing state:', error);
        throw error;
    }
}

module.exports = {
    chatWithLLM,
    generateCode,
    analyzeState
};
