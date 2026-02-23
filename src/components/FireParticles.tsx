import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fallback component when WebGL is not supported
function WebGLFallback() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-full h-full bg-gradient-to-t from-orange-500/20 to-red-500/20 animate-pulse" />
    </div>
  );
}

function Particles({ count = 100 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 15 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Fire colors: orange to red
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 1; // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 0; // B
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 1; // R
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.2; // G
        colors[i * 3 + 2] = 0; // B
      } else {
        colors[i * 3] = 1; // R
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G (gold)
        colors[i * 3 + 2] = 0.2; // B
      }
      
      sizes[i] = Math.random() * 3 + 1;
    }
    
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.02 + Math.random() * 0.02;
      positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      
      if (positions[i * 3 + 1] > 10) {
        positions[i * 3 + 1] = -5;
        positions[i * 3] = (Math.random() - 0.5) * 20;
      }
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function FireParticles() {
  const [webglSupported, setWebglSupported] = useState(true);

  const handleContextCreationError = () => {
    console.warn('WebGL context creation failed in FireParticles component');
    setWebglSupported(false);
  };

  const handleContextLoss = () => {
    console.warn('WebGL context lost in FireParticles component');
    setWebglSupported(false);
  };

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
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
          <Particles count={80} />
        </Suspense>
      </Canvas>
    </div>
  );
}
