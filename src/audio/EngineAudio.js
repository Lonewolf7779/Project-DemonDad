/**
 * EngineAudio - High-Fidelity Automotive Audio Engine
 * 
 * Orchestrates a FINITE, realistic engine startup experience:
 * 1. Starter motor cranking ("cle-cle-cle-cle...")
 * 2. Engine catches with V12 combustion roar
 * 3. Short idle settle
 * 4. Throttle blip 1 ("VOOOM...") -> RPM fall
 * 5. Throttle blip 2 ("VOOOM...") -> RPM fall
 * 6. Engine returns to idle and smoothly fades out
 * 7. Calls onComplete() to trigger the transition to Scene 2 (Car Specifications)
 */
class EngineAudio {
  constructor() {
    this.starterAudio = null;
    this.engineAudio = null;
    this.isPlaying = false;
    this.initAudio();
  }

  initAudio() {
    if (typeof window === 'undefined') return;
    try {
      // 1. Starter Motor Cranking Audio ("cle-cle-cle...")
      this.starterAudio = new Audio('/audio/starter-crank.mp3');
      this.starterAudio.preload = 'auto';
      this.starterAudio.volume = 0.95;

      // 2. Full V12 Engine Startup & Throttle Revs Audio
      // Contains: Ignition catch -> V12 idle -> Rev 1 -> Fall -> Rev 2 -> Fall -> Idle Settle
      this.engineAudio = new Audio('/audio/ferrari-488.mp3');
      this.engineAudio.preload = 'auto';
      this.engineAudio.volume = 1.0;
      this.engineAudio.loop = false; // FINITE sequence, NOT infinite loop!
    } catch (e) {
      console.warn('Audio initialization warning:', e);
    }
  }

  /**
   * Executes the synchronized automotive start sequence
   */
  playEngineStartSequence({
    onStarterStart,
    onHeadlightTrigger,
    onEngineCatch,
    onEngineSequenceComplete,
  }) {
    if (!this.starterAudio || !this.engineAudio) {
      this.initAudio();
    }
    if (!this.starterAudio || !this.engineAudio) return;

    this.isPlaying = true;

    // Phase 1 (T = 0ms): Starter Motor Cranking ("cle-cle-cle-cle...")
    this.starterAudio.currentTime = 0;
    this.starterAudio.play().catch(() => {});
    if (onStarterStart) onStarterStart();

    // Phase 2 (T = 2400ms): Headlights begin electrical flicker towards end of starter cycle
    setTimeout(() => {
      if (!this.isPlaying) return;
      if (onHeadlightTrigger) onHeadlightTrigger();
    }, 2400);

    // Phase 3 (T = 3200ms -> At least 3 seconds of starter cranking!):
    // Engine Catches -> V12 Roar + Throttle Blips
    setTimeout(() => {
      if (!this.isPlaying) return;

      // Stop starter crank
      try {
        this.starterAudio.pause();
        this.starterAudio.currentTime = 0;
      } catch (e) {}

      // Play V12 engine startup & rev sequence
      this.engineAudio.currentTime = 0;
      this.engineAudio.play().catch(() => {});
      if (onEngineCatch) onEngineCatch();

      // Phase 4: Sequence finishes after ~8.8 seconds of realistic revs & idle settle
      // Fade out smoothly and trigger transition to Scene 2
      setTimeout(() => {
        if (!this.isPlaying) return;
        this.fadeAndStop(1200, onEngineSequenceComplete);
      }, 8800);
    }, 3200);
  }

  /**
   * Smoothly fades out audio and triggers completion callback
   */
  fadeAndStop(durationMs = 1200, onFadeDone = null) {
    if (!this.isPlaying && !this.engineAudio) {
      if (onFadeDone) onFadeDone();
      return;
    }

    if (this.engineAudio) {
      const startVol = this.engineAudio.volume;
      const startTime = performance.now();

      const fadeStep = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        if (this.engineAudio) {
          this.engineAudio.volume = Math.max(0, startVol * (1 - progress));
        }
        if (progress < 1) {
          requestAnimationFrame(fadeStep);
        } else {
          this.stop();
          if (this.engineAudio) this.engineAudio.volume = startVol;
          if (onFadeDone) onFadeDone();
        }
      };
      requestAnimationFrame(fadeStep);
    } else {
      this.stop();
      if (onFadeDone) onFadeDone();
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.starterAudio) {
      try {
        this.starterAudio.pause();
        this.starterAudio.currentTime = 0;
      } catch (e) {}
    }
    if (this.engineAudio) {
      try {
        this.engineAudio.pause();
        this.engineAudio.currentTime = 0;
      } catch (e) {}
    }
  }
}

export const engineAudio = new EngineAudio();
