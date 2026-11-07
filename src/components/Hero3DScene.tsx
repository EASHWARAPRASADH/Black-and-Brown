import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({
  position,
  speed,
  color,
  geometry,
  scale = 1
}: {
  position: [number, number, number];
  speed: number;
  color: string;
  geometry: 'sphere' | 'torus' | 'icosahedron';
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  const GeometryComponent = useMemo(() => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[1, 36, 36]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.35, 20, 48]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 1]} />;
    }
  }, [geometry]);

  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.2} floatingRange={[-0.4, 0.4]}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {GeometryComponent}
        <MeshDistortMaterial color={color} transparent opacity={0.22} roughness={0.1} metalness={0.8} distort={0.28} speed={1.8} />
      </mesh>
    </Float>
  );
}

function FloatingParticles({
  viewportWidth,
  viewportHeight,
  isMobile
}: {
  viewportWidth: number;
  viewportHeight: number;
  isMobile: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);

  const count = isMobile ? 85 : 140;
  const spreadX = isMobile ? viewportWidth * 1.25 : 18;
  const spreadY = isMobile ? viewportHeight * 1.25 : 12;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, [count, spreadX, spreadY]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#E6D5B8" size={isMobile ? 0.05 : 0.04} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

/** Gently swings the whole scene toward the pointer / touch, with organic ambient breathing on mobile. */
function PointerRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    // Ambient breathing oscillation so mobile has constant organic life
    const autoY = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
    const autoX = Math.cos(state.clock.elapsedTime * 0.4) * 0.08;
    const targetY = state.pointer.x * 0.25 + autoY;
    const targetX = -state.pointer.y * 0.18 + autoX;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.5, delta);
  });
  return <group ref={group}>{children}</group>;
}

function Scene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 6.5;
  const vw = viewport.width;
  const vh = viewport.height;

  // Responsive positions: relative to screen width on mobile, fixed aesthetic coordinates on desktop
  const shapes = useMemo(() => {
    if (isMobile) {
      return [
        { position: [-vw * 0.38, vh * 0.28, -1.2] as [number, number, number], speed: 1.2, color: '#E6D5B8', geometry: 'torus' as const, scale: 0.62 },
        { position: [vw * 0.38, -vh * 0.16, -1.0] as [number, number, number], speed: 0.9, color: '#C5A880', geometry: 'sphere' as const, scale: 0.68 },
        { position: [-vw * 0.32, -vh * 0.36, -1.8] as [number, number, number], speed: 1.1, color: '#D4AF37', geometry: 'icosahedron' as const, scale: 0.55 },
        { position: [vw * 0.34, vh * 0.38, -2.2] as [number, number, number], speed: 0.7, color: '#E6D5B8', geometry: 'sphere' as const, scale: 0.52 },
        { position: [0, vh * 0.44, -2.0] as [number, number, number], speed: 0.85, color: '#D4AF37', geometry: 'icosahedron' as const, scale: 0.5 },
        { position: [vw * 0.22, -vh * 0.44, -1.5] as [number, number, number], speed: 1.0, color: '#E6D5B8', geometry: 'torus' as const, scale: 0.58 },
      ];
    }
    return [
      { position: [-4, 2, -2] as [number, number, number], speed: 1.2, color: '#E6D5B8', geometry: 'torus' as const, scale: 1 },
      { position: [4, -1, -1] as [number, number, number], speed: 0.8, color: '#C5A880', geometry: 'sphere' as const, scale: 1 },
      { position: [-2, -2.5, -3] as [number, number, number], speed: 1.0, color: '#D4AF37', geometry: 'icosahedron' as const, scale: 1 },
      { position: [3.5, 2.5, -4] as [number, number, number], speed: 0.6, color: '#E6D5B8', geometry: 'sphere' as const, scale: 1 },
      { position: [-3.5, 0.5, -1.5] as [number, number, number], speed: 1.4, color: '#C5A880', geometry: 'torus' as const, scale: 1 },
      { position: [0, 3, -3] as [number, number, number], speed: 0.9, color: '#D4AF37', geometry: 'icosahedron' as const, scale: 1 },
      { position: [1.5, -3, -2] as [number, number, number], speed: 1.1, color: '#E6D5B8', geometry: 'torus' as const, scale: 1 },
    ];
  }, [isMobile, vw, vh]);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#E6D5B8" />
      <directionalLight position={[-5, -3, -2]} intensity={0.6} color="#C5A880" />

      <PointerRig>
        {shapes.map((s, idx) => (
          <FloatingShape
            key={idx}
            position={s.position}
            speed={s.speed}
            color={s.color}
            geometry={s.geometry}
            scale={s.scale}
          />
        ))}
        <FloatingParticles viewportWidth={vw} viewportHeight={vh} isMobile={isMobile} />
      </PointerRig>
    </>
  );
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
