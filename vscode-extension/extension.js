const vscode = require('vscode');
const { system_init, execute, navigateWarmhole } = require('../js/core_logic');

let systemState = null;

function activate(context) {
    console.log('READMEs extension is active');

    // Initialize system when opening a markdown file
    vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId === 'markdown') {
            systemState = system_init(doc.getText());
        }
    });

    // Register execute command
    let executeCommand = vscode.commands.registerCommand('readmes.execute', async () => {
        const functionName = await vscode.window.showInputBox({
            prompt: 'Enter function name'
        });
        const input = await vscode.window.showInputBox({
            prompt: 'Enter input'
        });
        
        try {
            const result = execute(functionName, { input });
            vscode.window.showInformationMessage(`Result: ${result.result}`);
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
        }
    });

    // Register navigate command
    let navigateCommand = vscode.commands.registerCommand('readmes.navigate', async () => {
        const warmholeId = await vscode.window.showInputBox({
            prompt: 'Enter warmhole ID'
        });
        
        try {
            const result = navigateWarmhole(warmholeId);
            vscode.window.showInformationMessage(`Navigated to: ${result.to}`);
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
        }
    });

    context.subscriptions.push(executeCommand, navigateCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
