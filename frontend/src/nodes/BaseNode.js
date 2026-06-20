/**
 * BaseNode.js
 * Core rendering abstraction for all pipeline node types.
 * Accepts a configuration object and renders the node card, handles, and fields.
 * All logic for dynamic variable handles (Text node) and textarea auto-resize lives here.
 */

import { useState, useRef, useCallback, Fragment } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

/** Matches {{variableName}} patterns for the Text node dynamic handle feature. */
const VARIABLE_REGEX = /\{\{(\w+)\}\}/g;

/** Distributes handle positions evenly along the node height. */
const computeHandleTop = (index, total) =>
  `${((index + 1) / (total + 1)) * 100}%`;

const handleDotStyle = (accentColor) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: accentColor,
  border: '2px solid var(--bg-node)',
});

const INPUT_BASE = {
  background: 'var(--bg-canvas)',
  border: '1px solid var(--border-default)',
  borderRadius: 4,
  color: 'var(--text-primary)',
  fontSize: 12,
  padding: '4px 8px',
  width: '100%',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  colorScheme: 'dark',
};

const LABEL_STYLE = {
  fontSize: 11,
  color: 'var(--text-secondary)',
  letterSpacing: '0.02em',
  display: 'block',
  marginBottom: 3,
};

const FIELD_WRAPPER = {
  marginTop: 8,
};

const ERROR_CARD_STYLE = {
  background: 'var(--bg-node)',
  border: '1px solid var(--accent-red)',
  borderRadius: 8,
  padding: 12,
  minWidth: 220,
  color: 'var(--accent-red)',
  fontSize: 11,
  fontFamily: 'Inter, sans-serif',
};

/**
 * Renders a single configurable form field.
 * Handles text inputs, selects, and textareas with focus-based border coloring.
 */
const NodeField = ({ field, value, accentColor, onChange, textareaRef, extraTopMargin }) => {
  const [focused, setFocused] = useState(false);

  const dynamicBorder = `1px solid ${focused ? accentColor : 'var(--border-default)'}`;
  const inputStyle = { ...INPUT_BASE, border: dynamicBorder };
  const wrapStyle = extraTopMargin ? { ...FIELD_WRAPPER, marginTop: extraTopMargin } : FIELD_WRAPPER;

  if (field.type === 'select') {
    return (
      <div style={wrapStyle}>
        <label style={LABEL_STYLE}>{field.label}</label>
        <select
          value={value === undefined || value === null ? (field.defaultValue ?? '') : value}
          onChange={(e) => onChange(field.name, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div style={wrapStyle}>
        <label style={LABEL_STYLE}>{field.label}</label>
        <textarea
          ref={textareaRef}
          value={value ?? field.defaultValue ?? ''}
          placeholder={field.placeholder || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.5, overflowY: 'hidden' }}
        />
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <label style={LABEL_STYLE}>{field.label}</label>
      <input
        type="text"
        value={value ?? field.defaultValue ?? ''}
        placeholder={field.placeholder || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      />
    </div>
  );
};

/**
 * Extracts unique {{variable}} names from a string using the VARIABLE_REGEX pattern.
 * Returns a deduplicated array of variable name strings.
 */
function extractVariables(text) {
  const seen = new Set();
  const regex = new RegExp(VARIABLE_REGEX.source, 'g');
  let match;
  while ((match = regex.exec(text)) !== null) {
    seen.add(match[1]);
  }
  return Array.from(seen);
}

/**
 * Core node rendering component. All node types delegate to this component.
 *
 * @param {string}   id            - ReactFlow node id
 * @param {object}   data          - ReactFlow node data from store
 * @param {string}   title         - Node type label displayed in header
 * @param {string}   accentColor   - Hex color for border, handles, and title
 * @param {Array}    inputs        - Static left-side input handle configs
 * @param {Array}    outputs       - Static right-side output handle configs
 * @param {Array}    fields        - Form field configurations (FieldConfig shape)
 * @param {Array}    [dynamicInputs] - If provided, enables dynamic {{var}} handle detection
 * @param {ReactNode} [children]   - Optional custom body section
 */
export const BaseNode = ({
  id,
  data,
  title,
  accentColor,
  inputs = [],
  outputs = [],
  fields = [],
  dynamicInputs,
  children,
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [isHovered, setIsHovered] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(220);
  const textareaRef = useRef(null);

  const isDynamicMode = dynamicInputs !== undefined;

  const [detectedVars, setDetectedVars] = useState(() =>
    isDynamicMode ? extractVariables(data?.text || '') : []
  );

// Remove the useEffect block completely.
// Replace textareaRef with a callback ref that sets initial height once:

const textareaCallbackRef = useCallback((el) => {
  if (!el) return;
  textareaRef.current = el;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}, []); // empty deps = runs once on mount only

  const handleFieldChange = useCallback(
    (fieldName, value) => {
     // console.log('fieldChange', fieldName, value, isDynamicMode);
      updateNodeField(id, fieldName, value);

      if (isDynamicMode && fieldName === 'text') {
        setDetectedVars(extractVariables(value));

        // Auto-resize textarea height with scrollHeight
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }

        // Expand node width proportionally to longest line, clamped [220, 480]
        const lines = value.split('\n');
        const longestLine = Math.max(...lines.map((l) => l.length), 0);
        setNodeWidth(Math.min(480, Math.max(220, longestLine * 7)));
      }
    },
    [id, updateNodeField, isDynamicMode]
  );

  if (!title || !accentColor) {
    return (
      <div style={ERROR_CARD_STYLE}>
        <strong>Node Error</strong>
        <p style={{ marginTop: 4, fontSize: 10 }}>Malformed node configuration: missing title or accentColor.</p>
      </div>
    );
  }

  const staticInputCount = inputs.length;
  const dynamicVarList = isDynamicMode ? detectedVars : [];
  const totalInputCount = staticInputCount + dynamicVarList.length;
  const outputCount = outputs.length;

  // console.log('detectedVars', detectedVars, isDynamicMode);

  try {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: 'var(--bg-node)',
          border: `1px solid ${isHovered ? 'var(--border-hover)' : 'var(--border-default)'}`,
          borderLeft: `3px solid ${accentColor}`,
          borderRadius: 8,
          minWidth: 220,
          width: isDynamicMode ? nodeWidth : undefined,
          padding: 12,
          boxShadow: isHovered
            ? `0 0 0 1px ${accentColor}26, var(--shadow-node)`
            : 'var(--shadow-node)',
          position: 'relative',
          overflow: 'visible',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease, width 0.1s ease',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* ── Static input handles (left) ── */}
        {inputs.map((handle, i) => (
          <Handle
            key={handle.id}
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            title={handle.label}
            style={{
              ...handleDotStyle(accentColor),
              top: handle.position || computeHandleTop(i, staticInputCount),
            }}
          />
        ))}

        {/* ── Dynamic {{variable}} handles (left, below static inputs) ── */}
        {dynamicVarList.map((varName, i) => {
          const top = computeHandleTop(totalInputCount > 0 ? staticInputCount + i : i, totalInputCount || 1);
          return (
            <Fragment key={varName}>
              <Handle
                type="target"
                position={Position.Left}
                id={`${id}-${varName}`}
                style={{ ...handleDotStyle(accentColor), top }}
              />
              <span
                style={{
                  position: 'absolute',
                  top,
                  left: -58,
                  transform: 'translateY(-50%)',
                  fontSize: 9,
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                {varName}
              </span>
            </Fragment>
          );
        })}

        {/* ── Output handles (right) ── */}
        {outputs.map((handle, i) => (
          <Handle
            key={handle.id}
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            title={handle.label}
            style={{
              ...handleDotStyle(accentColor),
              top: handle.position || computeHandleTop(i, outputCount),
            }}
          />
        ))}

        {/* ── Node header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: accentColor,
            }}
          >
            {title}
          </span>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: accentColor,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
        </div>

        {/* ── Form fields ── */}
        {fields.map((field, index) => (
          <NodeField
            key={field.name}
            field={field}
            value={data?.[field.name]}
            accentColor={accentColor}
            onChange={handleFieldChange}
            textareaRef={
              field.type === 'textarea' && isDynamicMode ? textareaCallbackRef : undefined
            }
            extraTopMargin={
              index === 0 && isDynamicMode && dynamicVarList.length > 0 ? 16 : undefined
            }
          />
        ))}

        {/* ── Optional custom body ── */}
        {children}
      </div>
    );
  } catch (renderError) {
    return (
      <div style={ERROR_CARD_STYLE}>
        <strong>Render Error</strong>
        <p style={{ marginTop: 4, fontSize: 10 }}>
          {renderError?.message || 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }
};
