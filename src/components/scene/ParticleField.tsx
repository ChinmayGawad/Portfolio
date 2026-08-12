import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  isMobile: boolean;
  isReducedMotion: boolean;
}

export function ParticleField({ isMobile, isReducedMotion }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Determine particle count based on device capability
  const count = isMobile ? 450 : 1200;

  // Generate random positions, scales, and phase offsets
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color('#38bdf8'); // Restrained cyan accent
    const color2 = new THREE.Color('#818cf8'); // Soft indigo
    const color3 = new THREE.Color('#64748b'); // Subtle slate

    for (let i = 0; i < count; i++) {
      // Distribute particles in a spherical ambient shell around center
      const radius = 3.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Color variation
      const rand = Math.random();
      const chosenColor = rand > 0.7 ? color1 : rand > 0.4 ? color2 : color3;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || isReducedMotion) return;
    // Slow rotational drift of particle cloud
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.04 : 0.035}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
