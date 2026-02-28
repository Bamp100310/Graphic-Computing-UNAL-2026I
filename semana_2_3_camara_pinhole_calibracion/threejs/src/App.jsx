import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useHelper } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

function IntrinsicCalculator({ fov }) {
  const { size } = useThree()

  useFrame(() => {
    const h = size.height
    const w = size.width
    const fy = (h / 2) / Math.tan(THREE.MathUtils.degToRad(fov / 2))
    const fx = fy * (w / h)

    const cx = w / 2
    const cy = h / 2

    const elK = document.getElementById('matrix-k')
    if (elK) {
      elK.innerText = `[${fx.toFixed(1)},    0.0,   ${cx.toFixed(1)}]\n[   0.0, ${fy.toFixed(1)}, ${cy.toFixed(1)}]\n[   0.0,    0.0,      1.0]`
    }
  })
  return null
}

function Scene({ fov, near, far }) {
  const pinholeCamRef = useRef()

  useHelper(pinholeCamRef, THREE.CameraHelper)

  return (
    <>
      <PerspectiveCamera
        ref={pinholeCamRef}
        position={[0, 1.5, 4]}
        fov={fov}
        near={near}
        far={far}
      />

      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0055" wireframe />
      </mesh>

      <mesh position={[-2, 1, -2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#00ffcc" wireframe />
      </mesh>

      <gridHelper args={[20, 20, 0x444444, 0x222222]} />
      <ambientLight intensity={0.5} />
    </>
  )
}

export default function App() {
  const { fov, near, far } = useControls('Lente Pinhole', {
    fov: { value: 60, min: 20, max: 120, step: 1 },
    near: { value: 0.5, min: 0.1, max: 3, step: 0.1 },
    far: { value: 10, min: 5, max: 20, step: 1 }
  })

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#111', position: 'relative', overflow: 'hidden' }}>

      <div style={{
        position: 'absolute', top: 20, left: 20, color: '#00ffcc',
        fontFamily: 'monospace', background: 'rgba(0,0,0,0.85)',
        padding: '15px', borderRadius: '8px', pointerEvents: 'none', zIndex: 10
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ffaa00' }}>📷 Matriz Intrínseca (K)</h3>
        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#aaa' }}>Calculada a partir del FOV y Pantalla:</p>
        <pre id="matrix-k" style={{ color: '#fff', fontSize: '14px', margin: 0 }}>
          Calculando...
        </pre>
      </div>

      <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
        <OrbitControls enableDamping target={[0, 1, 0]} />
        <IntrinsicCalculator fov={fov} />
        <Scene fov={fov} near={near} far={far} />
      </Canvas>

    </div>
  )
}