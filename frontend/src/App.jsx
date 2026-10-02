import React, { useState } from 'react';
import DetectionView from './pages/DetectionView';
import HistoryView from './pages/HistoryView';
import styles from './App.module.css';

/**
 * Root Application component providing top-level navigation and view switching.
 *
 * @returns {React.ReactElement} The rendered application shell.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState(
    /** @type {'detection' | 'history'} */ ('detection')
  );

  return (
    <div className={styles.appContainer}>
      {/* Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.brandGroup}>
          <span className={styles.brandLogo}>Detecto</span>
          <span className={styles.brandSubtitle}>
            Person Detection &amp; Analytics
          </span>
        </div>

        <div className={styles.navLinks}>
          <button
            type="button"
            onClick={() => setActiveTab('detection')}
            className={activeTab === 'detection' ? styles.navButtonActive : styles.navButton}
          >
            Detection View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? styles.navButtonActive : styles.navButton}
          >
            History &amp; Analytics
          </button>
        </div>
      </nav>

      {/* Main Page Content */}
      <main className={styles.mainContent}>
        {activeTab === 'detection' ? <DetectionView /> : <HistoryView />}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        Detecto &copy; {new Date().getFullYear()} &mdash; Automation &amp; Safety Monitoring System
      </footer>
    </div>
  );
}
