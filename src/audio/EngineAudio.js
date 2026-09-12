import { INTRO_CONFIG } from '../config/introConfig';

/**
 * EngineAudio - High-fidelity automotive ignition audio engine
 * 
 * Orchestrates:
 * 1. Starter motor cranking ("che-che-che-che...")
 * 2. Engine catch & V12 combustion roar
 * 3. Continuous V12 running / idle loop that keeps playing steadily
 */
class EngineAudio {
  constructor() {
    this.starterAudio = null;
    this.v12Audio = null;
    this.isRunning = false;
    this.isMuted = false;
    this.initAudio();
  }

  initAudio() {
    if (typeof window === 'undefined') return;
    try {
      // 1. Starter Motor Cranking Audio
      this.starterAudio = new Audio(INTRO_CONFIG.audio.starterCrank);
      this.starterAudio.preload = 'auto';
      this.starterAudio.volume = 0.95;

      // 2. V12 Combustion & Running Audio
      this.v12Audio = new Audio(INTRO_CONFIG.audio.v12Startup);
      this.v12Audio.preload = 'auto';
      this.v12Audio.volume = 1.0;
      this.v12Audio.loop = true; // Continues running indefinitely!
    } catch (e) {
      console.warn('Audio initialization warning:', e);
    }
  }

  /**
   * Executes the full automotive starting sequence:
   * Starter crank -> Headlight flicker -> Engine catches -> Continuous V12 idle
   */
  playEngineStartSequence({ onStarterStart, onHeadlightTrigger, onEngineCatch, onEngineRunning }) {
    if (!this.starterAudio || !this.v12Audio) {
      this.initAudio();
    }
    if (!this.starterAudio || !this.v12Audio) return;

    this.isRunning = true;

    // Phase 1 (T = 0ms): Starter Motor Cranking ("che-che-che-che...")
    this.starterAudio.currentTime = 0;
    this.starterAudio.play().catch(() => {});
    if (onStarterStart) onStarterStart();

    // Phase 2 (T = 600ms): Headlight Electrical Flicker Trigger
    setTimeout(() => {
      if (!this.isRunning) return;
      if (onHeadlightTrigger) onHeadlightTrigger();
    }, 600);

    // Phase 3 (T = 1350ms): Engine Catches & V12 Combustion Fires
    setTimeout(() => {
      if (!this.isRunning) return;
      
      // Stop/fade starter crank
      try {
        this.starterAudio.pause();
        this.starterAudio.currentTime = 0;
      } catch (e) {}

      // Start V12 Roar & Continuous Running Loop
      this.v12Audio.currentTime = 0;
      this.v12Audio.play().catch(() => {});
      if (onEngineCatch) onEngineCatch();

      // Phase 4: Settle into continuous running idle
      setTimeout(() => {
        if (onEngineRunning) onEngineRunning();
      }, 500);
    }, 1350);
  }

  /**
   * Smoothly fades out and stops audio (used when transitioning to next scene)
   */
  fadeAndStop(durationMs = 1500) {
    this.isRunning = false;
    if (this.v12Audio) {
      const startVol = this.v12Audio.volume;
      const startTime = performance.now();

      const fadeStep = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        if (this.v12Audio) {
          this.v12Audio.volume = startVol * (1 - progress);
        }
        if (progress < 1) {
          requestAnimationFrame(fadeStep);
        } else {
          this.stop();
          if (this.v12Audio) this.v12Audio.volume = startVol;
        }
      };
      requestAnimationFrame(fadeStep);
    } else {
      this.stop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.starterAudio) {
      try {
        this.starterAudio.pause();
        this.starterAudio.currentTime = 0;
      } catch (e) {}
    }
    if (this.v12Audio) {
      try {
        this.v12Audio.pause();
        this.v12Audio.currentTime = 0;
      } catch (e) {}
    }
  }
}

export const engineAudio = new EngineAudio();
