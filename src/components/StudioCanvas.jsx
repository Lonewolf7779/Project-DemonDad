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
      36,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.72, 4.8);
    camera.lookAt(0, 0.45, 0);

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
        camera.position.set(0, 0.82, 5.8);
        camera.fov = 42;
      } else {
        camera.position.set(0, 0.72, 4.8);
        camera.fov = 36;
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
