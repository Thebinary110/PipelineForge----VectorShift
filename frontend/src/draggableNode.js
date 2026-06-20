/**
 * draggableNode.js
 * Toolbar chip for dragging node types onto the canvas.
 * Derives accent color from nodeConfig to stay in sync with node appearance.
 */

import { NODE_CONFIGS } from './nodes/nodeConfig';

export const DraggableNode = ({ type, label }) => {
  const accentColor = NODE_CONFIGS[type]?.accentColor || '#888888';

  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    event.currentTarget.style.opacity = '1';
  };

  const onDragStartWithOpacity = (event) => {
    event.currentTarget.style.opacity = '0.7';
    onDragStart(event);
  };

  return (
    <div
      draggable
      onDragStart={onDragStartWithOpacity}
      onDragEnd={onDragEnd}
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 11px',
        borderRadius: 6,
        background: 'var(--bg-node)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${accentColor}`,
        userSelect: 'none',
        flexShrink: 0,
        transition: 'border-color 0.15s ease, opacity 0.15s ease',
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
          fontSize: 12,
          color: 'var(--text-primary)',
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
};
