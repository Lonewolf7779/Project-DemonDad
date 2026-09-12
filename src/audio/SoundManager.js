import { CAR_CONFIG } from '../config/carConfig';

/**
 * SoundManager - Procedural Web Audio API sound generator for DEMONDAD
 * 
 * Synthesizes authentic automotive electrical ignition sounds without requiring
 * large external audio asset downloads. Fully respects browser audio autoplay policies.
 */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default muted to ensure seamless autoplay compliance
    this.humGain = null;
    this.humOsc = null;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
    } else if (this.humGain) {
      this.humGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Plays a sharp mechanical electrical relay click
   */
  playRelayClick(timeOffset = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime + timeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(CAR_CONFIG.audio.relayPitch, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(CAR_CONFIG.audio.masterVolume * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {
      // Audio context might be restricted
    }
  }

  /**
   * Plays a high-voltage xenon ignition arc crackle
   */
  playArcStrike(timeOffset = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime + timeOffset;
      // White noise buffer for arc spark
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(CAR_CONFIG.audio.masterVolume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.085);
    } catch (e) {
      // Audio fallback safe
    }
  }

  /**
   * Plays the deep laser/projector power-on boom and starts subtle background hum
   */
  playProjectorIgnition(timeOffset = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime + timeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(CAR_CONFIG.audio.ignitionBurstFreq, now);
      osc.frequency.exponentialRampToValueAtTime(CAR_CONFIG.audio.ballastHumBaseFreq, now + 0.35);

      gain.gain.setValueAtTime(CAR_CONFIG.audio.masterVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(CAR_CONFIG.audio.masterVolume * 0.06, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);

      // Start continuous low hum
      this.startSteadyHum();
    } catch (e) {
      // Audio fallback safe
    }
  }

  startSteadyHum() {
    if (this.isMuted || !this.ctx || this.humOsc) return;
    try {
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();

      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(60, this.ctx.currentTime); // 60Hz clean power hum

      this.humGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.humGain.gain.linearRampToValueAtTime(CAR_CONFIG.audio.masterVolume * 0.05, this.ctx.currentTime + 1.0);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);

      this.humOsc.start();
    } catch (e) {
      // Audio fallback safe
    }
  }

  stopAll() {
    if (this.humOsc) {
      try {
        this.humOsc.stop();
        this.humOsc.disconnect();
      } catch (e) {}
      this.humOsc = null;
      this.humGain = null;
    }
  }
}

export const soundManager = new SoundManager();
