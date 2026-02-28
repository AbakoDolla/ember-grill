import { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Fallback component when WebGL is not supported
function WebGLFallback() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg animate-pulse" />
    </div>
  );
}

function FoodSphere({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.1}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function GrilledMeat() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main meat piece */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0.1]}>
          <boxGeometry args={[2.5, 0.8, 1.5]} />
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Grill marks */}
        {[-0.8, -0.3, 0.2, 0.7].map((x, i) => (
          <mesh key={i} position={[x, 0.41, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.1, 0.02, 1.4]} />
            <meshStandardMaterial color="#2C1810" roughness={0.9} />
          </mesh>
        ))}
      </Float>
      
      {/* Ember glow underneath */}
      <mesh position={[0, -0.8, 0]}>
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function EmberGlow() {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, -1, 2]} color="#FF6B35" intensity={2} distance={10} />
      <pointLight position={[2, 1, 3]} color="#FFD700" intensity={1} distance={8} />
      <pointLight position={[-2, 0, 2]} color="#D4380D" intensity={1.5} distance={8} />
    </>
  );
}

export default function Food3D() {
  const [webglSupported, setWebglSupported] = useState(true);

  const handleContextCreationError = () => {
    console.warn('WebGL context creation failed in Food3D component');
    setWebglSupported(false);
  };

  const handleContextLoss = () => {
    console.warn('WebGL context lost in Food3D component');
    setWebglSupported(false);
  };

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: false,
          powerPreference: 'low-power',
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            handleContextLoss();
          });
        }}
        onError={handleContextCreationError}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <EmberGlow />
          <GrilledMeat />
        </Suspense>
      </Canvas>
    </div>
  );
}
