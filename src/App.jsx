import React, { useState, useEffect, useRef } from 'react';
import { DialogueOverlay } from './components/DialogueOverlay';
import { StudioCanvas } from './components/StudioCanvas';
import { StartEngineButton } from './components/StartEngineButton';
import { startIntroSequence, startHeadlightIgnition } from './animations/introSequence';
import { engineAudio } from './audio/EngineAudio';
import { getPrefersReducedMotion } from './utils/motion';
import './styles/intro.css';

export function App() {
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [studioOpacity, setStudioOpacity] = useState(0);
  const [headlightIntensity, setHeadlightIntensity] = useState(0); // Initially 0 (OFF)
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isEngineStarted, setIsEngineStarted] = useState(false);

  const introSeqRef = useRef(null);
  const headlightSeqRef = useRef(null);

  useEffect(() => {
    const reduced = getPrefersReducedMotion();

    // 1. Start dialogue -> car reveal in darkness -> ready for user ignition
    const sequence = startIntroSequence({
      onDialogueChange: (dialogueState) => {
        setCurrentDialogue(dialogueState);
      },
      onStudioOpacityChange: (opacity) => {
        setStudioOpacity(opacity);
      },
      onReadyForStart: () => {
        // Car is revealed in dark studio with headlights OFF
        // Reveal exactly ONE button: START ENGINE
        setIsButtonVisible(true);
      },
      reducedMotion: reduced,
    });

    introSeqRef.current = sequence;

    return () => {
      if (introSeqRef.current) {
        introSeqRef.current.destroy();
      }
      if (headlightSeqRef.current) {
        headlightSeqRef.current.revert && headlightSeqRef.current.revert();
      }
      engineAudio.stop();
    };
  }, []);

  const handleStartEngine = () => {
    if (isEngineStarted) return;
    setIsEngineStarted(true);

    // 2. Coordinated Ignition Sequence:
    // Starter motor cranks ("che-che-che...") -> Headlights flicker -> Engine catches -> Continuous V12 idle loop
    engineAudio.playEngineStartSequence({
      onStarterStart: () => {
        // Starter cranking starts
      },
      onHeadlightTrigger: () => {
        // Headlights flicker and lock on
        headlightSeqRef.current = startHeadlightIgnition({
          onUpdate: (intensity) => {
            setHeadlightIntensity(intensity);
          },
          onComplete: () => {
            setHeadlightIntensity(1.0);
          }
        });
      },
      onEngineCatch: () => {
        // V12 combustion catches
      },
      onEngineRunning: () => {
        // V12 continues running steadily
      }
    });
  };

  return (
    <main className="demondad-viewport" role="main">
      {/* 3D Dark Studio & Real Sports Car */}
      <div 
        className="studio-layer" 
        style={{ 
          opacity: studioOpacity,
          transition: 'opacity 1.4s ease-out'
        }}
      >
        <StudioCanvas 
          headlightIntensity={headlightIntensity}
          isVibrating={isEngineStarted}
        />
      </div>

      {/* Story-First Dialogue in 2.5x Urbanist Typography */}
      <DialogueOverlay currentDialogue={currentDialogue} />

      {/* Exactly ONE Interactive Button: START ENGINE */}
      <StartEngineButton 
        isVisible={isButtonVisible}
        onClick={handleStartEngine}
        isEngineStarted={isEngineStarted}
      />
    </main>
  );
}

export default App;
