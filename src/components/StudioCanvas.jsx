import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCinematicRenderer, disposeSceneGraph } from '../utils/threeHelpers';
import { StudioCarScene } from '../scenes/StudioCarScene';

export function StudioCanvas({ headlightIntensity, isVibrating, onSceneReady }) {
  const canvasRef = useRef(null);
  const sceneInstanceRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34, // Intimate, dramatic automotive focal length
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    // Camera positioned to clearly frame front fascia, hood, windshield, and headlights
    camera.position.set(0, 0.62, 4.15);
    camera.lookAt(0, 0.42, 0);

    const renderer = createCinematicRenderer(canvas);
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const studioScene = new StudioCarScene(scene, camera);
    sceneInstanceRef.current = studioScene;

    if (onSceneReady) {
      onSceneReady(studioScene);
    }

    const handleResize = () => {
      if (!canvas || !renderer) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      if (width < 768) {
        camera.position.set(0, 0.72, 5.2);
        camera.fov = 40;
      } else {
        camera.position.set(0, 0.62, 4.15);
        camera.fov = 34;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const clock = new THREE.Clock();
    const renderLoop = () => {
      const elapsed = clock.getElapsedTime();
      studioScene.update(elapsed);
      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      disposeSceneGraph(scene);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      sceneInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setHeadlightIntensity(headlightIntensity);
    }
  }, [headlightIntensity]);

  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setVibration(isVibrating ? 1.0 : 0.0);
    }
  }, [isVibrating]);

  return (
    <div className="studio-canvas-wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
}
