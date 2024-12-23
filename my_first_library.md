# Library: Basic Text Tools

## Description

This library provides basic tools for text manipulation and analysis.

---

## Custom Function Definitions

### `format_text`

#### Description

Formats text according to specified options.

#### Parameters

- `input`: (string, required) The text to format.
- `style`: (string, optional, default="plain") The desired style (`plain`, `bold`, `italic`, `markdown`).
- `uppercase`: (boolean, optional, default=false) Whether to uppercase the text.

#### Example

```example
# Define:
 - function: format_text
 - input: "my text"
 - style: bold
 - uppercase: true
```

### `summarize_text`

#### Description

Summarizes the given text.

#### Parameters

- `input`: (string, required) The text to summarize.
- `length`: (integer, optional, default=100) The desired length of the summary (in words).

#### Example

```example
# Define:
- function: summarize_text
- input: "A very long text that needs to be summarized"
- length: 50
```

### `extract_keywords`

#### Description

Extracts keywords from the given text.

#### Parameters

- `input`: (string, required) The input text to analyze.
- `max_keywords`: (integer, optional, default=5) The maximum number of keywords to extract.
- `stop_words`: (string, optional) A comma separated list of stop words to ignore.

#### Example

```example
# Define:
- function: extract_keywords
- input: "This is a sample text for keyword extraction."
- max_keywords: 3
- stop_words: "is, a, the, for"
```

---
