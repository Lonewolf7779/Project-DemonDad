import React, { useState, useEffect, useRef } from 'react';
import { DialogueOverlay } from './components/DialogueOverlay';
import { StudioCanvas } from './components/StudioCanvas';
import { StartEngineButton } from './components/StartEngineButton';
import { CarShowcase } from './components/showcase/CarShowcase';
import { startIntroSequence, startHeadlightIgnition } from './animations/introSequence';
import { engineAudio } from './audio/EngineAudio';
import { getPrefersReducedMotion } from './utils/motion';
import './styles/intro.css';
import './styles/showcase.css';

export function App() {
  // Current active scene: 'intro' | 'transitioning' | 'showcase'
  const [currentScene, setCurrentScene] = useState('intro');

  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [studioOpacity, setStudioOpacity] = useState(0);
  const [headlightIntensity, setHeadlightIntensity] = useState(0); // Starts at 0 (OFF)
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isEngineStarting, setIsEngineStarting] = useState(false);

  const introSeqRef = useRef(null);
  const headlightSeqRef = useRef(null);
  const studioSceneRef = useRef(null);

  // Initialize Scene 1 Opening Sequence
  useEffect(() => {
    runIntroSequence();

    return () => {
      if (introSeqRef.current) introSeqRef.current.destroy();
      if (headlightSeqRef.current) headlightSeqRef.current.revert && headlightSeqRef.current.revert();
      engineAudio.stop();
    };
  }, []);

  const runIntroSequence = () => {
    setCurrentScene('intro');
    setIsButtonVisible(false);
    setIsEngineStarting(false);
    setHeadlightIntensity(0);
    setStudioOpacity(0);

    const reduced = getPrefersReducedMotion();

    const sequence = startIntroSequence({
      onDialogueChange: (dialogueState) => {
        setCurrentDialogue(dialogueState);
      },
      onStudioOpacityChange: (opacity) => {
        setStudioOpacity(opacity);
      },
      onReadyForStart: () => {
        // Car is visible in dark studio with headlights OFF
        // Exactly ONE button appears: START ENGINE
        setIsButtonVisible(true);
      },
      reducedMotion: reduced,
    });

    introSeqRef.current = sequence;
  };

  // User clicks START ENGINE
  const handleStartEngine = () => {
    if (isEngineStarting) return;
    setIsEngineStarting(true);

    // 1. Play finite automotive start sequence:
    // Starter crank ("cle-cle...") -> Headlight flicker -> Engine catch & V12 roar -> Dual throttle blips -> Settle -> End
    engineAudio.playEngineStartSequence({
      onStarterStart: () => {
        // Starter cranking starts
      },
      onHeadlightTrigger: () => {
        // Headlights flicker and lock into full power
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
      onEngineSequenceComplete: () => {
        // 2. Audio finished naturally: Short cinematic beat, then transition to Scene 2
        setTimeout(() => {
          triggerSceneTransition();
        }, 600);
      }
    });
  };

  // Executes the cinematic transition to Scene 2 (Car Specifications Showcase)
  const triggerSceneTransition = () => {
    setCurrentScene('transitioning');
    setIsButtonVisible(false);

    // Camera smoothly glides to 3/4 sports car showcase perspective in Three.js
    if (studioSceneRef.current) {
      studioSceneRef.current.transitionToShowcase(2200);
    }

    // Reveal Scene 2 Showcase UI after camera motion initiates
    setTimeout(() => {
      setCurrentScene('showcase');
    }, 900);
  };

  // Replay intro from Scene 2
  const handleReplayIntro = () => {
    if (studioSceneRef.current) {
      studioSceneRef.current.resetToIntroView(1600);
    }
    runIntroSequence();
  };

  return (
    <main className="demondad-viewport" role="main">
      {/* Shared 3D Dark Studio & Real Sports Car */}
      <div 
        className="studio-layer" 
        style={{ 
          opacity: studioOpacity,
          transition: 'opacity 1.4s ease-out'
        }}
      >
        <StudioCanvas 
          headlightIntensity={headlightIntensity}
          isVibrating={isEngineStarting && currentScene === 'intro'}
          onSceneReady={(scene) => {
            studioSceneRef.current = scene;
          }}
        />
      </div>

      {/* SCENE 1: Story-First Dialogue in 2.5x Urbanist Typography */}
      {currentScene === 'intro' && (
        <DialogueOverlay currentDialogue={currentDialogue} />
      )}

      {/* SCENE 1: Exactly ONE Interactive Button: START ENGINE */}
      {currentScene === 'intro' && (
        <StartEngineButton 
          isVisible={isButtonVisible}
          onClick={handleStartEngine}
          isEngineStarted={isEngineStarting}
        />
      )}

      {/* SCENE 2: Car Showcase & Specifications Page */}
      {currentScene === 'showcase' && (
        <CarShowcase onReplayIntro={handleReplayIntro} />
      )}
    </main>
  );
}

export default App;
