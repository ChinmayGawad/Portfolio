import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingObjectsProps {
  mouse: { x: number; y: number };
  isReducedMotion: boolean;
}

interface FloatingItem {
  type: 'octahedron' | 'icosahedron' | 'torus' | 'ring';
  position: [number, number, number];
  scale: number;
  speed: number;
  rotationSpeed: [number, number, number];
  floatOffset: number;
  color: string;
}

export function FloatingObjects({ mouse, isReducedMotion }: FloatingObjectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const itemsRef = useRef<(THREE.Mesh | null)[]>([]);

  // Configured list of small ambient geometric shapes surrounding the central sphere
  const items: FloatingItem[] = useMemo(
    () => [
      {
        type: 'octahedron',
        position: [-3.5, 2.2, -1.5],
        scale: 0.45,
        speed: 1.2,
        rotationSpeed: [0.3, 0.4, 0.2],
        floatOffset: 0,
        color: '#38bdf8',
      },
      {
        type: 'icosahedron',
        position: [3.8, -1.8, -1.2],
        scale: 0.5,
        speed: 0.9,
        rotationSpeed: [0.2, -0.3, 0.1],
        floatOffset: 1.5,
        color: '#818cf8',
      },
      {
        type: 'torus',
        position: [-3.2, -2.4, -2.0],
        scale: 0.4,
        speed: 1.4,
        rotationSpeed: [-0.4, 0.2, 0.5],
        floatOffset: 3.0,
        color: '#94a3b8',
      },
      {
        type: 'ring',
        position: [3.2, 2.5, -2.5],
        scale: 0.55,
        speed: 1.0,
        rotationSpeed: [0.1, 0.5, -0.2],
        floatOffset: 4.5,
        color: '#38bdf8',
      },
    ],
    []
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Group level parallax
    if (groupRef.current) {
      const mouseX = isReducedMotion ? 0 : mouse.x * 0.2;
      const mouseY = isReducedMotion ? 0 : mouse.y * 0.2;

      groupRef.current.position.x += (mouseX - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (-mouseY - groupRef.current.position.y) * 0.05;
    }

    // Individual item floating and rotation
    itemsRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const item = items[index];

      if (!isReducedMotion) {
        // Floating sine wave animation
        const yOffset = Math.sin(time * item.speed + item.floatOffset) * 0.15;
        mesh.position.y = item.position[1] + yOffset;

        // Gentle rotation
        mesh.rotation.x += item.rotationSpeed[0] * 0.01;
        mesh.rotation.y += item.rotationSpeed[1] * 0.01;
        mesh.rotation.z += item.rotationSpeed[2] * 0.01;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, index) => (
        <mesh
          key={index}
          ref={(el) => (itemsRef.current[index] = el)}
          position={item.position}
          scale={item.scale}
        >
          {item.type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
          {item.type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
          {item.type === 'torus' && <torusGeometry args={[0.8, 0.25, 16, 32]} />}
          {item.type === 'ring' && <torusGeometry args={[0.9, 0.08, 16, 32]} />}

          <meshStandardMaterial
            color={item.color}
            roughness={0.25}
            metalness={0.7}
            transparent
            opacity={0.85}
            wireframe={item.type === 'ring'}
          />
        </mesh>
      ))}
    </group>
  );
}
