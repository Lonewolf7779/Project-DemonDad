import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExperienceCanvas } from './components/canvas/ExperienceCanvas';
import { BrandHeader } from './components/ui/BrandHeader';
import { TelemetryHUD } from './components/ui/TelemetryHUD';
import { Controls } from './components/ui/Controls';
import { CinematicOverlay } from './components/common/CinematicOverlay';
import { createHeadlightSequence } from './animations/headlightSequence';
import { soundManager } from './audio/SoundManager';
import { getPrefersReducedMotion, onReducedMotionChange } from './utils/motion';
import './styles/cinematic.css';

export function App() {
  const [lightState, setLightState] = useState({
    drlIntensity: 0,
    arcIntensity: 0,
    projectorIntensity: 0,
    beamIntensity: 0,
    accentIntensity: 0,
  });

  const [stage, setStage] = useState('STANDBY');
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(getPrefersReducedMotion());

  const sequenceRef = useRef(null);

  // Starts or restarts the ignition sequence
  const startSequence = useCallback((reduced = isReducedMotion) => {
    if (sequenceRef.current) {
      sequenceRef.current.destroy();
      sequenceRef.current = null;
    }

    const sequence = createHeadlightSequence({
      onUpdate: (newState) => {
        setLightState(newState);
      },
      onStageChange: (newStage) => {
        setStage(newStage);
      },
      soundManager: isAudioActive ? soundManager : null,
      reducedMotion: reduced,
    });

    sequenceRef.current = sequence;
  }, [isAudioActive, isReducedMotion]);

  // Initial sequence trigger on page load
  useEffect(() => {
    startSequence(isReducedMotion);

    const unsubscribeMotion = onReducedMotionChange((prefersReduced) => {
      setIsReducedMotion(prefersReduced);
      startSequence(prefersReduced);
    });

    return () => {
      unsubscribeMotion();
      if (sequenceRef.current) {
        sequenceRef.current.destroy();
      }
      soundManager.stopAll();
    };
  }, []);

  const handleReignite = () => {
    // If audio was previously activated by user, ensure sound manager context is ready
    if (isAudioActive) {
      soundManager.initContext();
    }
    startSequence(isReducedMotion);
  };

  const handleToggleAudio = () => {
    const nextState = !isAudioActive;
    setIsAudioActive(nextState);
    soundManager.setMuted(!nextState);
    // Restart sequence with audio enabled so user immediately hears the ignition
    if (nextState) {
      startSequence(isReducedMotion);
    }
  };

  const handleToggleMotion = () => {
    const nextMotion = !isReducedMotion;
    setIsReducedMotion(nextMotion);
    startSequence(nextMotion);
  };

  return (
    <main className="cinematic-container" role="main">
      {/* 3D WebGL Canvas Layer */}
      <ExperienceCanvas lightState={lightState} />

      {/* Cinematic Vignette & Flare Overlays */}
      <CinematicOverlay lightState={lightState} />

      {/* Heads Up Display (HUD) Interface */}
      <div className="ui-overlay-layer">
        <BrandHeader stage={stage} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Controls 
            onReignite={handleReignite}
            isAudioActive={isAudioActive}
            onToggleAudio={handleToggleAudio}
            isReducedMotion={isReducedMotion}
            onToggleMotion={handleToggleMotion}
          />

          <TelemetryHUD 
            stage={stage} 
            lightState={lightState} 
          />
        </div>
      </div>
    </main>
  );
}

export default App;
