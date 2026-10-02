import React from 'react';

/**
 * Placeholder component for HistoryChart (Developer 2).
 * Will render the time-series line/bar chart of detection records over time.
 */
export default function HistoryChart({ records }) {
  return (
    <div style={{ border: '2px dashed #cbd5e0', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
      <p style={{ color: '#718096', margin: 0 }}>
        [History Trend Chart Placeholder - Developer 2]
      </p>
      <p style={{ fontSize: '12px', color: '#a0aec0', margin: '4px 0 0' }}>
        Records available: {records ? records.length : 0}
      </p>
    </div>
  );
}
