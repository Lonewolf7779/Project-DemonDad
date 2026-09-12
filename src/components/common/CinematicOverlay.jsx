import React from 'react';

export function CinematicOverlay({ lightState }) {
  const isFlaring = lightState && (lightState.arcIntensity > 0.4 || lightState.projectorIntensity > 0.85);

  return (
    <>
      <div className="vignette-overlay" />
      <div className="scanline-overlay" />
      <div className="letterbox-top" />
      <div className="letterbox-bottom" />
      <div className={`optical-flare-pulse ${isFlaring ? 'active' : ''}`} />
    </>
  );
}
