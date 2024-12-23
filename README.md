# READMEs Programming System

A self-contained programming system using README.md as executable documentation, powered by LLM-driven navigation and execution.

## System Configuration
```yaml
version: 1.2
metadata:
  standalone: true
  web_compatible: true
  llm_driven: true
  
context:
  enabled: true
  warmhole_links: true
  state_tracking: true
  llm_control: true
  
variables:
  readme_content: ""
  previous_output: ""
  system_state: ""
  llm_context: {}
  warmhole_history: []
```

## LLM Optimization Features

### Context Management
The LLM maintains and updates system context including:
- Current warmhole state
- Execution history
- System goals and constraints
- Previous outputs and results

### Smart Navigation
The LLM automatically:
- Decides which warmholes to navigate
- Determines optimal execution paths
- Creates or modifies warmholes as needed
- Manages state transfers between warmholes

### Autonomous Execution
The LLM:
- Interprets user intent
- Selects appropriate functions to execute
- Provides input parameters
- Validates outputs and handles errors
- Documents changes and decisions

## Function Examples

### Natural Language Processing
```markdown
# Function: process_intent
- description: "Process user intent and determine execution path"
- input: message: string
- output: plan: object
- template: llm_processor
- llm_context: true
```

### LLM Processor Template
```markdown
# Template: llm_processor
- input_placeholder: "{{message}}"
- transform: |
    return llm.processUserIntent(context.message);
- output_format: object
- requires_llm: true
```

### Smart Navigation Example
```markdown
# Warmhole: intent_processor
- description: "Entry point for processing user requests"
- state_transfer: ["user_intent", "system_context"]
- condition: "llm.shouldActivate(context)"
- llm_context: {
    purpose: "Process and understand user intent",
    capabilities: ["intent analysis", "path planning", "context management"]
  }
```

## Comprehensive Example

### User Intent Processing
```markdown
# Function: analyze_data
- description: "Analyze the provided dataset and generate a report"
- input: dataset: string
- output: report: object
- template: data_analyzer
- llm_context: true
```

### Data Analyzer Template
```markdown
# Template: data_analyzer
- input_placeholder: "{{dataset}}"
- transform: |
    const analysis = analyzeDataset(context.dataset);
    return generateReport(analysis);
- output_format: object
- requires_llm: true
```

### Warmhole Definitions
```markdown
# Warmhole: data_processing
- description: "Process the dataset and prepare for analysis"
- state_transfer: ["dataset", "analysis_ready"]
- condition: "llm.shouldProcessData(context)"
- llm_context: {
    purpose: "Prepare dataset for analysis",
    capabilities: ["data cleaning", "data transformation"]
  }

# Warmhole: report_generation
- description: "Generate a report from the analyzed data"
- state_transfer: ["analysis_report", "final_report"]
- condition: "llm.shouldGenerateReport(context)"
- llm_context: {
    purpose: "Generate comprehensive report",
    capabilities: ["report generation", "data visualization"]
  }
```

## Quick Start

1. Send a request to the system:
```javascript
const result = await system.process("Analyze this dataset and generate a report");
```

The LLM will:
1. Analyze your intent
2. Plan the execution path
3. Navigate through appropriate warmholes
4. Execute required functions
5. Return results and documentation

## Example Usage

### Step-by-Step Execution
1. **Initialize the System**:
   ```javascript
   const readmeContent = loadReadmeContent();
   const initResult = system_init(readmeContent);
   console.log('System initialization result:', initResult);
   ```

2. **Process User Intent**:
   ```javascript
   const userIntent = "Analyze this dataset and generate a report";
   const executionPlan = await processUserIntent(userIntent, systemState);
   console.log('Execution Plan:', executionPlan);
   ```

3. **Execute the Plan**:
   ```javascript
   const executionResult = await execute(executionPlan);
   console.log('Execution Result:', executionResult);
   ```

## Conclusion

The READMEs Programming System leverages LLM-driven navigation and execution to transform README.md files into executable documentation. By following the comprehensive example provided, users can harness the full capabilities of the system to automate complex workflows and achieve seamless integration between documentation and execution.

For more details, refer to the [Documentation Standards](doc/Rdm_standards.md) and [Parser Rules](doc/Rmd_parser_rules.md).

---
📝 LLM-Driven README Programming System
🤖 Autonomous Navigation & Execution