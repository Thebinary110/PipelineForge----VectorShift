/**
 * toolbar.js
 * Pipeline builder toolbar — PipelineForge wordmark, node type palette, and theme toggle.
 */

import { DraggableNode } from './draggableNode';
import { useTheme } from './ThemeContext';

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

export const PipelineToolbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      style={{
        height: 52,
        background: 'var(--bg-toolbar)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        flexShrink: 0,
      }}
    >
      {/* Wordmark */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.02em',
          flexShrink: 0,
          marginRight: 16,
        }}
      >
        PipelineForge
      </span>

      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          height: 20,
          background: 'var(--border-default)',
          flexShrink: 0,
          marginRight: 16,
        }}
      />

      {/* Scrollable node chip row */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          flex: 1,
          alignItems: 'center',
          paddingBottom: 1,
        }}
      >
        {NODE_LIST.map(({ type, label }) => (
          <DraggableNode key={type} type={type} label={label} />
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          marginLeft: 'auto',
          flexShrink: 0,
          background: 'transparent',
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          color: 'var(--text-primary)',
          padding: '4px 12px',
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'border-color 0.15s ease, background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-node)';
          e.currentTarget.style.borderColor = 'var(--border-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'var(--border-default)';
        }}
      >
        {theme === 'dark' ? '☀ Light' : '☾ Dark'}
      </button>
    </div>
  );
};
