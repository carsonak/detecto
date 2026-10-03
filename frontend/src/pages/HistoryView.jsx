import React, { useCallback, useEffect, useState } from 'react';
import HistoryChart from '../components/HistoryChart';
import styles from './HistoryView.module.css';

/**
 * @typedef {import('../components/HistoryChart').DetectionRecord} DetectionRecord
 */

/**
 * HistoryView page component for analytics trends, event logs, date/confidence filtering,
 * and guarded database record purge.
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

  // Filters state
  const [minConfidence, setMinConfidence] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /**
   * Loads detection records from the backend with current active filters.
   *
   * Discloses side-effect: performs a GET request to /api/history and replaces local records state.
   *
   * @param {Object} [filterOverrides]
   * @param {number} [filterOverrides.confidence]
   * @param {string} [filterOverrides.start]
   * @param {string} [filterOverrides.end]
   * @returns {Promise<void>}
   */
  const fetchRecords = useCallback(async (filterOverrides) => {
    try {
      const conf = filterOverrides?.confidence !== undefined ? filterOverrides.confidence : minConfidence;
      const start = filterOverrides?.start !== undefined ? filterOverrides.start : startDate;
      const end = filterOverrides?.end !== undefined ? filterOverrides.end : endDate;

      const params = new URLSearchParams();
      if (conf > 0) {
        params.set('min_confidence', (conf / 100).toFixed(2));
      }
      if (start) {
        params.set('start_date', new Date(start).toISOString());
      }
      if (end) {
        params.set('end_date', new Date(end).toISOString());
      }

      const queryStr = params.toString();
      const url = `/api/history${queryStr ? `?${queryStr}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load history (status ${response.status})`);
      }
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.records || []);
      setRecords(/** @type {DetectionRecord[]} */ (items));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load history.');
    }
  }, [minConfidence, startDate, endDate]);

  useEffect(() => {
    void fetchRecords();
  }, [fetchRecords]);

  /**
   * Applies the current filter selections.
   *
   * @returns {void}
   */
  const handleApplyFilters = () => {
    void fetchRecords();
  };

  /**
   * Resets all filter controls and reloads the unfiltered history.
   *
   * @returns {void}
   */
  const handleClearFilters = () => {
    setMinConfidence(0);
    setStartDate('');
    setEndDate('');
    void fetchRecords({ confidence: 0, start: '', end: '' });
  };

  /**
   * Purges all stored detection records after user confirmation and reloads the empty history.
   *
   * Discloses side-effect: performs an HTTP POST to /api/reset which permanently deletes
   * every history row from the backend database.
   *
   * @returns {Promise<void>}
   */
  const handleConfirmReset = async () => {
    setShowConfirmModal(false);
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
          onClick={() => setShowConfirmModal(true)}
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

      {/* Filter Bar */}
      <section className={styles.filterCard}>
        <div className={styles.filterGroup}>
          <label htmlFor="startDate" className={styles.filterLabel}>Start Date &amp; Time</label>
          <input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="endDate" className={styles.filterLabel}>End Date &amp; Time</label>
          <input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="minConf" className={styles.filterLabel}>Min Confidence: {minConfidence}%</label>
          <div className={styles.sliderContainer}>
            <input
              id="minConf"
              type="range"
              min="0"
              max="100"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
            />
            <span className={styles.sliderValue}>{minConfidence}%</span>
          </div>
        </div>

        <div className={styles.filterActions}>
          <button type="button" className={styles.applyButton} onClick={handleApplyFilters}>
            Apply Filters
          </button>
          <button type="button" className={styles.clearFilterButton} onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <section className={styles.chartSection}>
        <HistoryChart records={records} />
      </section>

      <section className={styles.tableSection}>
        <h3 className={styles.tableTitle}>Past Detection Events ({records.length})</h3>
        {records.length === 0 ? (
          <p className={styles.emptyState}>No detection events match the criteria</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Image Reference</th>
                <th>People</th>
                <th>Confidence</th>
                <th>Inference Latency</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>#{record.id}</td>
                  <td>{formatCellTimestamp(record.timestamp)}</td>
                  <td>{record.image_name || 'Uploaded frame'}</td>
                  <td><strong>{record.people_count}</strong></td>
                  <td>{`${(record.avg_confidence * 100).toFixed(1)}%`}</td>
                  <td>{`${record.inference_time_ms.toFixed(0)} ms`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <h3 id="modalTitle" className={styles.modalTitle}>Clear All Detection History?</h3>
            <p className={styles.modalText}>
              This will permanently delete all recorded detection events and statistics from the database.
              This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmPurgeButton}
                onClick={handleConfirmReset}
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}