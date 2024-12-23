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
            "readmes_programming_system_": { type: "section", line: "# READMEs Programming System" },
            "readmes_programming_system_.system_configuration_": { type: "section", line: "## System Configuration" },
            "readmes_programming_system_.system_configuration_.llm_optimization_features_": { type: "section", line: "### LLM Optimization Features" }
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
