import React from 'react';
import styles from './BoundingBoxCanvas.module.css';

/**
 * @typedef {Object} Detection
 * @property {[number, number, number, number]} box - Normalized coordinates [x1, y1, x2, y2] in the 0-1 range.
 * @property {number} confidence - Model confidence score between 0.0 and 1.0.
 * @property {string} [label] - Class label (e.g. "person").
 */

/**
 * @typedef {Object} BoundingBoxCanvasProps
 * @property {string | null} [imageSrc] - URL or base64 data URL of the image to display.
 * @property {Detection[]} [detections] - Array of detection objects with bounding box coordinates.
 */

/**
 * Renders an image with responsive, absolutely-positioned bounding box overlays drawn on top.
 *
 * Consumes normalized detection coordinates (0-1) from the backend and positions overlays
 * using CSS percentage coordinates, guaranteeing pixel-perfect alignment at any display size.
 *
 * @param {BoundingBoxCanvasProps} props - `imageSrc` is the image to render (falsy shows a
 * placeholder); `detections` are normalized boxes to overlay.
 * @returns {React.ReactElement} The image with detection overlays, or a placeholder when no image is set.
 */
export default function BoundingBoxCanvas({ imageSrc = null, detections = [] }) {
  if (!imageSrc) {
    return <p className={styles.placeholderText}>No image loaded</p>;
  }

  return (
    <div className={styles.canvasContainer} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <img
        src={imageSrc}
        alt="Detection frame"
        style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '4px' }}
      />

      {detections && detections.length > 0 &&
        detections.map((detection, index) => {
          const box = detection.box || [0, 0, 0, 0];
          const [x1, y1, x2, y2] = box;
          const left = `${Math.max(0, Math.min(1, x1)) * 100}%`;
          const top = `${Math.max(0, Math.min(1, y1)) * 100}%`;
          const width = `${Math.max(0, Math.min(1, x2 - x1)) * 100}%`;
          const height = `${Math.max(0, Math.min(1, y2 - y1)) * 100}%`;
          const confidencePct = (detection.confidence * 100).toFixed(0);

          return (
            <div
              key={`${x1}-${y1}-${x2}-${y2}-${index}`}
              style={{
                position: 'absolute',
                left,
                top,
                width,
                height,
                border: '2px solid #ef4444',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '-2px',
                  color: '#ffffff',
                  backgroundColor: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 600,
                  lineHeight: '14px',
                  padding: '1px 5px',
                  borderRadius: '3px 3px 0 0',
                  whiteSpace: 'nowrap',
                }}
              >
                {`${detection.label || 'person'} ${confidencePct}%`}
              </span>
            </div>
          );
        })}
    </div>
  );
}