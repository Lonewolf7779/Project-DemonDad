# PROJECT DEMONDAD

> **The Machine Awakes** — A cinematic, luxury sports-car showcase web experience.

---

## 1. Project Overview

**DEMONDAD** is NOT a traditional static car catalog. It is an immersive, game-like automotive showcase built around dynamic cinematic staging, realistic lighting, and machine power-up experiences.

### Milestone 1: Headlight Startup Experience
This initial milestone delivers the opening visual sequence:
* Atmospheric, dark studio environment framing an aggressive sports-car front fascia.
* Multi-stage electrical headlight startup powered by **Anime.js v4**:
  1. **Standby**: Deep darkness with silhouette edge lighting.
  2. **DRL Blade Awakening**: Crisp voltage pulse into angular LED running lights with mechanical relay feedback.
  3. **High-Voltage Arc Strike**: Micro-flickering xenon ballast discharge sparks.
  4. **Laser Projector Lock**: Deep ignition thud and volumetric beam expansion cutting through the fog.
  5. **Online & Breathing**: Steady 6000K illumination with subtle living pulse.
* Zero-dependency procedural **Web Audio API** synthesizer for realistic electrical ignition sound effects.
* Full **Accessibility (`prefers-reduced-motion`)** support.

---

## 2. Tech Stack

* **React 18**: UI component tree, lifecycle coordination, state management.
* **Vite 6**: Ultra-fast build tool and development server.
* **Three.js**: WebGL 3D rendering pipeline, ACES Filmic Tone Mapping, PBR materials, spot/point lighting, and volumetric light shafts.
* **Anime.js v4**: Complex timeline animation orchestrator controlling multi-channel light intensities and voltage surges.
* **Web Audio API**: Real-time procedural audio synthesis for ignition relays, ballast whine, and projector thuds.
* **CSS**: Clean custom styling with film scanlines, vignettes, and telemetry HUD overlays.

---

## 3. Directory Architecture & Future Extension Guide

The codebase is organized for modular scalability:

```
DemonDAD/
├── index.html                      # HTML entry with font preconnections
├── vite.config.js                  # Vite configuration
├── package.json                    # Project dependencies (all project-local)
├── README.md                       # Project manual & onboarding guide
├── public/
│   ├── favicon.svg                 # Brand mark icon
│   └── models/                     # [FUTURE] Place GLTF/GLB 3D car models here
└── src/
    ├── main.jsx                    # Application bootstrap
    ├── App.jsx                     # Root coordinator & state manager
    │
    ├── animations/                 # Anime.js timelines & easing curves
    │   ├── headlightSequence.js    # Multi-stage electrical startup timeline
    │   └── easings.js              # Custom automotive easing bezier curves
    │
    ├── audio/                      # Audio engines & synthesizers
    │   └── SoundManager.js         # Web Audio API procedural ignition engine
    │
    ├── components/
    │   ├── canvas/
    │   │   └── ExperienceCanvas.jsx # Three.js WebGL canvas wrapper & lifecycle
    │   ├── ui/
    │   │   ├── BrandHeader.jsx     # Header branding & live status badge
    │   │   ├── TelemetryHUD.jsx    # Real-time power/lumen telemetry card
    │   │   └── Controls.jsx        # Re-ignite, audio, and motion controls
    │   └── common/
    │       └── CinematicOverlay.jsx# Vignette, scanlines, and flare pulses
    │
    ├── config/
    │   └── carConfig.js            # Vehicle parameters, colors, lumens, timings
    │
    ├── scenes/
    │   ├── HeadlightScene.js       # Three.js scene (lighting, optics, beams)
    │   └── placeholders/
    │       └── CarModelPlaceholder.js # Dedicated hook for future 3D car model
    │
    ├── styles/
    │   ├── index.css               # Reset styles, variables, typography
    │   └── cinematic.css           # HUD, overlays, and responsive styling
    │
    └── utils/
        ├── motion.js               # Accessibility & reduced motion utilities
        └── threeHelpers.js         # Tone mapping, renderer setup, cleanup helpers
```

---

## 4. Guide for Future Developers & AI Agents

### How to Add the Real 3D Sports-Car Model (Milestone 2)
1. Place your model in `public/models/demon-gt1.glb`.
2. Open [`src/scenes/placeholders/CarModelPlaceholder.js`](src/scenes/placeholders/CarModelPlaceholder.js).
3. Import `GLTFLoader` and use the built-in `attachLoadedModel(gltf.scene)` method.
4. The lighting rigs and animation targets in [`src/scenes/HeadlightScene.js`](src/scenes/HeadlightScene.js) will automatically light up your imported car model.

### How to Add Audio Tracks
1. Procedural sound synthesis is managed in [`src/audio/SoundManager.js`](src/audio/SoundManager.js).
2. For custom recorded engine audio (`.mp3`/`.wav`/`.ogg`), place files in `public/audio/` and instantiate Web Audio buffers inside `SoundManager.js`.

### How to Add Camera Choreography / Scroll Animations
1. Use `ExperienceCanvas.jsx` to bind camera position / lookAt targets to Anime.js timelines or scroll listeners.
2. Maintain the isolated rendering pipeline in `ExperienceCanvas.jsx`.

---

## 5. Getting Started

### Prerequisites
* **Node.js**: v18.0+ or v20.0+
* **npm**: v9.0+

> **Company Laptop Safe**: No global packages or administrator privileges are required.

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/Lonewolf7779/Project-DemonDad.git
cd DemonDAD

# 2. Install dependencies locally
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 6. Verification & Quality Standards

* **No Memory Leaks**: All Three.js geometries, materials, and Anime.js timelines are cleanly disposed on unmount.
* **Performance**: Pixel ratio clamped at `2.0`, tone-mapped with ACES Filmic, lightweight geometry buffers.
* **Accessibility**: Respects OS `prefers-reduced-motion` preferences.
