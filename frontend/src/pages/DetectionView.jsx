import React, { useState } from 'react';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';

/**
 * Placeholder page for DetectionView (Developer 1).
 */
export default function DetectionView() {
  const [selectedSample, setSelectedSample] = useState(null);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Detection View</h2>
        <p style={{ margin: '4px 0 0', color: '#4a5568' }}>
          Upload an image or select a sample frame to detect persons with bounding boxes.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <BoundingBoxCanvas imageUrl={selectedSample} detections={[]} />
          
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button
              style={{
                padding: '10px 18px',
                backgroundColor: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 500,
              }}
              onClick={() => alert('Detection endpoint assigned to Developer 1.')}
            >
              Run Person Detection
            </button>
          </div>
        </div>

        <aside style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Detection Stats</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#4a5568' }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #edf2f7' }}>
              <strong>People Count:</strong> --
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #edf2f7' }}>
              <strong>Average Confidence:</strong> --
            </li>
            <li style={{ padding: '8px 0' }}>
              <strong>Inference Time:</strong> --
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
