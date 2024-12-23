const ollama = require('ollama');

/**
 * Sends a message to the LLM and receives a response.
 * @param {string} message - The message to send to the LLM.
 * @returns {Promise<string>} - The response from the LLM.
 */
async function chatWithLLM(message) {
    try {
        console.log('Sending message to LLM:', message); // Log the request
        const response = await ollama.default.chat({
            model: 'hf.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF:Q6_K',
            messages: [{ role: 'user', content: message }]
        });
        console.log('LLM response:', response); // Log the response
        if (!response.message || !response.message.content) {
            throw new Error('Invalid response from LLM');
        }
        return response.message.content;
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
        console.log('Sending prompt to LLM:', prompt); // Log the request
        const response = await ollama.default.generate({
            model: 'hf.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF:Q6_K',
            prompt: prompt
        });
        console.log('LLM response:', response); // Log the response
        if (!response.message || !response.message.content) {
            throw new Error('Invalid response from LLM');
        }
        return response.message.content;
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
        const message = `Analyze the following state: ${JSON.stringify(state)}`;
        console.log('Sending state analysis request to LLM:', message); // Log the request
        const response = await ollama.default.chat({
            model: 'hf.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF:Q6_K',
            messages: [{ role: 'user', content: message }]
        });
        console.log('LLM response:', response); // Log the response
        if (!response.message || !response.message.content) {
            throw new Error('Invalid response from LLM');
        }
        return response.message.content;
    } catch (error) {
        console.error('Error analyzing state:', error);
        throw error;
    }
}

/**
 * Analyzes the README.md content and generates an execution plan.
 * @param {string} readmeContent - The content of the README.md file.
 * @returns {Promise<string>} - The execution plan generated by the LLM.
 */
async function processUserIntent(readmeContent) {
    try {
        const message = `Analyze the following README content and generate an execution plan: ${readmeContent}`;
        console.log('Sending README analysis request to LLM:', message); // Log the request
        const response = await ollama.default.chat({
            model: 'hf.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF:Q6_K',
            messages: [{ role: 'user', content: message }]
        });
        console.log('LLM response:', response); // Log the response
        if (!response.message || !response.message.content) {
            throw new Error('Invalid response from LLM');
        }
        return response.message.content;
    } catch (error) {
        console.error('Error processing user intent:', error);
        throw error;
    }
}

module.exports = {
    chatWithLLM,
    generateCode,
    analyzeState,
    processUserIntent
};
