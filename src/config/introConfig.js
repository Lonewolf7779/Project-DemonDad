/**
 * Project DEMONDAD - Intro Dialogue & Cinematic Timing Configuration
 * 
 * Central configuration for opening dialogue, timings, 2.5x scaled Urbanist
 * typography layout, and ignition sequence timings.
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

  // Typography Layout & Positioning (Hard Requirement: Urbanist, 2.5x Scale, Mid-Left Anchor)
  typography: {
    fontFamily: "'Urbanist', sans-serif",
    horizontalPosition: '14%', // Mid-left compositional anchor
    verticalPosition: '48%',   // Vertically centered
    color: '#ffffff',
    fontSize: 'clamp(3.6rem, 7.2vw, 6.2rem)', // ~2.5x larger than standard text
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.035em',
    maxWidth: '850px',
  },

  // Audio assets (Authentic starter crank, V12 roar, and continuous running idle)
  audio: {
    starterCrank: '/audio/starter-crank.mp3',
    v12Startup: '/audio/v12-f12-startup.mp3',
    v12Idle: '/audio/v12-f12-startup.mp3',
  },

  // 3D Model assets
  models: {
    sportsCar: '/models/sports-car.glb',
  }
};
