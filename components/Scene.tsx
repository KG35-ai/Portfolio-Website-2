import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, MeshDistortMaterial, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

const GeometryShape = ({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * speed;
      meshRef.current.rotation.y = t * speed * 0.5;
      
      // Gentle floating override if needed, but Float wrapper handles most
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <MeshDistortMaterial 
          color={color} 
          speed={2} 
          distort={0.4} 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const BackgroundParticles = () => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });
    return (
        <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    )
}

const Scene = () => {
  return (
    <div className="fixed inset-0 z-0 bg-zinc-950">
      <Canvas gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={100} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={50} color="#00ffff" />
        
        <GeometryShape position={[0, 0, 0]} color="#6366f1" speed={0.4} />
        <GeometryShape position={[-4, 2, -2]} color="#ec4899" speed={0.3} />
        <GeometryShape position={[4, -2, -2]} color="#14b8a6" speed={0.5} />

        <BackgroundParticles />

        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
        <Environment preset="city" />
      </Canvas>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};

export default Scene;