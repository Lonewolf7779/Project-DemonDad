import { createTimeline, animate } from 'animejs';
import { INTRO_CONFIG } from '../config/introConfig';

/**
 * introSequence - Centralized Anime.js v4 timeline orchestrating the story-first intro:
 * 1. Dialogue line 1 ("Dad, Dad!!") -> 3s visible
 * 2. 2-second pure black silence
 * 3. Dialogue line 2 ("Yes, son?")
 * 4. Dialogue line 3 ("Do machines have a soul?")
 * 5. Dialogue line 4 ("Shhhhh...")
 * 6. Dialogue line 5 ("Listen... closely.")
 * 7. Silence & Car Studio Reveal
 * 8. Headlight Sequence (Awaken -> Blink 1 -> Pause -> Blink 2 -> Full ON)
 * 9. Trigger single "START ENGINE" button appearance
 */
export function startIntroSequence({
  onDialogueChange,
  onStudioOpacityChange,
  onHeadlightChange,
  onSequenceComplete,
  reducedMotion = false,
}) {
  const tl = createTimeline();

  if (reducedMotion) {
    onDialogueChange(null);
    onStudioOpacityChange(1.0);
    onHeadlightChange(1.0);
    if (onSequenceComplete) onSequenceComplete();
    return {
      pause: () => {},
      destroy: () => {},
    };
  }

  let currentTime = 300;

  // 1. DIALOGUE SEQUENCE
  INTRO_CONFIG.dialogue.forEach((item, index) => {
    tl.call(() => {
      onDialogueChange({
        text: item.text,
        speaker: item.speaker,
        visible: true,
        index,
      });
    }, currentTime);

    currentTime += item.duration;

    tl.call(() => {
      onDialogueChange({
        text: item.text,
        speaker: item.speaker,
        visible: false,
        index,
      });
    }, currentTime);

    currentTime += item.pauseAfter;
  });

  // 2. STUDIO CAR REVEAL
  const studioState = { opacity: 0 };
  tl.add(studioState, {
    opacity: 1.0,
    duration: INTRO_CONFIG.headlightSequence.revealFadeIn,
    ease: 'outQuad',
    onUpdate: () => onStudioOpacityChange(studioState.opacity),
  }, currentTime);

  currentTime += INTRO_CONFIG.headlightSequence.revealFadeIn + INTRO_CONFIG.headlightSequence.awakeningDelay;

  // 3. HEADLIGHT STARTUP CHOREOGRAPHY
  const lightState = { intensity: 0 };
  const updateLight = () => onHeadlightChange(lightState.intensity);

  // Stage 1: Subtle awakening glow
  tl.add(lightState, {
    intensity: 0.15,
    duration: 350,
    ease: 'outQuad',
    onUpdate: updateLight,
  }, currentTime);
  currentTime += 400;

  // Stage 2: First Headlight Flicker / Blink
  tl.add(lightState, {
    intensity: 0.85,
    duration: 60,
    ease: 'linear',
    onUpdate: updateLight,
  }, currentTime);
  currentTime += 60;

  tl.add(lightState, {
    intensity: 0.0,
    duration: 100,
    ease: 'outQuad',
    onUpdate: updateLight,
  }, currentTime);
  currentTime += INTRO_CONFIG.headlightSequence.pause1; // Stage 3: Pause

  // Stage 4: Second Controlled Blink
  tl.add(lightState, {
    intensity: 0.95,
    duration: 80,
    ease: 'linear',
    onUpdate: updateLight,
  }, currentTime);
  currentTime += 80;

  tl.add(lightState, {
    intensity: 0.1,
    duration: 90,
    ease: 'outQuad',
    onUpdate: updateLight,
  }, currentTime);
  currentTime += INTRO_CONFIG.headlightSequence.pause2;

  // Stage 5: Headlights Power Fully ON
  tl.add(lightState, {
    intensity: 1.0,
    duration: INTRO_CONFIG.headlightSequence.fullPowerDuration,
    ease: 'outCubic',
    onUpdate: updateLight,
  }, currentTime);
  currentTime += INTRO_CONFIG.headlightSequence.fullPowerDuration + 300;

  // 4. REVEAL EXACTLY ONE BUTTON: START ENGINE
  tl.call(() => {
    if (onSequenceComplete) {
      onSequenceComplete();
    }
  }, currentTime);

  return {
    pause: () => tl.pause && tl.pause(),
    destroy: () => {
      if (tl.revert) tl.revert();
    }
  };
}
