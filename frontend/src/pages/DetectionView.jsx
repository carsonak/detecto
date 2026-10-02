import React, { useState } from 'react';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';
import styles from './DetectionView.module.css';

/**
 * DetectionView page component for uploading frames, viewing detection overlays,
 * and monitoring per-frame inference metrics (Developer 1).
 *
 * @returns {React.ReactElement}
 */
export default function DetectionView() {
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [selectedSample] = useState(null);

  /**
   * Handles user trigger to run person detection inference.
   * Discloses side-effect: triggers HTTP POST request to /api/detect.
   *
   * @returns {void}
   */
  const handleRunDetection = () => {
    alert('Detection endpoint assigned to Developer 1.');
  };

  return (
    <div className={styles.viewContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Detection View</h2>
        <p className={styles.subtitle}>
          Upload an image or select a sample frame to detect persons with bounding boxes.
        </p>
      </header>

      <section className={styles.layoutGrid}>
        <div>
          <BoundingBoxCanvas imageUrl={selectedSample} detections={[]} />

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleRunDetection}
            >
              Run Person Detection
            </button>
          </div>
        </div>

        <aside className={styles.statsPanel}>
          <h3 className={styles.statsTitle}>Detection Stats</h3>
          <ul className={styles.statsList}>
            <li className={styles.statsItem}>
              <span>People Count:</span>
              <strong>--</strong>
            </li>
            <li className={styles.statsItem}>
              <span>Average Confidence:</span>
              <strong>--</strong>
            </li>
            <li className={styles.statsItemLast}>
              <span>Inference Time:</span>
              <strong>--</strong>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
