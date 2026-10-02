import React from 'react';
import styles from './BoundingBoxCanvas.module.css';

/**
 * @typedef {Object} Detection
 * @property {[number, number, number, number]} box - Normalized coordinates [ymin, xmin, ymax, xmax].
 * @property {number} confidence - Model confidence score between 0.0 and 1.0.
 * @property {string} label - Class label (e.g. "person").
 */

/**
 * @typedef {Object} BoundingBoxCanvasProps
 * @property {string | null} [imageUrl] - URL or base64 data string of the image to display.
 * @property {Detection[]} [detections] - Array of detection objects with bounding box coordinates.
 */

/**
 * Canvas component responsible for rendering frame images and drawing scaled bounding boxes.
 *
 * @param {BoundingBoxCanvasProps} props
 * @returns {React.ReactElement}
 */
export default function BoundingBoxCanvas({ imageUrl = null, detections = [] }) {
  return (
    <div className={styles.canvasContainer}>
      <p className={styles.placeholderText}>
        [Canvas Overlay Placeholder &mdash; Developer 1]
      </p>
      {imageUrl && (
        <p className={styles.imageIndicator}>
          Loaded: {imageUrl}
        </p>
      )}
      {detections && detections.length > 0 && (
        <p className={styles.imageIndicator}>
          Detections to render: {detections.length}
        </p>
      )}
    </div>
  );
}
