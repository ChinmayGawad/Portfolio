import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  mouse: { x: number; y: number };
  activeSection: string;
  isMobile: boolean;
  isReducedMotion: boolean;
}

export function CameraRig({ mouse, activeSection, isMobile, isReducedMotion }: CameraRigProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    // 1. Determine base camera position per section
    switch (activeSection) {
      case 'about':
        targetPos.current.set(isMobile ? 0 : -0.5, 0.2, isMobile ? 6.5 : 5.8);
        break;
      case 'experience':
        targetPos.current.set(isMobile ? 0 : 0.5, 0.1, isMobile ? 6.6 : 6.0);
        break;
      case 'projects':
        targetPos.current.set(isMobile ? 0 : -0.5, -0.3, isMobile ? 6.8 : 6.2);
        break;
      case 'journey':
        targetPos.current.set(isMobile ? 0 : 0.4, 0.3, isMobile ? 6.5 : 5.9);
        break;
      case 'contact':
        targetPos.current.set(0, 0.4, isMobile ? 6.2 : 5.5);
        break;
      case 'hero':
      default:
        targetPos.current.set(0, 0, isMobile ? 6.8 : 6.0);
        break;
    }

    // 2. Add subtle mouse parallax offset
    const parallaxFactor = isMobile || isReducedMotion ? 0 : 0.35;
    const mouseX = mouse.x * parallaxFactor;
    const mouseY = mouse.y * parallaxFactor;

    // 3. Smooth Damped Camera Interpolation
    const lerpSpeed = 0.04;
    camera.position.x += (targetPos.current.x + mouseX - camera.position.x) * lerpSpeed;
    camera.position.y += (targetPos.current.y - mouseY - camera.position.y) * lerpSpeed;
    camera.position.z += (targetPos.current.z - camera.position.z) * lerpSpeed;

    // Always keep camera pointed towards center
    camera.lookAt(0, 0, 0);
  });

  return null;
}
