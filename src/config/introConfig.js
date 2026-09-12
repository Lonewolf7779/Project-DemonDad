/**
 * Project DEMONDAD - Intro Dialogue & Cinematic Timing Configuration
 * 
 * Central configuration for opening dialogue, timings, typography positioning,
 * and headlight startup parameters.
 */

export const INTRO_CONFIG = {
  // Opening dialogue sequence lines & pauses
  dialogue: [
    {
      id: 'line-1',
      speaker: 'Kid',
      text: 'Dad, Dad!!',
      duration: 3000,   // Stays visible for ~3 seconds
      pauseAfter: 2000, // Exactly 2 seconds pure black silence (Hard Requirement)
    },
    {
      id: 'line-2',
      speaker: 'Father',
      text: 'Yes, son?',
      duration: 2600,
      pauseAfter: 1500,
    },
    {
      id: 'line-3',
      speaker: 'Kid',
      text: 'Do machines have a soul?',
      duration: 3200,
      pauseAfter: 1600,
    },
    {
      id: 'line-4',
      speaker: 'Father',
      text: 'Shhhhh...',
      duration: 2400,
      pauseAfter: 1500,
    },
    {
      id: 'line-5',
      speaker: 'Father, whispering',
      text: 'Listen... closely.',
      duration: 3000,
      pauseAfter: 1800, // Silence before car reveal
    },
  ],

  // Typography Layout & Positioning (Hard Requirement: Urbanist, 40% from left, vertically centered)
  typography: {
    fontFamily: "'Urbanist', sans-serif",
    horizontalPosition: '40%', // Approximately 40% from the left
    verticalPosition: '50%',   // Approximately vertically centered
    color: '#ffffff',
    fontSize: 'clamp(2.4rem, 4.8vw, 4.0rem)',
    fontWeight: 600,
    lineHeight: 1.18,
    letterSpacing: '-0.025em',
    maxWidth: '600px',
  },

  // Headlight Startup Stage Timings (in milliseconds after car reveal)
  headlightSequence: {
    revealFadeIn: 1500,     // Studio car fades in from darkness
    awakeningDelay: 500,    // Stage 1: Subtle awakening
    blink1Duration: 180,    // Stage 2: First blink
    pause1: 450,            // Stage 3: Short pause
    blink2Duration: 240,    // Stage 4: Second controlled blink
    pause2: 250,
    fullPowerDuration: 650, // Stage 5: Headlights power fully ON
  },

  // Audio assets
  audio: {
    v12Engine: '/audio/v12-engine-startup.mp3',
  },

  // 3D Model assets
  models: {
    sportsCar: '/models/sports-car.glb',
  }
};
