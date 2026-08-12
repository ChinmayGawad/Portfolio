import { Canvas } from '@react-three/fiber';
import { MainObject } from './MainObject';
import { FloatingObjects } from './FloatingObjects';
import { ParticleField } from './ParticleField';
import { CameraRig } from './CameraRig';

interface SceneProps {
  mouse: { x: number; y: number };
  activeSection: string;
  isMobile: boolean;
  isReducedMotion: boolean;
}

export function Scene({ mouse, activeSection, isMobile, isReducedMotion }: SceneProps) {
  return (
    <div className="canvas-container" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Dark minimal environment background and subtle fog */}
        <color attach="background" args={['#060709']} />
        <fog attach="fog" args={['#060709', 5, 20]} />

        {/* Soft Studio Lighting System */}
        <ambientLight intensity={0.5} />
        {/* Key light for primary specular highlights */}
        <directionalLight position={[5, 6, 5]} intensity={1.8} color="#f8fafc" />
        {/* Fill light with cyan tint */}
        <pointLight position={[-6, -4, -2]} intensity={1.2} color="#38bdf8" />
        {/* Rim light with violet tint */}
        <pointLight position={[0, 5, -5]} intensity={1.0} color="#818cf8" />

        {/* 3D Scene Components */}
        <MainObject mouse={mouse} activeSection={activeSection} isReducedMotion={isReducedMotion} />
        <FloatingObjects mouse={mouse} isReducedMotion={isReducedMotion} />
        <ParticleField isMobile={isMobile} isReducedMotion={isReducedMotion} />
        <CameraRig mouse={mouse} activeSection={activeSection} isMobile={isMobile} isReducedMotion={isReducedMotion} />
      </Canvas>
    </div>
  );
}
