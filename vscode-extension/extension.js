const vscode = require('vscode');
const { system_init, execute, navigateWarmhole } = require('../js/core_logic');

// Track active system state
let systemState = null;
let statusBarItem;
let activeWarmhole = null;

function activate(context) {
    console.log('READMEs extension is active');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = "READMEs: Ready";
    statusBarItem.show();
    
    // Register text decoration type for warmholes
    const warmholeDecoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(100, 100, 255, 0.2)',
        border: '1px solid rgba(100, 100, 255, 0.5)'
    });

    // Initialize system when opening a markdown file
    vscode.workspace.onDidOpenTextDocument(doc => {
        if (doc.languageId === 'markdown') {
            try {
                systemState = system_init(doc.getText());
                statusBarItem.text = `READMEs: ${Object.keys(systemState.functions).length} functions`;
                highlightWarmholes(vscode.window.activeTextEditor, warmholeDecoration);
            } catch (error) {
                vscode.window.showErrorMessage(`Initialization failed: ${error.message}`);
            }
        }
    });

    // Update on editor changes
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'markdown') {
            highlightWarmholes(vscode.window.activeTextEditor, warmholeDecoration);
        }
    });

    // Register execute command with quick pick
    let executeCommand = vscode.commands.registerCommand('readmes.execute', async () => {
        if (!systemState?.functions) {
            vscode.window.showErrorMessage('System not initialized');
            return;
        }

        const functionNames = Object.keys(systemState.functions);
        const selected = await vscode.window.showQuickPick(functionNames, {
            placeHolder: 'Select function to execute'
        });

        if (selected) {
            const input = await vscode.window.showInputBox({
                prompt: `Enter input for ${selected}`
            });
            
            try {
                const result = execute(selected, { input });
                vscode.window.showInformationMessage(`Result: ${result.result}`);
            } catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        }
    });

    // Register navigate command with quick pick
    let navigateCommand = vscode.commands.registerCommand('readmes.navigate', async () => {
        if (!systemState?.warmholes) {
            vscode.window.showErrorMessage('System not initialized');
            return;
        }

        const warmholeIds = Object.keys(systemState.warmholes);
        const selected = await vscode.window.showQuickPick(warmholeIds, {
            placeHolder: 'Select warmhole to navigate'
        });
        
        if (selected) {
            try {
                const result = navigateWarmhole(selected);
                activeWarmhole = result.to;
                statusBarItem.text = `READMEs: At ${activeWarmhole}`;
                vscode.window.showInformationMessage(`Navigated to: ${result.to}`);
            } catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        }
    });

    context.subscriptions.push(executeCommand, navigateCommand, statusBarItem);
}

function highlightWarmholes(editor, decoration) {
    if (!editor) return;

    const text = editor.document.getText();
    const warmholeRegex = /# Warmhole:\s+(\w+)[^\n]*/g;
    const decorations = [];
    
    let match;
    while ((match = warmholeRegex.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);
        const decoration = { range: new vscode.Range(startPos, endPos) };
        decorations.push(decoration);
    }

    editor.setDecorations(decoration, decorations);
}

function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
