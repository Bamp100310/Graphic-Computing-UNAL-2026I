import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei'
import { useControls, button } from 'leva'
import * as THREE from 'three'

function Scene() {
  const [isOrtho, setIsOrtho] = useState(false)

  const { fov, near, far, orthoZoom } = useControls('Pipeline de Cámara', {
    'Cambiar Proyección': button(() => setIsOrtho((prev) => !prev)),
    fov: { value: 60, min: 10, max: 120, step: 1, render: (get) => !isOrtho },
    orthoZoom: { value: 50, min: 10, max: 150, step: 1, render: (get) => isOrtho },
    near: { value: 0.1, min: 0.01, max: 10, step: 0.1 },
    far: { value: 50, min: 15, max: 100, step: 1 }
  })

  return (
    <>
      {isOrtho ? (
        <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={orthoZoom} near={near} far={far} />
      ) : (
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={fov} near={near} far={far} />
      )}

      <OrbitControls enableDamping />

      <mesh position={[-2, 0, 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0055" roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#00ffcc" roughness={0.1} metalness={0.5} />
      </mesh>

      <mesh position={[2, 0, -2]}>
        <coneGeometry args={[0.7, 1.5, 32]} />
        <meshStandardMaterial color="#ffaa00" roughness={0.5} metalness={0.1} />
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} />
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1a1a1a' }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}