import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MainObjectProps {
  mouse: { x: number; y: number };
  activeSection: string;
  isReducedMotion: boolean;
}

export function MainObject({ mouse, activeSection, isReducedMotion }: MainObjectProps) {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  // Target values for smooth interpolation
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // 1. Slow base rotation
    if (!isReducedMotion) {
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.15;
        coreRef.current.rotation.x += delta * 0.05;
      }
      if (wireframeRef.current) {
        wireframeRef.current.rotation.y -= delta * 0.1;
        wireframeRef.current.rotation.z += delta * 0.08;
      }
    }

    // 2. Adjust target position and rotation based on active scroll section
    switch (activeSection) {
      case 'about':
        targetPosition.current = { x: 1.4, y: 0.1, z: -0.2 };
        targetRotation.current = { x: 0.2, y: 0.8, z: 0.1 };
        break;
      case 'experience':
        targetPosition.current = { x: -1.3, y: 0.2, z: -0.3 };
        targetRotation.current = { x: -0.3, y: 1.2, z: -0.1 };
        break;
      case 'projects':
        targetPosition.current = { x: 1.4, y: -0.2, z: -0.4 };
        targetRotation.current = { x: -0.2, y: -1.2, z: -0.15 };
        break;
      case 'journey':
        targetPosition.current = { x: -1.4, y: 0.3, z: -0.5 };
        targetRotation.current = { x: 0.3, y: -0.6, z: 0.2 };
        break;
      case 'contact':
        targetPosition.current = { x: 0, y: 0.6, z: -0.8 };
        targetRotation.current = { x: 0.4, y: 1.6, z: 0.2 };
        break;
      case 'hero':
      default:
        targetPosition.current = { x: 0, y: 0, z: 0 };
        targetRotation.current = { x: 0, y: 0, z: 0 };
        break;
    }

    // 3. Mouse influence (subtle tilt and offset)
    const mouseX = isReducedMotion ? 0 : mouse.x * 0.35;
    const mouseY = isReducedMotion ? 0 : mouse.y * 0.35;

    // 4. Smooth Damped Lerp
    const lerpFactor = 0.05;
    meshRef.current.position.x += (targetPosition.current.x + mouseX * 0.6 - meshRef.current.position.x) * lerpFactor;
    meshRef.current.position.y += (targetPosition.current.y - mouseY * 0.6 - meshRef.current.position.y) * lerpFactor;
    meshRef.current.position.z += (targetPosition.current.z - meshRef.current.position.z) * lerpFactor;

    meshRef.current.rotation.x += (targetRotation.current.x + mouseY * 0.2 - meshRef.current.rotation.x) * lerpFactor;
    meshRef.current.rotation.y += (targetRotation.current.y + mouseX * 0.2 - meshRef.current.rotation.y) * lerpFactor;
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Primary Floating Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.18}
          metalness={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
          wireframe={false}
        />
      </mesh>

      {/* Subtle Outer Geodesic Wireframe Accent */}
      <mesh ref={wireframeRef} scale={1.12}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.15}
          emissive="#38bdf8"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
