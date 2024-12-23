# READMEs Programming System

A self-contained programming system using README.md as executable documentation, optimized for LLM and Git automation.

## Quick Navigation
📘 Documentation:
- [Full Documentation](doc/Rdm_documentation.md#system-overview)
- [Standards Guide](doc/Rdm_standards.md#llm-processing-protocol)
- [Integration Guide](doc/Rdm_git.md#core-features)

## System Configuration
```yaml
version: 1.0
metadata:
  standalone: true
  web_compatible: true
  git_ready: true
  
context:
  enabled: true
  warmhole_links: true
  state_tracking: true
  
variables:
  readme_content: ""
  previous_output: ""
  system_state: ""
  
llm_protocol:
  context_depth: 3
  attention_focus: ["config", "execution", "state"]
  navigation:
    quick_links: enabled
    state_preservation: true
    cross_references: enabled
  
parser:
  heading_section: ^##\s+(.+)$
  heading_function: ^#\s+(.+)$
  list_item: ^(\s+)-\s+(.+)$
  key_value: ^(\s+)-\s+(\w+):\s*(.+)$
```

### Parser Implementation

```javascript
// This is an example of basic implementation to bootstrap the process
const parseMDScript = (md) => {
   //Basic logic to execute MDScript
   const functions = parser.getFunctions(md); // the JavaScript function
   const templates = parser.getTemplates(md);
   functions.forEach(fn => { /* ... do something ... */});
   templates.forEach(template => { /* ... do something ... */});
};
```

## Core Functions

### System Bootstrap
```markdown
# Execute
- function: system_init
- input: "{{readme_content}}"
- context:
  - git_aware: true
  - llm_ready: true
```

### Program Execution
```markdown
# Execute
- function: system_execute
- template: "{{selected_template}}"
- input: "{{user_input}}"
- state: "{{system_state}}"
```
```markdown
//your executions here
```
### State Management
```markdown
# State Tracking
- preserve: current_context
- store: git_enabled
- track: ["output", "context", "state"]
```

## Quick Start

### 1. Initialize System
```sh
git clone https://github.com/yourusername/readmes
cd readmes
# System auto-initializes on first LLM interaction
```

### 2. Execute Program
```markdown
# Run Program
- template: quick_start
- input: "Hello READMEs!"
- track_state: true
```

## Integration Points

### LLM Processing
- See [LLM Protocol](doc/Rdm_standards.md#llm-processing-protocol)
- Context preservation enabled
- Warmhole navigation supported

### Git Automation
- See [Git Integration](doc/Rdm_git.md#workflow-guide)
- State tracking
- Branch awareness

### Documentation Standards
- See [Standards Guide](doc/Rdm_standards.md#document-structure)
- Cross-referencing
- State management

## Reference Links
- [Implementation Details](doc/Rdm_documentation.md#core-components)
- [Testing Guide](doc/Rdm_testing.md#testing-methods)
- [Library Integration](doc/Rdm_external_libraries.md#library-system)

---
📝 This README serves as both documentation and executable program
🔄 State changes are tracked via Git
🤖 Optimized for LLM processing
