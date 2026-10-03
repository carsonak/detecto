import React, { useState } from 'react';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';
import styles from './DetectionView.module.css';

/**
 * @typedef {Object} DetectionResult
 * @property {number} people_count - Number of persons detected in the submitted image.
 * @property {number} avg_confidence - Mean confidence across valid detections.
 * @property {number} inference_time_ms - Server-side inference latency in milliseconds.
 * @property {import('../components/BoundingBoxCanvas').Detection[]} detections - Normalized detection boxes.
 * @property {string} [annotated_image] - Data URL of the server-annotated frame.
 */

/**
 * DetectionView page component for uploading frames, viewing detection overlays,
 * and monitoring per-frame inference metrics.
 *
 * @returns {React.ReactElement}
 */
export default function DetectionView() {
  /** @type {[File | null, React.Dispatch<React.SetStateAction<File | null>>]} */
  const [file, setFile] = useState(null);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [imagePreview, setImagePreview] = useState(null);
  /** @type {[DetectionResult | null, React.Dispatch<React.SetStateAction<DetectionResult | null>>]} */
  const [result, setResult] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(false);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [error, setError] = useState(null);

  /**
   * Reads the selected image into a data URL for instant local preview.
   *
   * Discloses side-effect: reads the file via FileReader and replaces any prior result with
   * new coordinates that no longer match the displayed image.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @returns {void}
   */
  const handleFileChange = (event) => {
    const selected = event.target.files && event.target.files[0];
    if (!selected) {
      return;
    }

    setFile(selected);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(/** @type {string} */ (reader.result));
    reader.onerror = () => setError('Could not read the selected image.');
    reader.readAsDataURL(selected);
  };

  /**
   * Uploads the selected image and renders the returned detections.
   *
   * Discloses side-effect: performs an HTTP POST to /api/detect which persists a history
   * record on the backend.
   *
   * @returns {Promise<void>}
   */
  const handleRunDetection = async () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/detect', { method: 'POST', body: formData });
      if (!response.ok) {
        throw new Error(`Detection failed with status ${response.status}`);
      }
      const data = await response.json();
      setResult(/** @type {DetectionResult} */ (data));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Detection request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.viewContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Detection View</h2>
        <p className={styles.subtitle}>
          Upload an image to detect persons with bounding boxes.
        </p>
      </header>

      <section className={styles.layoutGrid}>
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className={styles.fileInput}
          />

          <BoundingBoxCanvas
            imageSrc={(result && result.annotated_image) || imagePreview}
            detections={(result && result.detections) || []}
          />

          <div className={styles.actionRow}>
            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleRunDetection}
              disabled={loading}
            >
              {loading ? 'Detecting...' : 'Run Person Detection'}
            </button>
          </div>
        </div>

        <aside className={styles.statsPanel}>
          <h3 className={styles.statsTitle}>Detection Stats</h3>
          <ul className={styles.statsList}>
            <li className={styles.statsItem}>
              <span>People Count:</span>
              <strong>{result ? result.people_count : '--'}</strong>
            </li>
            <li className={styles.statsItem}>
              <span>Average Confidence:</span>
              <strong>{result ? result.avg_confidence.toFixed(2) : '--'}</strong>
            </li>
            <li className={styles.statsItemLast}>
              <span>Inference Time:</span>
              <strong>{result ? `${result.inference_time_ms.toFixed(0)} ms` : '--'}</strong>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}