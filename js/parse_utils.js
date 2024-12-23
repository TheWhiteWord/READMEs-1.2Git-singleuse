/**
 * Extract content using regex pattern with named groups
 */
function extractByRegex(content, pattern) {
    const matches = [];
    const regex = new RegExp(pattern, 'g');
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push({
            ...match.groups,
            raw: match[0],
            index: match.index
        });
    }
    return matches;
}

/**
 * Parse function definition from markdown
 */
function parseFunctionDef(content) {
    const regex = /^# Function:\s*(?<name>\w+)\s*\n-\s*description:\s*"(?<description>[^"]+)"\s*\n-\s*input:\s*(?<inputName>\w+):\s*(?<inputType>\w+)\s*\n-\s*output:\s*(?<outputName>\w+):\s*(?<outputType>\w+)\s*\n-\s*template:\s*(?<template>\w+)/;
    const match = content.match(regex);
    if (!match?.groups) return null;
    
    return {
        name: match.groups.name,
        description: match.groups.description,
        input: {
            name: match.groups.inputName,
            type: match.groups.inputType
        },
        output: {
            name: match.groups.outputName,
            type: match.groups.outputType
        },
        template: match.groups.template
    };
}

/**
 * Parse template definition from markdown
 */
function parseTemplateDef(content) {
    const regex = /^# Template:\s*(?<name>\w+)\s*\n-\s*input_placeholder:\s*"(?<placeholder>[^"]+)"\s*\n-\s*transform:\s*\|(?<transform>[\s\S]*?)(?=\n-|$)\n-\s*output_format:\s*(?<format>\w+)/;
    const match = content.match(regex);
    if (!match?.groups) return null;
    
    return {
        name: match.groups.name,
        placeholder: match.groups.placeholder,
        transform: match.groups.transform.trim(),
        outputFormat: match.groups.format
    };
}

/**
 * Parse warmhole definition from markdown
 */
function parseWarmholeDef(content) {
    const regex = /^# Warmhole:\s+(?<name>\w+)\s*\n-\s*description:\s*"(?<description>[^"]+)"\s*\n-\s*state_transfer:\s*\[(?<transfer>[^\]]+)\]\s*\n-\s*condition:\s*"(?<condition>[^"]+)"\s*\n-\s*next_warmhole:\s*"(?<next>[^"]+)"/;
    const match = content.match(regex);
    if (!match?.groups) return null;
    
    return {
        name: match.groups.name,
        description: match.groups.description,
        state_transfer: match.groups.transfer.split(',').map(s => s.trim()),
        condition: match.groups.condition,
        next_warmhole: match.groups.next
    };
}

module.exports = {
    extractByRegex,
    parseFunctionDef,
    parseTemplateDef,
    parseWarmholeDef
};
