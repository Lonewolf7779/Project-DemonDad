# PROJECT DEMONDAD

> **The Machine Awakes** — A cinematic luxury sports-car experience.

---

## 1. Project Overview

**DEMONDAD** is a story-first, cinematic automotive showcase.

### The First Experience
1. **Black Screen Opening**:
   The website opens into silence and cinematic dialogue using **Urbanist** typography positioned 40% from the left:
   - *"Dad, Dad!!"* (3 seconds)
   - *2 seconds of pure black silence*
   - *"Yes, son?"*
   - *"Do machines have a soul?"*
   - *"Shhhhh..."*
   - *"Listen... closely."*
2. **Dark Studio Car Reveal**:
   The darkness parts to reveal a real 3D sports car in a moody dark automotive studio with soft top lighting and ground reflections.
3. **Headlight Startup**:
   The sports-car headlights undergo a multi-stage electrical startup (awakening -> blink 1 -> pause -> blink 2 -> fully illuminated 6000K beam).
4. **Single Interactive Button**:
   Exactly **ONE** button appears: **START ENGINE**.
5. **Authentic V12 Startup**:
   Clicking **START ENGINE** fires an authentic sports-car V12 starter crank and roaring combustion idle.

---

## 2. Tech Stack

* **React 18**: View tree, story state coordination, and lifecycle management.
* **Three.js**: Real 3D sports-car rendering (`sports-car.glb`), ACES Filmic Tone Mapping, PBR automotive paint, glass optics, and volumetric lighting.
* **Anime.js v4**: Centralized timeline orchestrator managing dialogue, pauses, studio transitions, and headlight blinks.
* **Web Audio API / HTML5 Audio**: Playback of genuine V12 engine startup audio (`v12-engine-startup.mp3`).
* **Urbanist Font**: Hard requirement typography from Google Fonts.

---

## 3. Directory Structure

```
DemonDAD/
├── index.html                               # Urbanist font import & meta
├── vite.config.js                           # Bundler configuration
├── package.json                             # Local dependencies
├── README.md                                # Project documentation
├── public/
│   ├── favicon.svg                          # Minimal brand icon
│   ├── models/
│   │   └── sports-car.glb                   # Real 3D sports car model (1.68 MB)
│   └── audio/
│       └── v12-engine-startup.mp3           # Authentic V12 engine startup audio
└── src/
    ├── main.jsx                             # Application bootstrap
    ├── App.jsx                              # Story coordinator & state manager
    ├── config/
    │   └── introConfig.js                   # Dialogue lines, timings, & typography config
    ├── animations/
    │   └── introSequence.js                 # Centralized Anime.js v4 intro timeline
    ├── audio/
    │   └── EngineAudio.js                   # V12 engine audio player
    ├── scenes/
    │   └── StudioCarScene.js                # Three.js studio environment, 3D car, & headlight rigs
    ├── components/
    │   ├── DialogueOverlay.jsx              # Urbanist typography positioned at 40% left
    │   ├── StudioCanvas.jsx                 # Three.js WebGL canvas & render loop
    │   └── StartEngineButton.jsx            # Exactly ONE "START ENGINE" button
    ├── styles/
    │   ├── index.css                        # Reset styles, black background
    │   └── intro.css                        # Dialogue typography & button styling
    └── utils/
        ├── motion.js                        # prefers-reduced-motion detector
        └── threeHelpers.js                  # ACES Filmic tone mapping & scene disposal
```

---

## 4. Running the Project

```bash
# Install local dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

---

## 5. Assets & Licenses

* **3D Model**: `sports-car.glb` sourced from Three.js official examples (MIT License).
* **V12 Engine Audio**: `v12-engine-startup.mp3` sourced from open automotive sound archives.
