import React, { useRef, useState } from 'react';
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
 * Renders an image with absolutely-positioned bounding box overlays drawn on top of it.
 *
 * Consumes normalized detection coordinates (0-1) from the backend and rescales them to the
 * image's rendered pixel size, so overlays stay aligned at any display width.
 *
 * @param {BoundingBoxCanvasProps} props - `imageSrc` is the image to render (falsy shows a
 * placeholder); `detections` are normalized boxes to overlay.
 * @returns {React.ReactElement} The image with detection overlays, or a placeholder when no image is set.
 */
export default function BoundingBoxCanvas({ imageSrc = null, detections = [] }) {
  const imageRef = useRef(/** @type {HTMLImageElement | null} */ (null));
  const [naturalSize, setNaturalSize] = useState(
    /** @type {{ width: number, height: number }} */ ({ width: 0, height: 0 })
  );

  if (!imageSrc) {
    return <p className={styles.placeholderText}>No image loaded</p>;
  }

  /**
   * Captures intrinsic image dimensions once decoded, before any responsive downscale.
   *
   * @param {React.SyntheticEvent<HTMLImageElement>} event
   * @returns {void}
   */
  const handleImageLoad = (event) => {
    const image = event.currentTarget;
    setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
  };

  // Rendered pixels per normalized unit; guarded until naturalWidth is known.
  const scaleX = naturalSize.width > 0 ? imageRef.current?.clientWidth / naturalSize.width : 0;
  const scaleY = naturalSize.height > 0 ? imageRef.current?.clientHeight / naturalSize.height : 0;

  return (
    <div className={styles.canvasContainer} style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="Detection frame"
        onLoad={handleImageLoad}
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />

      {scaleX > 0 &&
        scaleY > 0 &&
        detections.map((detection, index) => {
          const [x1, y1, x2, y2] = detection.box;
          const left = x1 * scaleX;
          const top = y1 * scaleY;
          const width = (x2 - x1) * scaleX;
          const height = (y2 - y1) * scaleY;

          return (
            <div
              key={`${detection.box.join('-')}-${index}`}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                border: '2px solid red',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  color: '#fff',
                  backgroundColor: 'red',
                  fontSize: '12px',
                  lineHeight: '14px',
                  padding: '0 4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {`${detection.label || 'person'} ${detection.confidence.toFixed(2)}`}
              </span>
            </div>
          );
        })}
    </div>
  );
}