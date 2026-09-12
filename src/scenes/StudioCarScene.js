import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { INTRO_CONFIG } from '../config/introConfig';

/**
 * StudioCarScene - Realistic dark automotive studio with Three.js
 */
export class StudioCarScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.carModel = null;
    
    this.headlightMaterials = [];
    this.spotLights = [];
    this.pointLights = [];
    this.lightShafts = [];
    
    this.headlightIntensity = 0;
    this.isCarLoaded = false;
    this.vibrationAmount = 0;
    this.baseCarY = 0;

    this.initEnvironment();
    this.createHeadlightRigs();
    this.loadCarModel();
  }

  initEnvironment() {
    // 1. Pure dark studio fog
    this.scene.fog = new THREE.FogExp2(0x010204, 0.045);
    this.scene.background = new THREE.Color(0x010204);

    // 2. Dark Glossy Reflective Studio Floor
    const floorGeo = new THREE.PlaneGeometry(45, 45, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x040507,
      roughness: 0.2,
      metalness: 0.88,
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -0.005;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // 3. Studio Lighting (Soft overhead + rim lighting)
    this.overheadLight = new THREE.DirectionalLight(0xf1f5f9, 0.5);
    this.overheadLight.position.set(0, 7.5, -0.5);
    this.overheadLight.castShadow = true;
    this.overheadLight.shadow.mapSize.width = 2048;
    this.overheadLight.shadow.mapSize.height = 2048;
    this.overheadLight.shadow.bias = -0.0005;
    this.scene.add(this.overheadLight);

    // Rear / Rim Edge Light
    this.rimLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    this.rimLight.position.set(0, 4.0, -6.5);
    this.scene.add(this.rimLight);

    // Soft Ambient Fill
    this.ambientLight = new THREE.AmbientLight(0x090d16, 0.35);
    this.scene.add(this.ambientLight);
  }

  createHeadlightRigs() {
    const lightPositions = [
      { x: -0.68, y: 0.58, z: 1.85, side: -1 },
      { x: 0.68, y: 0.58, z: 1.85, side: 1 },
    ];

    lightPositions.forEach((pos) => {
      // Forward SpotLight
      const spot = new THREE.SpotLight(0xf8fafc, 0, 32, Math.PI / 5.0, 0.45, 1.3);
      spot.position.set(pos.x, pos.y, pos.z);
      
      const target = new THREE.Object3D();
      target.position.set(pos.x * 0.45, 0, pos.z + 8.5);
      this.scene.add(target);
      spot.target = target;
      spot.castShadow = true;
      spot.shadow.bias = -0.001;
      this.scene.add(spot);
      this.spotLights.push(spot);

      // PointLight at lens core
      const point = new THREE.PointLight(0xe0f2fe, 0, 4.8, 1.8);
      point.position.set(pos.x, pos.y, pos.z + 0.15);
      this.scene.add(point);
      this.pointLights.push(point);

      // Volumetric Light Cone
      const coneLength = 11.0;
      const coneRadius = 2.0;
      const coneGeo = new THREE.ConeGeometry(coneRadius, coneLength, 32, 1, true);
      coneGeo.translate(0, -coneLength / 2, 0);
      coneGeo.rotateX(Math.PI / 2);

      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xcfe2ff,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      this.lightShafts.push(coneMat);

      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.set(pos.x, pos.y, pos.z);
      coneMesh.rotation.y = pos.side * 0.04;
      this.scene.add(coneMesh);
    });
  }

  loadCarModel() {
    const loader = new GLTFLoader();
    loader.load(
      INTRO_CONFIG.models.sportsCar,
      (gltf) => {
        this.carModel = gltf.scene;
        this.carModel.name = 'SportsCarModel';

        // Center car model on ground
        this.carModel.position.set(0, 0, 0);
        this.carModel.rotation.y = Math.PI; // Face camera
        this.baseCarY = this.carModel.position.y;

        // Enhance automotive materials
        this.carModel.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;

            const matName = node.material ? node.material.name : '';

            // Deep luxury metallic sports-car body paint
            if (matName === 'Body_Color' || node.name.includes('body')) {
              node.material = new THREE.MeshStandardMaterial({
                color: 0x08090d,
                roughness: 0.18,
                metalness: 0.92,
                clearcoat: 1.0,
                clearcoatRoughness: 0.08,
              });
            }

            // Headlight Projector Glass & LED
            if (
              matName.includes('Projector') ||
              matName.includes('Turn_Signal') ||
              node.name.includes('light') ||
              node.name.includes('led')
            ) {
              const emissiveMat = new THREE.MeshStandardMaterial({
                color: 0x111622,
                emissive: new THREE.Color(0xf0f9ff),
                emissiveIntensity: 0.0,
                roughness: 0.1,
                metalness: 0.95,
              });
              node.material = emissiveMat;
              this.headlightMaterials.push(emissiveMat);
            }

            // Tinted glass
            if (matName.includes('Glass') || node.name.includes('glass')) {
              node.material = new THREE.MeshPhysicalMaterial({
                color: 0x050811,
                roughness: 0.05,
                metalness: 0.1,
                transmission: 0.75,
                transparent: true,
                opacity: 0.85,
              });
            }

            // Carbon fiber trim
            if (matName.includes('Carbon') || node.name.includes('carbon')) {
              node.material = new THREE.MeshStandardMaterial({
                color: 0x0a0a0c,
                roughness: 0.45,
                metalness: 0.8,
              });
            }
          }
        });

        this.scene.add(this.carModel);
        this.isCarLoaded = true;
      },
      undefined,
      (error) => {
        console.error('Error loading sports-car GLB model:', error);
      }
    );
  }

  setHeadlightIntensity(intensity) {
    this.headlightIntensity = THREE.MathUtils.clamp(intensity, 0, 1);

    this.headlightMaterials.forEach((mat) => {
      mat.emissiveIntensity = this.headlightIntensity * 6.5;
    });

    this.spotLights.forEach((spot) => {
      spot.intensity = this.headlightIntensity * 32.0;
    });

    this.pointLights.forEach((point) => {
      point.intensity = this.headlightIntensity * 12.0;
    });

    this.lightShafts.forEach((mat) => {
      mat.opacity = this.headlightIntensity * 0.22;
    });
  }

  setVibration(amount) {
    this.vibrationAmount = amount;
  }

  update(elapsed) {
    if (this.carModel && this.vibrationAmount > 0) {
      const shakeY = Math.sin(elapsed * 65.0) * (this.vibrationAmount * 0.0035);
      const shakeRot = Math.cos(elapsed * 55.0) * (this.vibrationAmount * 0.0012);
      this.carModel.position.y = this.baseCarY + shakeY;
      this.carModel.rotation.z = shakeRot;
    }

    if (this.headlightIntensity > 0.9) {
      const pulse = Math.sin(elapsed * 3.0) * 0.018;
      this.lightShafts.forEach((mat) => {
        mat.opacity = THREE.MathUtils.clamp((this.headlightIntensity + pulse) * 0.22, 0, 0.3);
      });
    }
  }
}
