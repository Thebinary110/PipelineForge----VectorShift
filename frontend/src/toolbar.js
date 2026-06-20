/**
 * toolbar.js
 * Pipeline builder toolbar — VectorShift wordmark on the left, all 9 draggable node chips on the right.
 */

import { DraggableNode } from './draggableNode';

const NODE_LIST = [
  { type: 'customInput',    label: 'Input' },
  { type: 'llm',            label: 'LLM' },
  { type: 'customOutput',   label: 'Output' },
  { type: 'text',           label: 'Text' },
  { type: 'filter',         label: 'Filter' },
  { type: 'promptTemplate', label: 'Prompt Template' },
  { type: 'apiCall',        label: 'API Call' },
  { type: 'merge',          label: 'Merge' },
  { type: 'transform',      label: 'Transform' },
];

export const PipelineToolbar = () => (
  <div
    style={{
      height: 64,
      background: 'var(--bg-toolbar)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 20,
      overflow: 'hidden',
    }}
  >
    <span
      style={{
        color: '#ffffff',
        fontWeight: 700,
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        flexShrink: 0,
        letterSpacing: '-0.02em',
      }}
    >
      VectorShift
    </span>

    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        flex: 1,
        paddingBottom: 1,
      }}
    >
      {NODE_LIST.map(({ type, label }) => (
        <DraggableNode key={type} type={type} label={label} />
      ))}
    </div>
  </div>
);
