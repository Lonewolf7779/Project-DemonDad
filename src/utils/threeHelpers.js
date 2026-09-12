import * as THREE from 'three';

/**
 * Creates and configures a high-performance WebGL renderer tailored for
 * dark automotive cinematic visuals.
 */
export function createCinematicRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  });

  // Clamp pixel ratio between 1 and 2 to protect low-end GPUs
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  
  // Cinematic ACES Filmic Tone Mapping for realistic light bloom and high-dynamic-range feel
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  
  // Enable shadows for future car geometry
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  return renderer;
}

/**
 * Recursively disposes all geometries, materials, and textures in a Three.js Object3D hierarchy
 */
export function disposeSceneGraph(rootObject) {
  if (!rootObject) return;

  rootObject.traverse((node) => {
    if (node.geometry) {
      node.geometry.dispose();
    }
    if (node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach((mat) => disposeMaterial(mat));
      } else {
        disposeMaterial(node.material);
      }
    }
  });
}

function disposeMaterial(material) {
  if (!material) return;
  // Dispose all potential texture maps
  const textureKeys = [
    'map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap',
    'envMap', 'alphaMap', 'aoMap', 'displacementMap', 'emissiveMap',
    'roughnessMap', 'metalnessMap', 'clearcoatMap', 'transmissionMap'
  ];
  for (const key of textureKeys) {
    if (material[key] && typeof material[key].dispose === 'function') {
      material[key].dispose();
    }
  }
  material.dispose();
}
