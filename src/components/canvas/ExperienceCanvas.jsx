import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCinematicRenderer, disposeSceneGraph } from '../../utils/threeHelpers';
import { HeadlightScene } from '../../scenes/HeadlightScene';

export function ExperienceCanvas({ lightState, onSceneReady }) {
  const canvasRef = useRef(null);
  const sceneInstanceRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene & Camera Initialization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42, // Field of View (cinematic sports-car portrait fov)
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Position camera low and centered at the front bumper/headlight level
    camera.position.set(0, 0.15, 4.35);
    camera.lookAt(0, -0.15, 0);

    // 2. High-Performance Renderer
    const renderer = createCinematicRenderer(canvas);
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 3. Headlight Scene Module
    const headlightScene = new HeadlightScene(scene, camera);
    sceneInstanceRef.current = headlightScene;

    if (onSceneReady) {
      onSceneReady(headlightScene);
    }

    // 4. Resize Handling
    const handleResize = () => {
      if (!canvas || !renderer) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      // Adjust camera distance slightly on narrow mobile viewports for optimal framing
      if (width < 768) {
        camera.position.z = 5.2;
        camera.fov = 48;
      } else {
        camera.position.z = 4.35;
        camera.fov = 42;
      }
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // 5. Animation Render Loop
    const clock = new THREE.Clock();
    const renderLoop = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      headlightScene.update(elapsed);
      renderer.render(scene, camera);

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // 6. Clean Unmount & Memory Disposal
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      disposeSceneGraph(scene);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      sceneInstanceRef.current = null;
    };
  }, []);

  // Update Three.js materials whenever lightState changes from Anime.js sequence
  useEffect(() => {
    if (sceneInstanceRef.current && lightState) {
      sceneInstanceRef.current.setHeadlightState(lightState);
    }
  }, [lightState]);

  return (
    <div className="webgl-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
