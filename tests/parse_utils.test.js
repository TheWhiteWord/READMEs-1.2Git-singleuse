const { extractByRegex, parseFunctionDef, parseTemplateDef, parseWarmholeDef } = require('../js/parse_utils');
const assert = require('assert');

describe('Parse Utils', () => {
    it('should extract content using regex pattern with named groups', () => {
        const content = '# Function: test_function\n- description: "Test function"';
        const pattern = /# Function:\s*(?<name>\w+)\s*\n-\s*description:\s*"(?<description>[^"]+)"/;
        const matches = extractByRegex(content, pattern);
        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].name, 'test_function');
        assert.strictEqual(matches[0].description, 'Test function');
    });

    it('should parse function definition from markdown', () => {
        const content = '# Function: test_function\n- description: "Test function"\n- input: param: string\n- output: result: string\n- template: test_template';
        const functionDef = parseFunctionDef(content);
        assert.strictEqual(functionDef.name, 'test_function');
        assert.strictEqual(functionDef.description, 'Test function');
        assert.strictEqual(functionDef.input.name, 'param');
        assert.strictEqual(functionDef.input.type, 'string');
        assert.strictEqual(functionDef.output.name, 'result');
        assert.strictEqual(functionDef.output.type, 'string');
        assert.strictEqual(functionDef.template, 'test_template');
    });

    it('should parse template definition from markdown', () => {
        const content = '# Template: test_template\n- input_placeholder: "{{param}}"\n- transform: |\n    return param;\n- output_format: string';
        const templateDef = parseTemplateDef(content);
        assert.strictEqual(templateDef.name, 'test_template');
        assert.strictEqual(templateDef.placeholder, '{{param}}');
        assert.strictEqual(templateDef.transform, 'return param;');
        assert.strictEqual(templateDef.outputFormat, 'string');
    });

    it('should parse warmhole definition from markdown', () => {
        const content = '# Warmhole: test_warmhole\n- description: "Test warmhole"\n- state_transfer: ["param", "result"]\n- condition: "true"';
        const warmholeDef = parseWarmholeDef(content);
        assert.strictEqual(warmholeDef.name, 'test_warmhole');
        assert.strictEqual(warmholeDef.description, 'Test warmhole');
        assert.deepStrictEqual(warmholeDef.state_transfer, ['param', 'result']);
        assert.strictEqual(warmholeDef.condition, 'true');
    });
});
