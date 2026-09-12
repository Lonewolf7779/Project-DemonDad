/**
 * Project DEMONDAD - Vehicle & Lighting Configuration
 * 
 * Central configuration parameters for vehicle lighting, color temperatures,
 * lumens, and startup timings. Easily tweakable for different car models or trims.
 */

export const CAR_CONFIG = {
  // Vehicle Identity
  id: 'demon-gt1',
  name: 'DEMON DAD // PROTO-01',
  trim: 'TRACK PURSUIT / XENON-LASER SPEC',
  
  // Lighting Color Profiles (Hex & Three.js compatible)
  lighting: {
    // Stage 1: DRL (Daytime Running Light) Blades
    drl: {
      color: 0x90e0ef,        // Cyan-white ice blade
      cssColor: '#90e0ef',
      targetIntensity: 3.2,   // Multiplier for bloom / emission
    },
    
    // Stage 2: Electrical Arc Flash (Ballast Strike)
    arcFlash: {
      color: 0x48cae4,        // High-voltage blue-violet strike
      cssColor: '#48cae4',
      peakIntensity: 8.5,
    },
    
    // Stage 3 & Steady: Bi-Xenon / Laser Projector Core
    projector: {
      color: 0xfafafa,        // Pure 6000K crisp white beam
      cssColor: '#fafafa',
      targetIntensity: 6.0,
      volumetricConeIntensity: 2.2,
      beamColor: 0xa0c4ff,
    },
    
    // Accent / Demon Red secondary glow
    accent: {
      color: 0xff0055,        // Demon crimson intake glow
      cssColor: '#ff0055',
      targetIntensity: 1.8,
    },
    
    // Ambient Ground Reflector
    ground: {
      color: 0x050811,
      roughness: 0.18,
      metalness: 0.85,
    }
  },

  // Timing constants (in milliseconds)
  timings: {
    standbyDelay: 250,
    drlAwaken: 600,
    arcStrike: 900,
    projectorIgnition: 1800,
    fullStabilization: 2600,
  },
  
  // Audio parameters for procedural synthesis
  audio: {
    relayPitch: 840,
    ballastHumBaseFreq: 110,
    ignitionBurstFreq: 420,
    masterVolume: 0.28,
  }
};
