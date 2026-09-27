import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, MeshDistortMaterial, PerspectiveCamera, Stars, Float as DreiFloat } from '@react-three/drei';
import * as THREE from 'three';

// Lobe definition for building volumetric, billowy clouds
interface CloudLobe {
  offset: [number, number, number];
  scale: [number, number, number];
  distort: number;
}

// Classical cumulus cloud formation layout
const DEFAULT_LOBES: CloudLobe[] = [
  { offset: [0, 0, 0], scale: [1.6, 1.1, 1.2], distort: 0.25 },
  { offset: [-1.2, -0.15, 0.2], scale: [1.1, 0.9, 1.0], distort: 0.3 },
  { offset: [1.3, -0.1, -0.1], scale: [1.2, 0.95, 1.1], distort: 0.28 },
  { offset: [-0.5, 0.75, 0.1], scale: [1.05, 0.95, 0.95], distort: 0.35 },
  { offset: [0.65, 0.7, -0.2], scale: [1.15, 1.0, 1.0], distort: 0.32 },
  { offset: [0.2, -0.35, 0.4], scale: [1.25, 0.7, 0.9], distort: 0.22 },
  { offset: [-0.3, 0.15, -0.6], scale: [1.0, 0.85, 0.9], distort: 0.28 },
  { offset: [0.45, 0.1, 0.6], scale: [0.95, 0.8, 0.85], distort: 0.3 },
];

interface FloatingCloudProps {
  position: [number, number, number];
  baseColor?: string;
  glowColor?: string;
  scale?: number;
  speed?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
  interactive?: boolean;
}

const FloatingCloud: React.FC<FloatingCloudProps> = ({
  position,
  baseColor = "#93c5fd", // Soft sky blue
  glowColor = "#38bdf8", // Vivid cyan / sky glow
  scale = 1,
  speed = 1.2,
  floatIntensity = 1.8,
  rotationIntensity = 0.6,
  interactive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle wind drift
      groupRef.current.rotation.y += delta * 0.04 * (speed * 0.5);
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.05;

      const targetScale = hovered ? scale * 1.12 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }
  });

  return (
    <DreiFloat 
      speed={speed} 
      rotationIntensity={rotationIntensity} 
      floatIntensity={floatIntensity}
    >
      <group
        ref={groupRef}
        position={position}
        scale={scale}
        onPointerOver={() => interactive && setHover(true)}
        onPointerOut={() => interactive && setHover(false)}
      >
        {/* Soft internal core glow for a cloud-native illuminated look */}
        <pointLight 
          color={glowColor} 
          intensity={hovered ? 35 : 18} 
          distance={6} 
          decay={2} 
        />

        {/* Cloud billow lobes */}
        {DEFAULT_LOBES.map((lobe, idx) => (
          <mesh 
            key={idx} 
            position={lobe.offset} 
            scale={lobe.scale}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <MeshDistortMaterial
              color={hovered ? "#bfdbfe" : baseColor}
              speed={1.5}
              distort={lobe.distort}
              roughness={0.5}
              metalness={0.15}
              opacity={0.92}
              transparent
            />
          </mesh>
        ))}
      </group>
    </DreiFloat>
  );
};

// Hero cloud that responds to cursor movement
const MouseFollowerCloud = () => {
  const { viewport, mouse } = useThree();
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      const x = (mouse.x * viewport.width) * 0.35;
      const y = (mouse.y * viewport.height) * 0.25;
      ref.current.position.set(x * 0.15, y * 0.15, 0);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.3, 0.08);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -mouse.y * 0.3, 0.08);
    }
  });

  return (
    <group ref={ref}>
      <FloatingCloud 
        position={[0, 0, 0]} 
        baseColor="#bae6fd" // Sky cloud white-blue
        glowColor="#0284c7" // Deep sky electric glow
        scale={1.3} 
        speed={1.4} 
        floatIntensity={2} 
        rotationIntensity={0.5} 
      />
    </group>
  );
};

// Ambient small cloudlets floating in the backdrop
const AmbientCloudlets = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * 0.08;
      // Wrap around screen
      if (groupRef.current.position.x > 18) {
        groupRef.current.position.x = -18;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <FloatingCloud
        position={[-12, -4, -6]}
        baseColor="#7dd3fc"
        glowColor="#38bdf8"
        scale={0.5}
        speed={0.8}
        interactive={false}
      />
      <FloatingCloud
        position={[-4, 5, -7]}
        baseColor="#c7d2fe"
        glowColor="#818cf8"
        scale={0.45}
        speed={0.9}
        interactive={false}
      />
      <FloatingCloud
        position={[10, 4.5, -8]}
        baseColor="#e0e7ff"
        glowColor="#60a5fa"
        scale={0.55}
        speed={0.7}
        interactive={false}
      />
    </group>
  );
};

const BackgroundParticles = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 35;
    }
  });
  return (
    <group ref={ref}>
      <Stars radius={90} depth={50} count={2500} factor={5} saturation={0.8} fade speed={0.4} />
    </group>
  );
};

const Rig = ({ children }: { children?: React.ReactNode }) => {
  const group = useRef<THREE.Group>(null);
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  
  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 1.5, mouse.y * 0.8, 10), 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return <group ref={group}>{children}</group>;
};

const Scene = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-auto">
      <Canvas gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        
        {/* Atmospheric fog tinted with subtle cloud blue */}
        <fog attach="fog" args={['#030712', 6, 22]} />
        <ambientLight intensity={0.5} />
        
        {/* Google Cloud themed illumination: Sky blues, cyans, and soft indigos */}
        <directionalLight position={[10, 15, 10]} intensity={1.8} color="#f0f9ff" />
        <pointLight position={[-12, 8, -4]} intensity={60} color="#38bdf8" />
        <pointLight position={[12, -6, -4]} intensity={70} color="#818cf8" />
        <pointLight position={[0, -10, 2]} intensity={40} color="#0284c7" />
        
        <Rig>
          {/* Main interactive hero cloud */}
          <MouseFollowerCloud />

          {/* Left atmospheric floating cloud */}
          <FloatingCloud 
            position={[-7, 3.2, -4]} 
            baseColor="#93c5fd" 
            glowColor="#38bdf8" 
            speed={1.0} 
            scale={0.75} 
            floatIntensity={2.2} 
          />

          {/* Right atmospheric floating cloud */}
          <FloatingCloud 
            position={[7, -2.8, -4]} 
            baseColor="#a5b4fc" 
            glowColor="#6366f1" 
            speed={1.1} 
            scale={0.85} 
            floatIntensity={2.0} 
          />

          {/* Drifting ambient clouds */}
          <AmbientCloudlets />

          {/* Starry digital sky backdrop */}
          <BackgroundParticles />
        </Rig>

        <ContactShadows 
          resolution={1024} 
          scale={25} 
          blur={3} 
          opacity={0.2} 
          far={12} 
          color="#030712" 
        />
        <Environment preset="night" />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.6)_100%)]" />
    </div>
  );
};

export default Scene;