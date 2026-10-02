import React from 'react';
import styles from './HistoryChart.module.css';

/**
 * @typedef {Object} DetectionRecord
 * @property {number} id - Unique identifier from database.
 * @property {string} timestamp - ISO 8601 formatted timestamp string.
 * @property {number} people_count - Number of people detected in frame.
 * @property {number} avg_confidence - Average confidence score.
 * @property {number} inference_time_ms - Latency in milliseconds.
 * @property {string} [image_name] - Optional reference name of the processed frame.
 */

/**
 * @typedef {Object} HistoryChartProps
 * @property {DetectionRecord[]} [records] - Array of detection records for time-series graphing.
 */

/**
 * Chart component for visualizing detection trends over time.
 *
 * @param {HistoryChartProps} props
 * @returns {React.ReactElement}
 */
export default function HistoryChart({ records = [] }) {
  return (
    <div className={styles.chartContainer}>
      <p className={styles.placeholderText}>
        [History Trend Chart Placeholder &mdash; Developer 2]
      </p>
      <p className={styles.recordCount}>
        Records available: {records ? records.length : 0}
      </p>
    </div>
  );
}
