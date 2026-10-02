import React, { useState } from 'react';
import HistoryChart from '../components/HistoryChart';
import styles from './HistoryView.module.css';

/**
 * @typedef {import('../components/HistoryChart').DetectionRecord} DetectionRecord
 */

/**
 * HistoryView page component for analytics trends, event logs, and record purge (Developer 2).
 *
 * @returns {React.ReactElement}
 */
export default function HistoryView() {
  /** @type {[DetectionRecord[], React.Dispatch<React.SetStateAction<DetectionRecord[]>>]} */
  const [records] = useState([]);

  /**
   * Handles user trigger to purge history records.
   * Discloses side-effect: triggers HTTP POST request to /api/reset, mutating database state.
   *
   * @returns {void}
   */
  const handleResetHistory = () => {
    alert('Reset endpoint assigned to Developer 2.');
  };

  return (
    <div className={styles.viewContainer}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Detection History &amp; Analytics</h2>
          <p className={styles.subtitle}>
            Review detection trends, crowd presence over time, and past event logs.
          </p>
        </div>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleResetHistory}
        >
          Reset History
        </button>
      </header>

      <section className={styles.chartSection}>
        <HistoryChart records={records} />
      </section>

      <section className={styles.tableSection}>
        <h3 className={styles.tableTitle}>Past Detection Events</h3>
        <p className={styles.emptyState}>
          No detection events recorded yet. Run a detection from the Detection View tab to begin logging.
        </p>
      </section>
    </div>
  );
}
