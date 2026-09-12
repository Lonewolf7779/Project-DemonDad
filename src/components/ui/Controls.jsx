import React from 'react';

export function Controls({ onReignite, isAudioActive, onToggleAudio, isReducedMotion, onToggleMotion }) {
  return (
    <div className="controls-bar interactive">
      <button 
        className="btn-demondad"
        onClick={onReignite}
        title="Trigger headlight startup ignition sequence"
        aria-label="Re-ignite headlight sequence"
      >
        <span className="btn-icon">⚡</span>
        <span>RE-IGNITE</span>
      </button>

      <button 
        className={`btn-demondad ${isAudioActive ? 'active' : ''}`}
        onClick={onToggleAudio}
        title="Toggle ignition audio effects"
        aria-label="Toggle ignition audio"
      >
        <span className="btn-icon">{isAudioActive ? '🔊' : '🔇'}</span>
        <span>AUDIO: {isAudioActive ? 'ON' : 'OFF'}</span>
      </button>

      <button 
        className={`btn-demondad ${isReducedMotion ? 'active' : ''}`}
        onClick={onToggleMotion}
        title="Toggle reduced motion accessibility mode"
        aria-label="Toggle reduced motion"
      >
        <span className="btn-icon">♿</span>
        <span>MOTION: {isReducedMotion ? 'REDUCED' : 'CINEMATIC'}</span>
      </button>
    </div>
  );
}
