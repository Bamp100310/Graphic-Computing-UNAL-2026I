import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function CuboAnimado() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(t) * 2;
      meshRef.current.position.y = Math.cos(t) * 2;

      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;

      const escala = 1 + Math.sin(t * 3) * 0.5;
      meshRef.current.scale.set(escala, escala, escala);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00ffcc" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />

        <CuboAnimado />

        {/*Controles de órbita */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}