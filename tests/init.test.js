const core = require('../js/core_logic');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Initialization', () => {
    it('should load all markdown files and initialize the system', () => {
        // Mock the loadAllMarkdownFiles function
        const loadAllMarkdownFiles = () => {
            const files = fs.readdirSync(path.join(__dirname, '../'));
            const mdFiles = files.filter(f => f.endsWith('.md'));
            
            let allContent = '';
            mdFiles.forEach(file => {
                allContent += fs.readFileSync(path.join(__dirname, '../', file), 'utf8') + '\n\n';
            });
            
            return allContent;
        };

        // Load system state
        core.loadState();

        // Initialize system
        const content = loadAllMarkdownFiles();
        const result = core.system_init(content);
        assert.strictEqual(typeof result, 'object');
        assert.strictEqual(typeof core.systemState, 'object');
    });
});
