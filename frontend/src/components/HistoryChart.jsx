import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './HistoryChart.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

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
 * Formats an ISO timestamp as a wall-clock label, falling back to the raw value if unparseable.
 *
 * @param {string} timestamp - ISO 8601 timestamp string.
 * @returns {string} Time formatted as HH:MM:SS, or the original string when invalid.
 */
function formatTimestamp(timestamp) {
  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime()) ? timestamp : parsed.toLocaleTimeString();
}

/**
 * Line chart visualizing detected people counts over time.
 *
 * Renders nothing but an empty-state message when no records are supplied, since a chart with
 * no datasets conveys no information.
 *
 * @param {HistoryChartProps} props - `records` are detection records ordered by time.
 * @returns {React.ReactElement} The trend chart, or an empty-state paragraph.
 */
export default function HistoryChart({ records = [] }) {
  if (!records || records.length === 0) {
    return <p className={styles.placeholderText}>No detection events recorded yet</p>;
  }

  const chartData = {
    labels: records.map((record) => formatTimestamp(record.timestamp)),
    datasets: [
      {
        label: 'People Count',
        data: records.map((record) => record.people_count),
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.15)',
        tension: 0.25,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'People' },
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}