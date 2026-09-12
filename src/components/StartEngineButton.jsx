import React from 'react';

export function StartEngineButton({ isVisible, onClick, isEngineStarted }) {
  if (!isVisible) return null;

  return (
    <div className={`start-engine-container ${isVisible ? 'button-visible' : ''}`}>
      <button 
        className={`btn-start-engine ${isEngineStarted ? 'engine-active' : ''}`}
        onClick={onClick}
        disabled={isEngineStarted}
        aria-label="Start V12 sports car engine"
      >
        <span className="btn-glow-ring" />
        <span className="btn-label">
          {isEngineStarted ? 'V12 RUNNING' : 'START ENGINE'}
        </span>
      </button>
    </div>
  );
}
