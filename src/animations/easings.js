/**
 * Custom Automotive & Electrical Easing Curves for Project DEMONDAD
 */

export const EASINGS = {
  // Rapid electrical spark / arc ignition curve
  electricStrike: 'cubicBezier(0.1, 0.9, 0.2, 1.0)',
  
  // High-voltage capacitor charge curve
  ballastRamp: 'cubicBezier(0.25, 0.1, 0.25, 1.0)',
  
  // Laser projector smooth lock
  projectorLock: 'cubicBezier(0.16, 1.0, 0.3, 1.0)',
  
  // Power-off rapid decay
  powerOffDecay: 'cubicBezier(0.4, 0.0, 1.0, 1.0)',
};
