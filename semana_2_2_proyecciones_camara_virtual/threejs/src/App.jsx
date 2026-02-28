import React, { useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei'
import { useControls, button } from 'leva'
import * as THREE from 'three'

function PipelineMathRunner() {
  const { camera, size } = useThree()
  const targetPos = new THREE.Vector3(0, 0, 0)

  useFrame(() => {
    const clonePos = targetPos.clone()
    clonePos.project(camera)

    const pxX = ((clonePos.x + 1) / 2) * size.width
    const pxY = (-(clonePos.y - 1) / 2) * size.height

    const elNdc = document.getElementById('hud-ndc')
    const elScreen = document.getElementById('hud-screen')

    if (elNdc) elNdc.innerText = `[${clonePos.x.toFixed(2)}, ${clonePos.y.toFixed(2)}]`
    if (elScreen) elScreen.innerText = `[${pxX.toFixed(0)}px, ${pxY.toFixed(0)}px]`
  })

  return null
}

function Scene({ isOrtho, fov, orthoSize, near, far }) {
  return (
    <>
      {isOrtho ? (
        <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={orthoSize} near={near} far={far} onUpdate={c => c.lookAt(0, 0, 0)} />
      ) : (
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={fov} near={near} far={far} onUpdate={c => c.lookAt(0, 0, 0)} />
      )}

      <OrbitControls enableDamping target={[0, 0, 0]} />

      <mesh position={[-2, 0, 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0055" />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#ffaa00" wireframe />
      </mesh>

      <mesh position={[2, 0, -2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00ffcc" />
      </mesh>

      <gridHelper args={[10, 10, 0x444444, 0x222222]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
    </>
  )
}

export default function App() {
  const [isOrtho, setIsOrtho] = useState(false)

  const { fov, orthoSize, near, far } = useControls('Camera Settings', {
    'Cambiar Modo': button(() => setIsOrtho((prev) => !prev)),
    fov: { value: 50, min: 10, max: 120, render: () => !isOrtho },
    orthoSize: { value: 60, min: 10, max: 150, render: () => isOrtho },
    near: { value: 0.1, min: 0.01, max: 10 },
    far: { value: 100, min: 10, max: 500 }
  })

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#111', overflow: 'hidden' }}>

      <div style={{
        position: 'absolute', top: 20, left: 20, color: '#00ffcc',
        fontFamily: 'monospace', background: 'rgba(0,0,0,0.85)',
        padding: '15px', borderRadius: '8px', pointerEvents: 'none',
        border: '1px solid #00ffcc', zIndex: 10
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ff0055' }}>
          🎥 {isOrtho ? 'ORTOGRÁFICA' : 'PERSPECTIVA'}
        </h3>
        <p>Valores en Panel Derecho (Leva)</p>
        <hr style={{ borderColor: '#333' }} />
        <h4 style={{ margin: '10px 0 5px 0', color: '#ffaa00' }}>⚡ Vector3.project()</h4>
        <p>Target: [0, 0, 0] (Esfera Centro)</p>
        <p>NDC (Clip Space): <span id="hud-ndc" style={{ color: '#fff' }}>Calculando...</span></p>
        <p>Screen Space: <span id="hud-screen" style={{ color: '#fff' }}>Calculando...</span></p>
      </div>

      <Canvas>
        <PipelineMathRunner />
        <Scene isOrtho={isOrtho} fov={fov} orthoSize={orthoSize} near={near} far={far} />
      </Canvas>

    </div>
  )
}