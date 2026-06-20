/**
 * submit.js
 * Analyze Pipeline button — POSTs the current pipeline to the backend and
 * renders an analysis modal with node count, edge count, and DAG status.
 */

import { useState } from 'react';
import { useStore } from './store';

const BACKEND_URL = 'http://localhost:8000/pipelines/parse';

/** Full-screen blurred backdrop — click to dismiss. */
const Backdrop = ({ onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
    }}
  />
);

/** Single stat row inside the modal. Accepts an optional value color override. */
const StatRow = ({ label, value, valueColor }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid var(--border-default)',
    }}
  >
    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: valueColor || 'var(--text-primary)',
        letterSpacing: '-0.01em',
      }}
    >
      {value}
    </span>
  </div>
);

/** Dark-themed analysis modal displayed after a successful pipeline parse. */
const AnalysisModal = ({ result, error, onClose }) => (
  <>
    <Backdrop onClose={onClose} />
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'var(--bg-node)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        padding: '24px',
        zIndex: 1001,
        minWidth: 280,
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 16,
          letterSpacing: '-0.02em',
        }}
      >
        Pipeline Analysis
      </p>

      {error ? (
        <p style={{ fontSize: 13, color: 'var(--accent-red)', lineHeight: 1.5 }}>{error}</p>
      ) : (
        <div>
          <StatRow label="Nodes" value={result.num_nodes} />
          <StatRow label="Edges" value={result.num_edges} />
          <StatRow
            label="Valid DAG"
            value={result.is_dag ? 'Yes' : 'No'}
            valueColor={result.is_dag ? '#10B981' : '#EF4444'}
          />
        </div>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: 16,
          width: '100%',
          padding: '8px 0',
          background: 'var(--bg-toolbar)',
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          color: 'var(--text-primary)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.01em',
          transition: 'border-color 0.15s ease, background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-hover)';
          e.currentTarget.style.background = 'var(--bg-node)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.background = 'var(--bg-toolbar)';
        }}
      >
        Dismiss
      </button>
    </div>
  </>
);

export const SubmitButton = () => {
  const nodes   = useStore((state) => state.nodes);
  const edges   = useStore((state) => state.edges);
  const [loading, setLoading]     = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setModalData({ result, error: null });
    } catch (err) {
      setModalData({ result: null, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: '#3B82F6',
          color: '#ffffff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 24px',
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.01em',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          opacity: loading ? 0.6 : 1,
          transition: 'opacity 0.15s ease, transform 0.1s ease',
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.opacity = '0.85';
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.opacity = '1';
        }}
        onMouseDown={(e) => {
          if (!loading) e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Pipeline'}
      </button>

      {modalData && (
        <AnalysisModal
          result={modalData.result}
          error={modalData.error}
          onClose={() => setModalData(null)}
        />
      )}
    </>
  );
};
