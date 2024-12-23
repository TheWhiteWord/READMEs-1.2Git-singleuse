# READMEs Programming System Documentation

!!! Context Notice
Main documentation hub for the READMEs Programming System. This document serves as the central navigation point and system overview.

## Quick Links
📘 Core Navigation:
- [Standards Guide](Rdm_standards.md#llm-processing-protocol)
- [Testing Framework](Rdm_testing.md#core-testing)
- [Implementation Details](Rdm_implementation.md#core-architecture)
- [Git Integration](Rdm_git.md#core-features)
- [External Libraries](Rdm_external_libraries.md#library-system)

## System State
```yaml
doc_state:
  type: hub
  context_depth: 1
  warmhole_enabled: true
  testing_ready: true
```

## Table of Contents
- [System Overview](#system-overview)
- [Core Components](#core-components)
- [Integration](#integration)
- [Usage Guide](#usage-guide)
- [Reference](#reference)

## System Overview

READMEs is a programming system using README.md files as executable documentation with LLM integration.

### Key Features
- README.md as executable code
- LLM-powered processing
- Git-compatible
- Built-in testing framework
- External library support

## Core Components

### Processing Protocol
```yaml
system_core:
  navigation:
    warmhole_links: enabled
    context_depth: 3
    state_tracking: enabled
  
  testing:
    automated: enabled
    coverage_rules: enforced
    state_validation: active
  
  integration:
    git: enabled
    libraries: supported
    ci_cd: configured
```

### Architecture
```markdown
# System Structure
- documentation: [MDScript format]
- execution: [Template-based]
- testing: [Automated validation]
- state: [Git-tracked context]
```

### Implementation
See [Implementation Details](Rdm_implementation.md) for:
- Parser system
- Core functions
- State management

## Integration

### Testing Framework
```markdown
# Test Integration
- automated_testing: enabled
- coverage_tracking: true
- error_handling: standardized
- See [Testing Guide](Rdm_testing.md#core-testing)
```

### State Management
```markdown
# State Tracking
- context: preserved
- history: tracked
- warmhole_links: enabled
```

## Usage Guide

### Quick Start
```markdown
# System Bootstrap
- initialize: system_init
- validate: test_suite
- track: git_state
```

### Basic Operations
```markdown
# Core Usage
- documentation: follow_standards
- testing: run_validation
- state: track_changes
```

## Reference

### System Variables
```yaml
core_vars:
  readme_content: "current document"
  system_state: "execution context"
  test_status: "validation state"
```

### Navigation Guide
1. Start with quick links
2. Use warmhole navigation
3. Follow state tracking
4. Validate with tests

## Function Definitions

### Extract by Regex
```markdown
# Function: extractByRegex
- description: "Extract content using regex pattern with named groups"
- input: content: string, pattern: string
- output: matches: array
- template: regex_executor_template
```

### Parse Function Definition
```markdown
# Function: parseFunctionDef
- description: "Parse function definition from markdown"
- input: content: string
- output: functionDef: object
- template: function_definition_parser_template
```

### Parse Template Definition
```markdown
# Function: parseTemplateDef
- description: "Parse template definition from markdown"
- input: content: string
- output: templateDef: object
- template: template_definition_parser_template
```

### Parse Warmhole Definition
```markdown
# Function: parseWarmholeDef
- description: "Parse warmhole definition from markdown"
- input: content: string
- output: warmholeDef: object
- template: warmhole_parser_template
```

### Cache Metadata
```markdown
# Function: cacheMetadata
- description: "Caches metadata (IDs, section types, etc.) for faster warmhole navigation"
- input: md: string
- output: metadata: object
- template: cache_metadata_template
```

## Example Implementations

### Function: extractByRegex
```markdown
# Function: extractByRegex
- description: "Extract content using regex pattern with named groups"
- input: content: string, pattern: string
- output: matches: array
- template: regex_executor_template
```

### Function: parseFunctionDef
```markdown
# Function: parseFunctionDef
- description: "Parse function definition from markdown"
- input: content: string
- output: functionDef: object
- template: function_definition_parser_template
```

### Function: parseTemplateDef
```markdown
# Function: parseTemplateDef
- description: "Parse template definition from markdown"
- input: content: string
- output: templateDef: object
- template: template_definition_parser_template
```

### Function: parseWarmholeDef
```markdown
# Function: parseWarmholeDef
- description: "Parse warmhole definition from markdown"
- input: content: string
- output: warmholeDef: object
- template: warmhole_parser_template
```

### Function: cacheMetadata
```markdown
# Function: cacheMetadata
- description: "Caches metadata (IDs, section types, etc.) for faster warmhole navigation"
- input: md: string
- output: metadata: object
- template: cache_metadata_template
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
📝 Standards: [Documentation Rules](Rdm_standards.md#document-structure)
🧪 Testing: [Validation Framework](Rdm_testing.md#test-framework)
