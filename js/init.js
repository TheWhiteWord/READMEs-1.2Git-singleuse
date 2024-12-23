const core = require('./core_logic');
const fs = require('fs');

// Read all .md files in the project
function loadAllMarkdownFiles() {
    const files = fs.readdirSync('.');
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    let allContent = '';
    mdFiles.forEach(file => {
        allContent += fs.readFileSync(file, 'utf8') + '\n\n';
    });
    
    return allContent;
}

// Initialize system
const content = loadAllMarkdownFiles();
const result = core.system_init(content);
console.log('System initialization result:', result);

// Export global functions
global.execute = core.execute;
global.navigateWarmhole = core.navigateWarmhole;

module.exports = {
    result,
    systemState: core.systemState
};
