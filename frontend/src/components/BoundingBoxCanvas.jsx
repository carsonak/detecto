import React from 'react';

/**
 * Placeholder component for BoundingBoxCanvas (Developer 1).
 * Will render the image and overlay dynamic bounding boxes with confidence scores.
 */
export default function BoundingBoxCanvas({ imageUrl, detections }) {
  return (
    <div style={{ border: '2px dashed #cbd5e0', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
      <p style={{ color: '#718096', margin: 0 }}>
        [Canvas Overlay Placeholder - Developer 1]
      </p>
      {imageUrl && <p style={{ fontSize: '12px', color: '#a0aec0' }}>Loaded: {imageUrl}</p>}
    </div>
  );
}
