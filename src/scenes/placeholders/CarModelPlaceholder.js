import * as THREE from 'three';

/**
 * =========================================================================
 * FUTURE 3D CAR MODEL INTEGRATION POINT (MILESTONE 2+)
 * =========================================================================
 * 
 * Future AI agents and developers:
 * When adding the full 3D sports-car model (GLTF / GLB):
 * 
 * 1. Place the 3D model file in `public/models/demon-gt1.glb`
 * 2. Use GLTFLoader to load the car hierarchy.
 * 3. Replace the procedural body geometry inside `CarModelPlaceholder` with
 *    the loaded mesh hierarchy, or call `this.attachLoadedModel(gltf.scene)`.
 * 4. Ensure headlight lens meshes in the model match the material names or
 *    tags used in `HeadlightScene.js`.
 * =========================================================================
 */
export class CarModelPlaceholder {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'CarModelRoot';
    this.isPlaceholder = true;

    this.initProceduralChassis();
  }

  initProceduralChassis() {
    // Premium matte-carbon sports car body material
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x080a0f,
      roughness: 0.35,
      metalness: 0.85,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

    const carbonAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x030406,
      roughness: 0.6,
      metalness: 0.9,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x020204,
      roughness: 0.2,
      metalness: 0.95,
    });

    // 1. Hood / Front Power Bulge (Aggressive low-slung silhouette)
    const hoodGeometry = new THREE.BufferGeometry();
    // Create an aerodynamic sculpted hood surface
    const hoodWidth = 3.6;
    const hoodLength = 3.0;
    const hoodMesh = new THREE.Mesh(
      new THREE.BoxGeometry(hoodWidth, 0.12, hoodLength),
      bodyMaterial
    );
    hoodMesh.position.set(0, 0.1, -1.2);
    hoodMesh.rotation.x = 0.04;
    hoodMesh.receiveShadow = true;
    hoodMesh.castShadow = true;
    this.group.add(hoodMesh);

    // 2. Central Hood Ridge / Crease
    const ridgeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.08, hoodLength * 0.9, 16),
      carbonAccentMaterial
    );
    ridgeMesh.rotation.x = Math.PI / 2 + 0.04;
    ridgeMesh.position.set(0, 0.18, -1.2);
    this.group.add(ridgeMesh);

    // 3. Front Bumper / Splitter Lip (Track pursuit aero)
    const splitter = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.06, 0.6),
      carbonAccentMaterial
    );
    splitter.position.set(0, -0.65, 0.25);
    splitter.castShadow = true;
    this.group.add(splitter);

    // Splitter Endplates (Left & Right aero winglets)
    [-1.98, 1.98].forEach((xPos) => {
      const winglet = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.22, 0.4),
        carbonAccentMaterial
      );
      winglet.position.set(xPos, -0.58, 0.25);
      this.group.add(winglet);
    });

    // 4. Lower Grille / Intake Mesh (Dark hexagonal stealth bay)
    const intake = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.42, 0.3),
      darkTrimMaterial
    );
    intake.position.set(0, -0.42, 0.1);
    this.group.add(intake);

    // 5. Left & Right Headlight Housing Enclosures (Sculpted recessed aerodynamic pods)
    [-1.38, 1.38].forEach((xPos, idx) => {
      const housing = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.32, 0.5),
        darkTrimMaterial
      );
      housing.position.set(xPos, -0.05, 0.12);
      // Slight inward sweep angle matching supercar front-end geometry
      housing.rotation.y = idx === 0 ? -0.15 : 0.15;
      this.group.add(housing);

      // Fender muscle shoulder
      const fender = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.45, 2.4),
        bodyMaterial
      );
      fender.position.set(idx === 0 ? -1.82 : 1.82, 0.02, -0.9);
      fender.rotation.z = idx === 0 ? 0.08 : -0.08;
      fender.castShadow = true;
      this.group.add(fender);
    });
  }

  /**
   * Future helper to swap placeholder with actual GLTF model
   */
  attachLoadedModel(loadedScene) {
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.group.add(loadedScene);
    this.isPlaceholder = false;
  }

  getRoot() {
    return this.group;
  }
}
