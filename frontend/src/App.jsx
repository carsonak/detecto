import React, { useState } from 'react';
import DetectionView from './pages/DetectionView';
import HistoryView from './pages/HistoryView';

export default function App() {
  const [activeTab, setActiveTab] = useState('detection');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <nav
        style={{
          backgroundColor: '#1a202c',
          color: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#63b3ed' }}>Detecto</span>
          <span style={{ fontSize: '12px', color: '#a0aec0', paddingLeft: '8px', borderLeft: '1px solid #4a5568' }}>
            Person Detection & Analytics
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('detection')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'detection' ? '#2b6cb0' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: activeTab === 'detection' ? 600 : 400,
            }}
          >
            Detection View
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'history' ? '#2b6cb0' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: activeTab === 'history' ? 600 : 400,
            }}
          >
            History & Analytics
          </button>
        </div>
      </nav>

      {/* Main Page Content */}
      <main style={{ flex: 1, backgroundColor: '#f7fafc' }}>
        {activeTab === 'detection' ? <DetectionView /> : <HistoryView />}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '12px 24px',
          fontSize: '12px',
          color: '#718096',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#fff',
        }}
      >
        Detecto &copy; {new Date().getFullYear()} &mdash; Automation &amp; Safety Monitoring System
      </footer>
    </div>
  );
}
