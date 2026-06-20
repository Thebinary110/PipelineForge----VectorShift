/**
 * draggableNode.js
 * Toolbar chip for dragging node types onto the canvas.
 * Derives accent color from nodeConfig. Hover state managed via local state
 * because inline styles cannot target CSS pseudo-classes.
 */

import { useState } from 'react';
import { NODE_CONFIGS } from './nodes/nodeConfig';

export const DraggableNode = ({ type, label }) => {
  const accentColor = NODE_CONFIGS[type]?.accentColor || '#888888';
  const [hovered, setHovered] = useState(false);

  const onDragStart = (event) => {
    event.currentTarget.style.opacity = '0.6';
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    event.currentTarget.style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 28,
        padding: '0 10px',
        borderRadius: 6,
        background: hovered ? 'var(--bg-node)' : 'transparent',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border-default)'}`,
        userSelect: 'none',
        flexShrink: 0,
        transition: 'background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: accentColor,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          color: 'var(--text-primary)',
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </div>
  );
};
