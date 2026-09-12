import { createTimeline, animate } from 'animejs';
import { EASINGS } from './easings';

/**
 * Headlight Ignition Sequence Orchestrator
 * 
 * Powered by Anime.js v4. Drives multi-stage electrical ignition:
 * 1. Standby
 * 2. DRL blade awakening
 * 3. High-voltage Xenon arc flicker / ballast strike
 * 4. Projector beam laser ignition & volumetric beam bloom
 * 5. Steady state "Online"
 */
export function createHeadlightSequence({
  onUpdate,
  onStageChange,
  soundManager = null,
  reducedMotion = false,
}) {
  const state = {
    drlIntensity: 0,
    arcIntensity: 0,
    projectorIntensity: 0,
    beamIntensity: 0,
    accentIntensity: 0,
  };

  const dispatchUpdate = () => {
    if (onUpdate) {
      onUpdate({ ...state });
    }
  };

  // Immediate dispatch of initial state
  dispatchUpdate();

  // Accessibility: Graceful fallback for prefers-reduced-motion
  if (reducedMotion) {
    if (onStageChange) onStageChange('ONLINE');
    const anim = animate(state, {
      drlIntensity: 1.0,
      arcIntensity: 0.0,
      projectorIntensity: 1.0,
      beamIntensity: 1.0,
      accentIntensity: 1.0,
      duration: 400,
      ease: 'outQuad',
      onUpdate: dispatchUpdate,
      onComplete: () => {
        if (soundManager) soundManager.startSteadyHum();
      }
    });

    return {
      play: () => anim.play && anim.play(),
      restart: () => {
        state.drlIntensity = 0;
        state.projectorIntensity = 0;
        state.beamIntensity = 0;
        state.accentIntensity = 0;
        dispatchUpdate();
        anim.restart && anim.restart();
      },
      pause: () => anim.pause && anim.pause(),
      destroy: () => anim.revert && anim.revert(),
    };
  }

  // Normal Cinematic Mode with Full Electrical Choreography
  const tl = createTimeline({
    onUpdate: dispatchUpdate,
    onComplete: () => {
      if (onStageChange) onStageChange('ONLINE');
    }
  });

  // -------------------------------------------------------------
  // STAGE 0: STANDBY (0 - 250ms)
  // -------------------------------------------------------------
  tl.call(() => {
    if (onStageChange) onStageChange('STANDBY');
  }, 0);

  // -------------------------------------------------------------
  // STAGE 1: DRL AWAKEN & RELAY CLICK (250 - 750ms)
  // -------------------------------------------------------------
  tl.call(() => {
    if (soundManager) soundManager.playRelayClick();
    if (onStageChange) onStageChange('DRL_INIT');
  }, 250);

  // Initial electrical surge into DRL blades
  tl.add(state, {
    drlIntensity: 0.45,
    accentIntensity: 0.2,
    duration: 100,
    ease: 'outQuad',
  }, 250);

  // Micro-dip as capacitors draw voltage
  tl.add(state, {
    drlIntensity: 0.18,
    duration: 70,
    ease: 'inOutQuad',
  }, 350);

  // Firm DRL lock-in
  tl.add(state, {
    drlIntensity: 1.0,
    accentIntensity: 0.5,
    duration: 250,
    ease: 'outCubic',
  }, 420);

  // -------------------------------------------------------------
  // STAGE 2: HIGH-VOLTAGE XENON ARC STRIKE (750 - 1350ms)
  // -------------------------------------------------------------
  tl.call(() => {
    if (soundManager) soundManager.playArcStrike();
    if (onStageChange) onStageChange('ARC_STRIKE');
  }, 750);

  // Spark 1: Initial rapid ionization strike
  tl.add(state, {
    arcIntensity: 0.9,
    projectorIntensity: 0.4,
    beamIntensity: 0.25,
    duration: 40,
    ease: EASINGS.electricStrike,
  }, 750);

  tl.add(state, {
    arcIntensity: 0.08,
    projectorIntensity: 0.1,
    beamIntensity: 0.05,
    duration: 35,
    ease: 'linear',
  }, 790);

  // Spark 2: Secondary high-power arc
  tl.add(state, {
    arcIntensity: 1.0,
    projectorIntensity: 0.75,
    beamIntensity: 0.5,
    duration: 50,
    ease: EASINGS.electricStrike,
  }, 825);

  tl.add(state, {
    arcIntensity: 0.2,
    projectorIntensity: 0.35,
    beamIntensity: 0.15,
    duration: 60,
    ease: 'linear',
  }, 875);

  // Spark 3: Final ballast catch & surge
  tl.add(state, {
    arcIntensity: 0.95,
    projectorIntensity: 0.85,
    beamIntensity: 0.65,
    duration: 65,
    ease: EASINGS.electricStrike,
  }, 935);

  tl.add(state, {
    arcIntensity: 0.3,
    duration: 100,
    ease: 'outQuad',
  }, 1000);

  // -------------------------------------------------------------
  // STAGE 3: PROJECTOR IGNITION & VOLUMETRIC EXPANSION (1200 - 2200ms)
  // -------------------------------------------------------------
  tl.call(() => {
    if (soundManager) soundManager.playProjectorIgnition();
    if (onStageChange) onStageChange('IGNITION');
  }, 1200);

  // Arc dissipates as gas discharge stabilizes
  tl.add(state, {
    arcIntensity: 0.0,
    duration: 300,
    ease: 'outQuad',
  }, 1200);

  // Projector core reaches full sports-car intensity
  tl.add(state, {
    projectorIntensity: 1.0,
    accentIntensity: 1.0,
    duration: 450,
    ease: EASINGS.projectorLock,
  }, 1200);

  // Volumetric beam blooms out through atmospheric dark haze
  tl.add(state, {
    beamIntensity: 1.0,
    duration: 850,
    ease: 'outCubic',
  }, 1250);

  return {
    play: () => tl.play && tl.play(),
    restart: () => {
      state.drlIntensity = 0;
      state.arcIntensity = 0;
      state.projectorIntensity = 0;
      state.beamIntensity = 0;
      state.accentIntensity = 0;
      dispatchUpdate();
      tl.restart && tl.restart();
    },
    pause: () => tl.pause && tl.pause(),
    destroy: () => {
      if (tl.revert) tl.revert();
    }
  };
}
