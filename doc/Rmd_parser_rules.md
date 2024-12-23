# Function: execute_regex
```markdown
- description: "Executes a regex on a string and returns the matches"
- input: md: string, pattern: string
- output: matches: array
- template: regex_executor_template
```

# Template: regex_executor_template
```markdown
- input_placeholder: "{{md}}, {{pattern}}"
- transform: |
    const matches = [];
    const regex = new RegExp(pattern, 'g');
    let match;
    while ((match = regex.exec(md)) !== null) {
        matches.push(match.groups);
    }
    return matches;
- output_format: array
```

# Function: parse_section
```markdown
- description: "Parses a specific section using a given regex pattern"
- input: md: string, pattern: string
- output: sections: array
- template: section_parser_template
```

# Template: section_parser_template
```markdown
- input_placeholder: "{{md}}, {{pattern}}"
- transform: |
    return execute_regex(md, pattern);
- output_format: array
```

# Function: parse_warmhole
```markdown
- description: "Parses warmholes with optional LLM-powered features"
- input: md: string
- output: warmholes: array
- template: warmhole_parser_template
```

# Template: warmhole_parser_template
```markdown
- input_placeholder: "{{md}}"
- transform: |
    return execute_regex(md, '# Warmhole: (\\w+)\\n- description: "([^"]+)"\\n- state_transfer: \\[([^\\]]+)\\]\\n- condition: "([^"]+)"\\n- next_warmhole: "([^"]+)"(?:\\n- optimization: "([^"]+)")?(?:\\n- semantic_link: "([^"]+)")?(?:\\n- auto_document: (true|false))?');
- output_format: array
```

# Function: parse_header
```markdown
- description: "Parses a line starting with # or ### and generates an ID"
- input: line: string, parent_id: string
- output: header: string, id: string
- template: header_parser_template
```

# Template: header_parser_template
```markdown
- input_placeholder: "{{line}}, {{parent_id}}"
- transform: |
    let id = parent_id ? `${parent_id}.` : '';
    if (line.startsWith('# ')) {
        id += line.replace('# ', '').toLowerCase().replace(/\s+/g, '_');
        return { header: line.replace('# ', ''), id: id };
    } else if (line.startsWith('## ')) {
        id += line.replace('## ', '').toLowerCase().replace(/\s+/g, '_');
        return { header: line.replace('## ', ''), id: id };
    } else {
        return null;
    }
- output_format: object
```

# Function: extract_section
```markdown
- description: "Extracts all section content using a given regex pattern"
- input: md: string, pattern: string
- output: sections: array
- template: section_parser_template
```

# Template: section_parser_template
```markdown
- input_placeholder: "{{md}}, {{pattern}}"
- transform: |
    return execute_regex(md, pattern);
- output_format: array
```

# Function: parse_code_block
```markdown
- description: "Parses a code block within a markdown file"
- input: md: string
- output: code_blocks: array
- template: code_block_parser_template
```

# Template: code_block_parser_template
```markdown
- input_placeholder: "{{md}}"
- transform: |
    return execute_regex(md, '```(\\w+)?\\n([\\s\\S]*?)```');
- output_format: array
```

# Function: parse_variable_declaration
```markdown
- description: "Parses variable declarations within a markdown file"
- input: md: string
- output: variables: array
- template: variable_declaration_parser_template
```

# Template: variable_declaration_parser_template
```markdown
- input_placeholder: "{{md}}"
- transform: |
    return execute_regex(md, '# Variable: (\\w+)\\n- type: (\\w+)\\n- default: (.+)');
- output_format: array
```

# Function: parse_function_definition
```markdown
- description: "Parses function definitions within a markdown file"
- input: md: string
- output: functions: array
- template: function_definition_parser_template
```

# Template: function_definition_parser_template
```markdown
- input_placeholder: "{{md}}"
- transform: |
    return execute_regex(md, '# Function: (\\w+)\\n- description: "([^"]+)"\\n- input: (\\w+): (\\w+)\\n- output: (\\w+): (\\w+)\\n- template: (\\w+)');
- output_format: array
```

# Function: parse_template_definition
```markdown
- description: "Parses template definitions within a markdown file"
- input: md: string
- output: templates: array
- template: template_definition_parser_template
```

# Template: template_definition_parser_template
```markdown
- input_placeholder: "{{md}}"
- transform: |
    return execute_regex(md, '# Template: (\\w+)\\n- input_placeholder: "([^"]+)"\\n- transform: "([^"]+)"\\n- output_format: "([^"]+)"');
- output_format: array
```

# Function: parse_conditional_logic
```markdown
- description: "Parses conditional logic within a markdown file"
- input: md: string
- output: conditionals: array
- template: conditional_logic_parser_template
```

# Template: conditional_logic_parser_template
```markdown
- input_placeholder: "{{md}}"
- transform: |
    return execute_regex(md, '# Execute: Condition\\n- if: (.+)\\n  - function: (\\w+)\\n- else:\\n  - function: (\\w+)');
- output_format: array
```

# Function: lazy_parse_section
```markdown
- description: "Parses a specific section only when accessed"
- input: md: string, section_id: string
- output: section_content: string
- template: lazy_parse_section_template
```

# Template: lazy_parse_section_template
```markdown
- input_placeholder: "{{md}}, {{section_id}}"
- transform: |
    const regex = new RegExp(`# ${section_id.replace(/\./g, ' ')}`, 'g');
    const match = regex.exec(md);
    if (match) {
        const start = match.index;
        const end = md.indexOf('# ', start + 1);
        return md.substring(start, end === -1 ? md.length : end);
    }
    return null;
- output_format: string
```

# Function: cache_metadata
```markdown
- description: "Caches metadata (IDs, section types, etc.) for faster warmhole navigation"
- input: md: string
- output: metadata: object
- template: cache_metadata_template
```

# Template: cache_metadata_template
```markdown
- input_placeholder: "{{md}}"
- transform: |
    const cacheMetadata = require('../js/cache_metadata');
    return cacheMetadata(md);
- output_format: object
```
