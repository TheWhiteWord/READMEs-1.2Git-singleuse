const cacheMetadata = require('../js/cache_metadata');
const assert = require('assert');

describe('cacheMetadata', () => {
    it('should parse headers and generate IDs correctly', () => {
        const mdContent = `
# READMEs Programming System
## System Configuration
### LLM Optimization Features
`;
        const expectedMetadata = {
            "readmes_programming_system": { type: "section", line: "# READMEs Programming System" },
            "readmes_programming_system_system_configuration": { type: "section", line: "## System Configuration" },
            "readmes_programming_system_system_configuration_llm_optimization_features": { type: "section", line: "### LLM Optimization Features" }
        };
        const metadata = cacheMetadata(mdContent);
        assert.deepStrictEqual(metadata, expectedMetadata);
    });

    it('should return an empty object for content without headers', () => {
        const mdContent = `
This is a test content without any headers.
`;
        const metadata = cacheMetadata(mdContent);
        assert.deepStrictEqual(metadata, {});
    });
});
