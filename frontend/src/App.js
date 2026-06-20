/**
 * App.js
 * Root layout: fixed toolbar at top, canvas filling remaining height, submit bar at bottom.
 */

import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg-app)',
        overflow: 'hidden',
      }}
    >
      <PipelineToolbar />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PipelineUI />
      </div>

      <div
        style={{
          height: 56,
          background: 'var(--bg-toolbar)',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;
