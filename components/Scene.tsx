
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, MeshDistortMaterial, PerspectiveCamera, Stars, Float as DreiFloat } from '@react-three/drei';
import * as THREE from 'three';

const MouseFollower = () => {
  const { viewport, mouse } = useThree();
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      ref.current.position.set(x * 0.1, y * 0.1, 0);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.5, 0.1);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -mouse.y * 0.5, 0.1);
    }
  });

  return (
    <group ref={ref}>
      <GeometryShape position={[0, 0, 0]} color="#6366f1" speed={0.2} scale={1.5} distort={0.5} />
    </group>
  );
};

const GeometryShape = ({ 
  position, 
  color, 
  speed, 
  scale = 1, 
  distort = 0.4 
}: { 
  position: [number, number, number], 
  color: string, 
  speed: number, 
  scale?: number, 
  distort?: number 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * speed;
      meshRef.current.rotation.y = t * speed * 0.5;
      
      const s = hovered ? scale * 1.15 : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    }
  });

  return (
    <DreiFloat speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={color} 
          speed={3} 
          distort={distort} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </DreiFloat>
  );
};

const BackgroundParticles = () => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 20;
            ref.current.rotation.y -= delta / 25;
        }
    });
    return (
        <group ref={ref}>
            <Stars radius={100} depth={50} count={3000} factor={6} saturation={0.5} fade speed={0.5} />
        </group>
    )
}

// Fix: Make children optional to resolve TypeScript "missing children" errors when used as a JSX wrapper
const Rig = ({ children }: { children?: React.ReactNode }) => {
  const group = useRef<THREE.Group>(null);
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  
  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1, 10), 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return <group ref={group}>{children}</group>;
};

const Scene = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        
        <fog attach="fog" args={['#050505', 5, 20]} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={150} castShadow />
        <pointLight position={[-10, 5, -5]} intensity={80} color="#818cf8" />
        <pointLight position={[10, -5, -5]} intensity={80} color="#ec4899" />
        
        <Rig>
            <MouseFollower />
            <GeometryShape position={[-6, 3, -4]} color="#ec4899" speed={0.15} scale={0.6} distort={0.3} />
            <GeometryShape position={[6, -3, -4]} color="#14b8a6" speed={0.25} scale={0.7} distort={0.4} />
            <BackgroundParticles />
        </Rig>

        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.15} far={10} color="#000000" />
        <Environment preset="night" />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

export default Scene;