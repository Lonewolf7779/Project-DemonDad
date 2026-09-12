import * as THREE from 'three';
import { CAR_CONFIG } from '../config/carConfig';
import { CarModelPlaceholder } from './placeholders/CarModelPlaceholder';

/**
 * HeadlightScene - Encapsulates the 3D cinematic lighting, sports car silhouette,
 * headlight crystal optics, volumetric light shafts, and road reflections.
 */
export class HeadlightScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    
    // Internal light targets and state
    this.drlMaterials = [];
    this.projectorMaterials = [];
    this.volumetricCones = [];
    this.spotLights = [];
    this.pointLights = [];
    this.accentMaterials = [];
    
    this.state = {
      drlIntensity: 0,
      arcIntensity: 0,
      projectorIntensity: 0,
      beamIntensity: 0,
      accentIntensity: 0,
    };

    this.initEnvironment();
    this.initCarChassis();
    this.initHeadlights();
  }

  initEnvironment() {
    // 1. Dark Atmospheric Fog
    this.scene.fog = new THREE.FogExp2(0x020306, 0.045);
    this.scene.background = new THREE.Color(0x020306);

    // 2. Faint Rim / Studio Silhouette Ambient Light
    this.ambientLight = new THREE.AmbientLight(0x101524, 0.25);
    this.scene.add(this.ambientLight);

    // 3. Top-Rear Silhouette Edge Light (Soft studio rim lighting)
    this.rimLight = new THREE.DirectionalLight(0x283b5b, 0.6);
    this.rimLight.position.set(0, 5, -6);
    this.scene.add(this.rimLight);

    // 4. Ground Reflection Plane (Wet dark performance studio asphalt)
    const groundGeo = new THREE.PlaneGeometry(30, 30, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: CAR_CONFIG.lighting.ground.color,
      roughness: CAR_CONFIG.lighting.ground.roughness,
      metalness: CAR_CONFIG.lighting.ground.metalness,
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.position.y = -0.68;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);
  }

  initCarChassis() {
    this.carPlaceholder = new CarModelPlaceholder();
    const carRoot = this.carPlaceholder.getRoot();
    this.scene.add(carRoot);
  }

  initHeadlights() {
    const headlightGroup = new THREE.Group();
    headlightGroup.name = 'HeadlightAssembly';

    // Positions for Left (-X) and Right (+X) headlight clusters
    const clusterPositions = [
      { x: -1.35, y: -0.05, z: 0.28, side: -1 },
      { x: 1.35, y: -0.05, z: 0.28, side: 1 },
    ];

    clusterPositions.forEach((pos, idx) => {
      // 1. Daytime Running Light (DRL) Blades - Angular aggressive geometry
      const drlMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(CAR_CONFIG.lighting.drl.color),
        transparent: true,
        opacity: 0.0,
      });
      this.drlMaterials.push(drlMat);

      // Upper DRL Blade (Sharply angled hockey stick / lightning bolt motif)
      const drlTopGeo = new THREE.BoxGeometry(0.75, 0.045, 0.08);
      const drlTopMesh = new THREE.Mesh(drlTopGeo, drlMat);
      drlTopMesh.position.set(pos.x, pos.y + 0.08, pos.z);
      drlTopMesh.rotation.z = pos.side * -0.18;
      drlTopMesh.rotation.y = pos.side * 0.12;
      headlightGroup.add(drlTopMesh);

      // Slanted Outer DRL Blade
      const drlSideGeo = new THREE.BoxGeometry(0.045, 0.18, 0.08);
      const drlSideMesh = new THREE.Mesh(drlSideGeo, drlMat);
      drlSideMesh.position.set(pos.x + (pos.side * 0.38), pos.y - 0.01, pos.z - 0.04);
      drlSideMesh.rotation.z = pos.side * 0.35;
      headlightGroup.add(drlSideMesh);

      // 2. Bi-Xenon / Laser Projector Lens (Dual crystal optics per side)
      [-0.15, 0.15].forEach((offset) => {
        const lensGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.06, 32);
        const lensMat = new THREE.MeshStandardMaterial({
          color: 0x010204,
          emissive: new THREE.Color(CAR_CONFIG.lighting.projector.color),
          emissiveIntensity: 0.0,
          roughness: 0.1,
          metalness: 0.9,
        });
        this.projectorMaterials.push(lensMat);

        const lensMesh = new THREE.Mesh(lensGeo, lensMat);
        lensMesh.rotation.x = Math.PI / 2;
        lensMesh.position.set(pos.x + offset, pos.y - 0.04, pos.z + 0.02);
        headlightGroup.add(lensMesh);

        // Surrounding Chrome Projector Bezel Ring
        const ringGeo = new THREE.TorusGeometry(0.085, 0.012, 16, 32);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x222630,
          metalness: 0.95,
          roughness: 0.1,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(pos.x + offset, pos.y - 0.04, pos.z + 0.05);
        headlightGroup.add(ringMesh);
      });

      // 3. Three.js SpotLight for road illumination and shadow casting
      const spotLight = new THREE.SpotLight(
        CAR_CONFIG.lighting.projector.color,
        0, // initially 0
        25, // distance
        Math.PI / 4.8, // angle
        0.55, // penumbra
        1.2 // decay
      );
      spotLight.position.set(pos.x, pos.y, pos.z);
      
      const targetObject = new THREE.Object3D();
      targetObject.position.set(pos.x * 0.4, -0.65, 8.0);
      this.scene.add(targetObject);
      spotLight.target = targetObject;
      spotLight.castShadow = true;
      spotLight.shadow.bias = -0.001;
      headlightGroup.add(spotLight);
      this.spotLights.push(spotLight);

      // 4. PointLight at headlight cluster (casts specular glow on car hood and road)
      const pointLight = new THREE.PointLight(
        CAR_CONFIG.lighting.drl.color,
        0,
        5.0,
        1.5
      );
      pointLight.position.set(pos.x, pos.y, pos.z + 0.2);
      headlightGroup.add(pointLight);
      this.pointLights.push(pointLight);

      // 5. Volumetric Light Cone (Atmospheric light shaft cutting through darkness)
      const coneLength = 12.0;
      const coneRadius = 2.4;
      const coneGeo = new THREE.ConeGeometry(coneRadius, coneLength, 32, 1, true);
      // Shift cone origin to tip
      coneGeo.translate(0, -coneLength / 2, 0);
      coneGeo.rotateX(Math.PI / 2);

      const coneMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(CAR_CONFIG.lighting.projector.beamColor),
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      this.volumetricCones.push(coneMat);

      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.set(pos.x, pos.y, pos.z);
      coneMesh.rotation.y = pos.side * 0.04;
      coneMesh.rotation.x = 0.02;
      headlightGroup.add(coneMesh);
    });

    // 6. Demon Red Intake Backlight (Aggressive secondary accent)
    const accentMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(CAR_CONFIG.lighting.accent.color),
      transparent: true,
      opacity: 0.0,
    });
    this.accentMaterials.push(accentMat);

    const intakeGlowGeo = new THREE.PlaneGeometry(2.0, 0.18);
    const intakeGlowMesh = new THREE.Mesh(intakeGlowGeo, accentMat);
    intakeGlowMesh.position.set(0, -0.42, 0.18);
    headlightGroup.add(intakeGlowMesh);

    this.scene.add(headlightGroup);
  }

  /**
   * Applies real-time intensity values from the Anime.js animation driver
   */
  setHeadlightState(values) {
    this.state = { ...this.state, ...values };

    const { drlIntensity, arcIntensity, projectorIntensity, beamIntensity, accentIntensity } = this.state;

    // 1. Update DRL blades
    this.drlMaterials.forEach((mat) => {
      mat.opacity = Math.min(1.0, drlIntensity * 0.95);
    });

    // 2. Update Projector Lenses (emissive core glow)
    const totalCoreIntensity = (arcIntensity * 2.5) + (projectorIntensity * CAR_CONFIG.lighting.projector.targetIntensity);
    this.projectorMaterials.forEach((mat) => {
      mat.emissiveIntensity = totalCoreIntensity;
      if (arcIntensity > 0.4) {
        // Shift color towards electrical high-voltage arc during strike
        mat.emissive.setHex(CAR_CONFIG.lighting.arcFlash.color);
      } else {
        mat.emissive.setHex(CAR_CONFIG.lighting.projector.color);
      }
    });

    // 3. Update SpotLights
    this.spotLights.forEach((spot) => {
      spot.intensity = (arcIntensity * 12.0) + (projectorIntensity * 28.0);
    });

    // 4. Update Cluster PointLights
    this.pointLights.forEach((point) => {
      point.intensity = (drlIntensity * 2.5) + (arcIntensity * 8.0) + (projectorIntensity * 14.0);
    });

    // 5. Update Volumetric Light Beams
    this.volumetricCones.forEach((coneMat) => {
      coneMat.opacity = beamIntensity * 0.18;
    });

    // 6. Update Demon Red Accent
    this.accentMaterials.forEach((mat) => {
      mat.opacity = accentIntensity * 0.75;
    });
  }

  /**
   * Per-frame render loop update for subtle living idle pulses
   */
  update(elapsedTime) {
    if (this.state.projectorIntensity > 0.8) {
      // Subtle machine breathing variation (+/- 1.5%)
      const pulse = Math.sin(elapsedTime * 3.5) * 0.015;
      this.volumetricCones.forEach((coneMat) => {
        coneMat.opacity = THREE.MathUtils.clamp((this.state.beamIntensity + pulse) * 0.18, 0, 0.25);
      });
    }
  }
}
