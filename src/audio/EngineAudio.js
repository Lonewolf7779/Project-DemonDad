import { INTRO_CONFIG } from '../config/introConfig';

/**
 * EngineAudio - Web Audio player for authentic V12 sports-car engine startup recording
 */
class EngineAudio {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.initAudio();
  }

  initAudio() {
    if (typeof window === 'undefined') return;
    try {
      this.audio = new Audio(INTRO_CONFIG.audio.v12Engine);
      this.audio.preload = 'auto';
      this.audio.volume = 1.0;
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
      });
    } catch (e) {
      console.warn('Audio init warning:', e);
    }
  }

  playV12Startup() {
    if (!this.audio) {
      this.initAudio();
    }
    if (!this.audio) return Promise.resolve();

    this.audio.currentTime = 0;
    this.isPlaying = true;

    return this.audio.play().catch((err) => {
      console.warn('Audio playback error:', err);
      this.isPlaying = false;
    });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }
}

export const engineAudio = new EngineAudio();
