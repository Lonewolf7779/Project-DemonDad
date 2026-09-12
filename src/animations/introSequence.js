import { createTimeline, animate } from 'animejs';
import { INTRO_CONFIG } from '../config/introConfig';

/**
 * startIntroSequence - Orchestrates dialogue sequence and car reveal.
 * NOTE: Headlights remain OFF when car is revealed!
 */
export function startIntroSequence({
  onDialogueChange,
  onStudioOpacityChange,
  onReadyForStart,
  reducedMotion = false,
}) {
  const tl = createTimeline();

  if (reducedMotion) {
    onDialogueChange(null);
    onStudioOpacityChange(1.0);
    if (onReadyForStart) onReadyForStart();
    return {
      pause: () => {},
      destroy: () => {},
    };
  }

  let currentTime = 300;

  // 1. STORY-FIRST DIALOGUE SEQUENCE
  INTRO_CONFIG.dialogue.forEach((item, index) => {
    // Line enters
    tl.call(() => {
      onDialogueChange({
        text: item.text,
        speaker: item.speaker,
        visible: true,
        index,
      });
    }, currentTime);

    currentTime += item.duration;

    // Line exits
    tl.call(() => {
      onDialogueChange({
        text: item.text,
        speaker: item.speaker,
        visible: false,
        index,
      });
    }, currentTime);

    // Pure black silence (Line 1 has the mandatory 2.0s silence)
    currentTime += item.pauseAfter;
  });

  // 2. STUDIO CAR REVEAL (Headlights remain OFF!)
  const studioState = { opacity: 0 };
  tl.add(studioState, {
    opacity: 1.0,
    duration: 1600,
    ease: 'outQuad',
    onUpdate: () => onStudioOpacityChange(studioState.opacity),
  }, currentTime);

  currentTime += 1600 + 400;

  // 3. READY FOR START (Reveals exactly ONE button: START ENGINE)
  tl.call(() => {
    if (onReadyForStart) {
      onReadyForStart();
    }
  }, currentTime);

  return {
    pause: () => tl.pause && tl.pause(),
    destroy: () => {
      if (tl.revert) tl.revert();
    }
  };
}

/**
 * startHeadlightIgnition - Orchestrates the electrical startup flicker
 * when the user clicks START ENGINE.
 */
export function startHeadlightIgnition({ onUpdate, onComplete }) {
  const lightState = { intensity: 0 };
  const updateLight = () => onUpdate(lightState.intensity);

  const tl = createTimeline({
    onComplete: () => {
      if (onComplete) onComplete();
    }
  });

  // Stage 1: Subtle electrical awakening glow
  tl.add(lightState, {
    intensity: 0.15,
    duration: 250,
    ease: 'outQuad',
    onUpdate: updateLight,
  }, 0);

  // Stage 2: First Headlight Flicker / Blink
  tl.add(lightState, {
    intensity: 0.85,
    duration: 50,
    ease: 'linear',
    onUpdate: updateLight,
  }, 250);

  tl.add(lightState, {
    intensity: 0.0,
    duration: 80,
    ease: 'outQuad',
    onUpdate: updateLight,
  }, 300);

  // Stage 3: Short Pause
  // (380ms - 560ms)

  // Stage 4: Second Controlled Blink
  tl.add(lightState, {
    intensity: 0.95,
    duration: 70,
    ease: 'linear',
    onUpdate: updateLight,
  }, 560);

  tl.add(lightState, {
    intensity: 0.15,
    duration: 70,
    ease: 'outQuad',
    onUpdate: updateLight,
  }, 630);

  // Stage 5: Headlights Power Fully ON (Synchronized with engine catching!)
  tl.add(lightState, {
    intensity: 1.0,
    duration: 550,
    ease: 'outCubic',
    onUpdate: updateLight,
  }, 750);

  return tl;
}
