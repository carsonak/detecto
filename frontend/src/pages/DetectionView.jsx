import React, { useRef, useState } from 'react';
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

const SAMPLE_FRAMES = [
  { name: 'frame1.jpg', label: 'Frame 1', path: '/samples/frame1.jpg' },
  { name: 'frame2.jpg', label: 'Frame 2', path: '/samples/frame2.jpg' },
  { name: 'frame3.jpg', label: 'Frame 3', path: '/samples/frame3.jpg' },
  { name: 'frame4.jpg', label: 'Frame 4', path: '/samples/frame4.jpg' },
  { name: 'frame5.jpg', label: 'Frame 5', path: '/samples/frame5.jpg' },
  { name: 'frame6.jpg', label: 'Frame 6', path: '/samples/frame6.jpg' },
  { name: 'frame7.jpg', label: 'Frame 7', path: '/samples/frame7.jpg' },
  { name: 'frame8.jpg', label: 'Frame 8', path: '/samples/frame8.jpg' },
  { name: 'frame9.jpg', label: 'Frame 9', path: '/samples/frame9.jpg' },
  { name: 'frame10.jpg', label: 'Frame 10', path: '/samples/frame10.jpg' },
];

/**
 * DetectionView page component for uploading frames, selecting samples, viewing
 * responsive bounding box overlays, and monitoring inference metrics.
 *
 * @returns {React.ReactElement}
 */
export default function DetectionView() {
  const fileInputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  /** @type {[File | null, React.Dispatch<React.SetStateAction<File | null>>]} */
  const [file, setFile] = useState(null);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [imagePreview, setImagePreview] = useState(null);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [selectedSample, setSelectedSample] = useState(null);
  /** @type {[DetectionResult | null, React.Dispatch<React.SetStateAction<DetectionResult | null>>]} */
  const [result, setResult] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(false);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [error, setError] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isDragOver, setIsDragOver] = useState(false);

  /**
   * Processes a newly selected or dropped image file.
   *
   * @param {File} selectedFile
   * @returns {void}
   */
  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(/** @type {string} */ (reader.result));
    reader.onerror = () => setError('Could not read the selected image file.');
    reader.readAsDataURL(selectedFile);
  };

  /**
   * Handles user file selection from the hidden input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @returns {void}
   */
  const handleFileChange = (event) => {
    const selected = event.target.files && event.target.files[0];
    if (!selected) {
      return;
    }
    setSelectedSample(null);
    processFile(selected);
  };

  /**
   * Selects a sample frame from the bundled test gallery.
   *
   * @param {{ name: string, label: string, path: string }} sample
   * @returns {Promise<void>}
   */
  const handleSelectSample = async (sample) => {
    setSelectedSample(sample.name);
    setResult(null);
    setError(null);
    setImagePreview(sample.path);

    try {
      const response = await fetch(sample.path);
      const blob = await response.blob();
      const sampleFile = new File([blob], sample.name, { type: blob.type || 'image/jpeg' });
      setFile(sampleFile);
    } catch {
      setError(`Failed to load sample image: ${sample.name}`);
    }
  };

  /**
   * Uploads the selected image and renders the returned detections.
   *
   * Discloses side-effect: performs an HTTP POST to /api/detect which persists a history
   * record on the backend database.
   *
   * @returns {Promise<void>}
   */
  const handleRunDetection = async () => {
    if (!file) {
      setError('Please select an image file or sample first.');
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
          Upload a custom image or choose from test samples to detect persons with bounding boxes.
        </p>
      </header>

      {/* Sample Gallery Selector */}
      <section className={styles.sampleSection}>
        <h3 className={styles.sampleTitle}>Quick Sample Frames</h3>
        <div className={styles.sampleList}>
          {SAMPLE_FRAMES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              className={`${styles.sampleButton} ${selectedSample === sample.name ? styles.sampleButtonActive : ''}`}
              onClick={() => handleSelectSample(sample)}
            >
              <img src={sample.path} alt={sample.label} className={styles.sampleThumbnail} />
              <div className={styles.sampleName}>{sample.label}</div>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.layoutGrid}>
        <div>
          {/* Drag & Drop Upload Zone */}
          <div
            className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const dropped = e.dataTransfer.files && e.dataTransfer.files[0];
              if (dropped) {
                setSelectedSample(null);
                processFile(dropped);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <p className={styles.dropZonePrompt}>
              {file ? `Selected: ${file.name}` : 'Drag & drop an image here, or click to browse'}
            </p>
          </div>

          <BoundingBoxCanvas
            imageSrc={imagePreview || (result && result.annotated_image) || null}
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
              disabled={loading || !file}
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
              <strong>{result ? `${(result.avg_confidence * 100).toFixed(1)}%` : '--'}</strong>
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