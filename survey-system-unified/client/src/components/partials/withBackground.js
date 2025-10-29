// withBackground.js
import React from 'react';

const withBackground = (WrappedComponent) => {
  return ({ overlayImage, ...props }) => (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #95b1ed, #3abde9)',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative', // Needed for overlay positioning
    }}>
      {/* Optional Image Overlay */}
      {overlayImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${overlayImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3, // Low transparency
            borderRadius: '10px',
          }}
        />
      )}

      {/* Wrapped Component */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <WrappedComponent {...props} />
      </div>
    </div>
  );
};

export default withBackground;