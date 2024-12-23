const vscode = require('vscode');
const { system_init, processUserIntent, getSystemContext } = require('../js/core_logic');
const fs = require('fs');
const path = require('path');

// Track active system state
let systemState = null;
let statusBarItem;
let activeWarmhole = null;

function activate(context) {
    console.log('READMEs extension is active');

    // Ensure required directories exist
    const logBasePath = path.join(process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local'), 'Code', 'logs');
    
    try {
        if (!fs.existsSync(logBasePath)) {
            fs.mkdirSync(logBasePath, { recursive: true });
        }
    } catch (err) {
        // Non-fatal error, just log it
        console.error('Failed to create logs directory:', err);
    }

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

    // Add hover provider for functions and warmholes
    const hoverProvider = vscode.languages.registerHoverProvider('markdown', {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return;
            
            const word = document.getText(range);
            
            // Check if word is a function or warmhole name
            if (systemState?.functions[word]) {
                return {
                    contents: [`Function: ${word}`, systemState.functions[word].description]
                };
            }
            if (systemState?.warmholes[word]) {
                return {
                    contents: [`Warmhole: ${word}`, systemState.warmholes[word].description]
                };
            }
        }
    });

    // Register execute command with natural language input
    let executeCommand = vscode.commands.registerCommand('readmes.execute', async () => {
        if (!systemState) {
            vscode.window.showErrorMessage('System not initialized');
            return;
        }

        // Get user intent via input box
        const userIntent = await vscode.window.showInputBox({
            placeHolder: 'What would you like to do?',
            prompt: 'Enter your request in natural language'
        });

        if (userIntent) {
            try {
                statusBarItem.text = 'READMEs: Processing...';
                
                // Process user intent through LLM
                const result = await processUserIntent(userIntent, {
                    systemState,
                    activeWarmhole,
                    context: getSystemContext()
                });

                // Update status and show result
                statusBarItem.text = `READMEs: ${result.status}`;
                vscode.window.showInformationMessage(result.message);
                
                // Update active warmhole if changed
                if (result.activeWarmhole) {
                    activeWarmhole = result.activeWarmhole;
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            }
        }
    });

    context.subscriptions.push(statusBarItem, hoverProvider, executeCommand);
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
