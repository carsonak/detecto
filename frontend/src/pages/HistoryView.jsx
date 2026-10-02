import React, { useState } from 'react';
import HistoryChart from '../components/HistoryChart';

/**
 * Placeholder page for HistoryView (Developer 2).
 */
export default function HistoryView() {
  const [records] = useState([]);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Detection History & Analytics</h2>
          <p style={{ margin: '4px 0 0', color: '#4a5568' }}>
            Review detection trends, crowd presence over time, and past event logs.
          </p>
        </div>
        <button
          style={{
            padding: '8px 14px',
            backgroundColor: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
          }}
          onClick={() => alert('Reset endpoint assigned to Developer 2.')}
        >
          Reset History
        </button>
      </header>

      <section style={{ marginBottom: '24px' }}>
        <HistoryChart records={records} />
      </section>

      <section style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Past Detection Events</h3>
        <p style={{ color: '#718096', fontSize: '14px', margin: 0, textAlign: 'center', padding: '20px' }}>
          No detection events recorded yet. Run a detection from the Detection View tab to begin logging.
        </p>
      </section>
    </div>
  );
}
