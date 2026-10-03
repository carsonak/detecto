import React, { useCallback, useEffect, useState } from 'react';
import HistoryChart from '../components/HistoryChart';
import styles from './HistoryView.module.css';

/**
 * @typedef {import('../components/HistoryChart').DetectionRecord} DetectionRecord
 */

/**
 * HistoryView page component for analytics trends, event logs, and record purge.
 *
 * @returns {React.ReactElement}
 */
export default function HistoryView() {
  /** @type {[DetectionRecord[], React.Dispatch<React.SetStateAction<DetectionRecord[]>>]} */
  const [records, setRecords] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(false);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [error, setError] = useState(null);

  /**
   * Loads detection records from the backend.
   *
   * Discloses side-effect: performs a GET request to /api/history and replaces local state.
   *
   * @returns {Promise<void>}
   */
  const fetchRecords = useCallback(async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error(`Failed to load history (status ${response.status})`);
      }
      const data = await response.json();
      setRecords(/** @type {DetectionRecord[]} */ (data.records || []));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load history.');
    }
  }, []);

  useEffect(() => {
    void fetchRecords();
  }, [fetchRecords]);

  /**
   * Purges all stored detection records and reloads the empty history.
   *
   * Discloses side-effect: performs an HTTP POST to /api/reset which permanently deletes
   * every history row from the backend database.
   *
   * @returns {Promise<void>}
   */
  const handleResetHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reset', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Reset failed with status ${response.status}`);
      }
      await fetchRecords();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats a stored timestamp for table display, falling back to the raw value if unparseable.
   *
   * @param {string} timestamp - ISO 8601 timestamp string.
   * @returns {string} Locale-formatted date and time.
   */
  const formatCellTimestamp = (timestamp) => {
    const parsed = new Date(timestamp);
    return Number.isNaN(parsed.getTime()) ? timestamp : parsed.toLocaleString();
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
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset History'}
        </button>
      </header>

      {error && (
        <p className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}

      <section className={styles.chartSection}>
        <HistoryChart records={records} />
      </section>

      <section className={styles.tableSection}>
        <h3 className={styles.tableTitle}>Past Detection Events</h3>
        {records.length === 0 ? (
          <p className={styles.emptyState}>No detection events recorded yet</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>People</th>
                <th>Confidence</th>
                <th>Inference (ms)</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatCellTimestamp(record.timestamp)}</td>
                  <td>{record.people_count}</td>
                  <td>{record.avg_confidence.toFixed(2)}</td>
                  <td>{record.inference_time_ms.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}