# READMEs Documentation Standards

## Quick Links
📘 System Navigation:
- [Documentation Hub](Rdm_documentation.md)
- [Git Standards](Rdm_git.md#best-practices)
- [Testing Standards](Rdm_testing.md#testing-methods)
- [Library Standards](Rdm_external_libraries.md#integration-methods)

## LLM Processing Protocol

### Navigation Rules
```yaml
llm_protocol:
  context_management:
    max_depth: 3
    warmhole_links: true  # Direct knowledge jumps
    state_preservation: enabled
  
  document_processing:
    start_point: quick_links
    parse_order:
      - configuration
      - examples
      - implementation
    
  attention_optimization:
    priority_sections: ["config", "examples", "state"]
    context_switches: minimal
    reference_depth: 2
```

### State Tracking
```markdown
# State Management
- preserve: current_context
- reference: previous_outputs
- warmhole_enabled: true
```

## Document Structure

### Required Components
1. **File Header**
```markdown
// filepath: /path/to/file.md
# Document Title

## Quick Links
📘 Related Docs:
- [Essential cross-references]
```

2. **Section Organization**
```markdown
## Major Section
One-line overview

### Subsection
- Key points
- Examples
- References
```

### Integration Points
- [Git Workflow](Rdm_git.md#workflow-guide)
- [Testing Framework](Rdm_testing.md#automated-testing)
- [Library Management](Rdm_external_libraries.md#library-system)

## Formatting Standards

### Code Blocks
```markdown
# Code Example
- language_tag: required
- filepath: required
- context: conditional
```

### MDScript Syntax
```markdown
# Function: function_name
- description: "Function description"
- input: param_name: type
- output: param_name: type
- template: template_name
```

### Variable Declarations
```markdown
# Variable: variable_name
- type: variable_type
- default: default_value
```

### Template Definitions
```markdown
# Template: template_name
- input_placeholder: "{{placeholder}}"
- transform: "Transformation description"
- output_format: "Output format description"
```

### Conditional Logic
```markdown
# Execute: Condition
- if: {{condition}}
  - function: function_name
- else:
  - function: alternative_function_name
```

### Example: Function Definition
```markdown
# Function: process_text
- description: "Analyzes a text input for word count."
- input: text: string
- output: word_count: integer
- template: analyze_template
```

### Example: Variable Declaration
```markdown
# Variable: current_user
- type: string
- default: "guest"
```

### Example: Template Definition
```markdown
# Template: analyze_template
- input_placeholder: "{{text}}"
- transform: "Split {{text}} into words, then count"
- output_format: "Word count: {{word_count}}"
```

### Example: Conditional Logic
```markdown
# Execute: Condition
- if: {{system_state}} == 'test'
  - function: run_tests
- else:
  - function: build_app
```

### State-Aware Warmholes
```markdown
# Warmhole: warmhole_name
- description: "Warmhole description"
- state_transfer: ["state_variable1", "state_variable2"]
- condition: "{{condition}}"
- next_warmhole: "next_warmhole_name"
```

### Example: State-Aware Warmhole
```markdown
# Warmhole: data_processing
- description: "Processes data and transfers state"
- state_transfer: ["data_path", "dataset_format"]
- condition: "{{system_state}} == 'processing'"
- next_warmhole: "data_analysis"
```

### LLM-Powered Warmhole Management
```markdown
# Warmhole: warmhole_name
- description: "Warmhole description"
- state_transfer: ["state_variable1", "state_variable2"]
- condition: "{{condition}}"
- next_warmhole: "next_warmhole_name"
- optimization: "LLM optimization description"
- semantic_link: "Semantic description of the warmhole link"
- auto_document: true
```

### Example: LLM-Powered Warmhole
```markdown
# Warmhole: data_processing
- description: "Processes data and transfers state"
- state_transfer: ["data_path", "dataset_format"]
- condition: "{{system_state}} == 'processing'"
- next_warmhole: "data_analysis"
- optimization: "Optimize data processing based on current system state"
- semantic_link: "Link to data analysis warmhole"
- auto_document: true
```

### Code Block Enclosure
All function definitions, variable declarations, template definitions, and conditional logic must be enclosed in code blocks.

```markdown
# Function: function_name
- description: "Function description"
- input: param_name: type
- output: param_name: type
- template: template_name
```

```markdown
# Variable: variable_name
- type: variable_type
- default: default_value
```

```markdown
# Template: template_name
- input_placeholder: "{{placeholder}}"
- transform: "Transformation description"
- output_format: "Output format description"
```

```markdown
# Execute: Condition
- if: {{condition}}
  - function: function_name
- else:
  - function: alternative_function_name
```

### Cross-References
```markdown
# Reference Types
- direct: [Section](#section)
- contextual: [Doc](file.md#section)
- state: {{variable}}
```

## LLM Navigation Guide

### 1. Context Assessment
```yaml
context_rules:
  evaluate:
    - current_task
    - available_docs
    - state_requirements
  
  optimize:
    - token_usage
    - attention_flow
    - state_tracking
```

### 2. Document Processing
```markdown
# Processing Steps
1. Check quick links
2. Assess task context
3. Navigate to relevant section
4. Execute specific task
5. Maintain state references
```

### 3. State Preservation
```markdown
# State Guidelines
- track_changes: true
- preserve_context: true
- link_documents: enabled
```

## Best Practices

### Documentation Creation
1. Follow [Git integration](Rdm_git.md#workflow-guide)
2. Apply [testing standards](Rdm_testing.md#best-practices)
3. Use warmhole links for context jumps
4. Maintain clear section hierarchy

### LLM Interaction
1. Start with quick links
2. Use minimal context switches
3. Follow reference chains
4. Preserve state information

### Maintenance
1. Regular validation
2. Context optimization
3. Link verification
4. State synchronization

## Implementation Notes
For technical details:
- [System Architecture](Rdm_documentation.md#system-architecture)
- [Testing Methods](Rdm_testing.md#testing-methods)
- [Git Integration](Rdm_git.md#core-features)

---
📝 This document serves as the standard reference for READMEs system documentation.
