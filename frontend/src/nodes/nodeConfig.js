/**
 * nodeConfig.js
 * Pure data module — all node type definitions for the VectorShift pipeline builder.
 * No React, no JSX, no logic. To add a new node type, add one entry here.
 */

export const NODE_CONFIGS = {
  customInput: {
    title: 'Input',
    accentColor: '#3B82F6',
    inputs: [],
    outputs: [{ id: 'value', label: 'Value' }],
    fields: [
      { name: 'inputName', label: 'Name', type: 'text', placeholder: 'input_name' },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], defaultValue: 'Text' },
    ],
  },

  customOutput: {
    title: 'Output',
    accentColor: '#10B981',
    inputs: [{ id: 'value', label: 'Value' }],
    outputs: [],
    fields: [
      { name: 'outputName', label: 'Name', type: 'text', placeholder: 'output_name' },
      { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'], defaultValue: 'Text' },
    ],
  },

  llm: {
    title: 'LLM',
    accentColor: '#8B5CF6',
    inputs: [
      { id: 'system', label: 'System', position: '33%' },
      { id: 'prompt', label: 'Prompt', position: '66%' },
    ],
    outputs: [{ id: 'response', label: 'Response' }],
    fields: [
      {
        name: 'model',
        label: 'Model',
        type: 'select',
        options: ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo', 'claude-3-5-sonnet'],
        defaultValue: 'gpt-4o',
      },
    ],
  },

  text: {
    title: 'Text',
    accentColor: '#F59E0B',
    inputs: [],
    outputs: [{ id: 'output', label: 'Output' }],
    fields: [
      { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter text with {{variables}}', defaultValue: '' },
    ],
  },

  filter: {
    title: 'Filter',
    accentColor: '#EF4444',
    inputs: [{ id: 'data', label: 'Data' }],
    outputs: [
      { id: 'passed', label: 'Passed' },
      { id: 'failed', label: 'Failed' },
    ],
    fields: [
      { name: 'condition', label: 'Condition', type: 'text', placeholder: 'e.g. length > 100' },
    ],
  },

  promptTemplate: {
    title: 'Prompt Template',
    accentColor: '#EC4899',
    inputs: [{ id: 'variable', label: 'Variable' }],
    outputs: [{ id: 'prompt', label: 'Prompt' }],
    fields: [
      { name: 'template', label: 'Template', type: 'textarea', placeholder: 'Hello {{name}}' },
    ],
  },

  apiCall: {
    title: 'API Call',
    accentColor: '#06B6D4',
    inputs: [
      { id: 'url', label: 'URL' },
      { id: 'body', label: 'Body' },
    ],
    outputs: [
      { id: 'response', label: 'Response' },
      { id: 'error', label: 'Error' },
    ],
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        defaultValue: 'GET',
      },
      { name: 'headers', label: 'Headers', type: 'textarea', placeholder: '{"Content-Type": "application/json"}' },
    ],
  },

  merge: {
    title: 'Merge',
    accentColor: '#14B8A6',
    inputs: [
      { id: 'input1', label: 'Input 1' },
      { id: 'input2', label: 'Input 2' },
    ],
    outputs: [{ id: 'merged', label: 'Merged' }],
    fields: [
      {
        name: 'strategy',
        label: 'Strategy',
        type: 'select',
        options: ['Concatenate', 'JSON Merge', 'Array Push'],
        defaultValue: 'Concatenate',
      },
    ],
  },

  transform: {
    title: 'Transform',
    accentColor: '#F97316',
    inputs: [{ id: 'data', label: 'Data' }],
    outputs: [{ id: 'result', label: 'Result' }],
    fields: [
      { name: 'expression', label: 'Expression', type: 'textarea', placeholder: 'data.map(x => x.value)' },
    ],
  },
};
