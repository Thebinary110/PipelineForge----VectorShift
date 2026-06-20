/**
 * submit.js
 * Submit button that POSTs the current pipeline to the backend and renders
 * an analysis modal showing node count, edge count, and DAG validity.
 */

import { useState } from 'react';
import { useStore } from './store';

const BACKEND_URL = 'http://localhost:8000/pipelines/parse';

/** Full-screen blurred backdrop that dismisses the modal on click. */
const Backdrop = ({ onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
    }}
  />
);

/** Single key-value row inside the result modal. */
const ResultRow = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid var(--border-default)',
    }}
  >
    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
  </div>
);

/** Dark card modal displaying pipeline analysis results or an error message. */
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
        padding: '24px 28px',
        zIndex: 1001,
        minWidth: 280,
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 16,
          letterSpacing: '-0.01em',
        }}
      >
        Pipeline Analysis
      </p>

      {error ? (
        <p style={{ fontSize: 12, color: 'var(--accent-red)', lineHeight: 1.5 }}>{error}</p>
      ) : (
        <div>
          <ResultRow label="Nodes" value={result.num_nodes} />
          <ResultRow label="Edges" value={result.num_edges} />
          <ResultRow label="Valid DAG" value={result.is_dag ? '✅ Yes' : '❌ No'} />
        </div>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: 18,
          width: '100%',
          padding: '8px 0',
          background: 'transparent',
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          color: 'var(--text-secondary)',
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'border-color 0.15s ease, color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-hover)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        Dismiss
      </button>
    </div>
  </>
);

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [loading, setLoading]   = useState(false);
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
          background: loading ? '#1e3a6e' : 'var(--accent-blue)',
          color: '#ffffff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 32px',
          fontSize: 14,
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'filter 0.15s ease, transform 0.1s ease, background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.filter = 'brightness(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'brightness(1)';
        }}
        onMouseDown={(e) => {
          if (!loading) e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {loading ? 'Analyzing…' : 'Submit Pipeline'}
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
