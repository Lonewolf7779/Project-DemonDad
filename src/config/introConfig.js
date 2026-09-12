/**
 * Project DEMONDAD - Intro Dialogue & Cinematic Timing Configuration
 * 
 * Central configuration for opening dialogue, timings, 2.5x scaled Urbanist
 * typography layout, and ignition sequence timings.
 */

export const INTRO_CONFIG = {
  // Opening dialogue sequence lines & pauses (tightened by 1.5s for natural conversation flow)
  dialogue: [
    {
      id: 'line-1',
      speaker: 'Kid',
      text: 'Dad, Dad!!',
      duration: 2200,   // Reduced from 3000ms
      pauseAfter: 1500, // Reduced from 2000ms
    },
    {
      id: 'line-2',
      speaker: 'Father',
      text: 'Yes, son?',
      duration: 1800,   // Reduced from 2600ms
      pauseAfter: 1000, // Reduced from 1500ms
    },
    {
      id: 'line-3',
      speaker: 'Kid',
      text: 'Do machines have a soul?',
      duration: 2200,   // Reduced from 3200ms
      pauseAfter: 1000, // Reduced from 1600ms
    },
    {
      id: 'line-4',
      speaker: 'Father',
      text: 'Shhhhh...',
      duration: 1600,   // Reduced from 2400ms
      pauseAfter: 1000, // Reduced from 1500ms
    },
    {
      id: 'line-5',
      speaker: 'Father, whispering',
      text: 'Listen... closely.',
      duration: 2000,   // Reduced from 3000ms
      pauseAfter: 1200, // Reduced from 1800ms
    },
  ],

  // Typography Layout & Positioning (Hard Requirement: Urbanist, ~2x Larger Scale, Mid-Left Anchor)
  typography: {
    fontFamily: "'Urbanist', sans-serif",
    horizontalPosition: '10%', // Compositional mid-left anchor
    verticalPosition: '48%',   // Vertically centered
    color: '#ffffff',
    fontSize: 'clamp(5.8rem, 11.5vw, 9.8rem)', // ~2x larger scale
    fontWeight: 800,
    lineHeight: 0.98,
    letterSpacing: '-0.04em',
    maxWidth: '1300px',
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
