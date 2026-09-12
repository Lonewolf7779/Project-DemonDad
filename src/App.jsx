import React, { useState, useEffect, useRef } from 'react';
import { DialogueOverlay } from './components/DialogueOverlay';
import { StudioCanvas } from './components/StudioCanvas';
import { StartEngineButton } from './components/StartEngineButton';
import { startIntroSequence } from './animations/introSequence';
import { engineAudio } from './audio/EngineAudio';
import { getPrefersReducedMotion } from './utils/motion';
import './styles/intro.css';

export function App() {
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [studioOpacity, setStudioOpacity] = useState(0);
  const [headlightIntensity, setHeadlightIntensity] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isEngineStarted, setIsEngineStarted] = useState(false);

  const sequenceRef = useRef(null);

  useEffect(() => {
    const reduced = getPrefersReducedMotion();

    const sequence = startIntroSequence({
      onDialogueChange: (dialogueState) => {
        setCurrentDialogue(dialogueState);
      },
      onStudioOpacityChange: (opacity) => {
        setStudioOpacity(opacity);
      },
      onHeadlightChange: (intensity) => {
        setHeadlightIntensity(intensity);
      },
      onSequenceComplete: () => {
        setIsButtonVisible(true);
      },
      reducedMotion: reduced,
    });

    sequenceRef.current = sequence;

    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.destroy();
      }
      engineAudio.stop();
    };
  }, []);

  const handleStartEngine = () => {
    setIsEngineStarted(true);
    engineAudio.playV12Startup();
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

      {/* Story-First Dialogue in Urbanist Typography */}
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
