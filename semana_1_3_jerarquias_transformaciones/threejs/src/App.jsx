import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

function SolarSystem() {
  const sunRef = useRef()
  const planetOrbitRef = useRef()
  const moonOrbitRef = useRef()

  // CONTROLES (UI)
  const { sunSpeed, planetSpeed, moonSpeed, planetDist, moonDist } = useControls({
    sunSpeed: { value: 0.005, min: 0, max: 0.05, label: 'Giro Sol' },
    planetDist: { value: 5, min: 2, max: 10, label: 'Distancia Planeta' },
    planetSpeed: { value: 0.01, min: 0, max: 0.1, label: 'Órbita Planeta' },
    moonDist: { value: 1.5, min: 0.8, max: 3, label: 'Distancia Luna' },
    moonSpeed: { value: 0.04, min: 0, max: 0.2, label: 'Órbita Luna' },
  })

  // ANIMACIÓN
  useFrame((state, delta) => {
    // 1. Rotación del Sol
    if (sunRef.current) sunRef.current.rotation.y += sunSpeed

    // 2. Traslación del Planeta
    if (planetOrbitRef.current) planetOrbitRef.current.rotation.y += planetSpeed

    // 3. Traslación de la Luna
    if (moonOrbitRef.current) moonOrbitRef.current.rotation.y += moonSpeed
  })

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={500} color="orange" castShadow />

      {/* NIVEL 1: SOL*/}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial emissive="yellow" emissiveIntensity={2} color="orange" />

        {/* NIVEL 2: GRUPO ÓRBITA PLANETA */}
        <group ref={planetOrbitRef}>
          <mesh position={[planetDist, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#2233ff" roughness={0.3} />

            {/* NIVEL 3: GRUPO ÓRBITA LUNA*/}
            <group ref={moonOrbitRef}>
              <mesh position={[moonDist, 0, 0]} castShadow receiveShadow>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial color="#aaaaaa" />
              </mesh>
            </group>
          </mesh>
        </group>
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020202' }}>
      <Canvas shadows camera={{ position: [0, 10, 15], fov: 45 }}>
        <SolarSystem />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}