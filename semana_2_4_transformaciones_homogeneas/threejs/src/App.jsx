import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function SolarSystem() {
  const earthRef = useRef()
  const moonPivotRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (earthRef.current) {
      const earthMatrix = new THREE.Matrix4()

      const orbitRotation = new THREE.Matrix4().makeRotationY(t * 0.5)
      const translation = new THREE.Matrix4().makeTranslation(4, 0, 0)
      const spinRotation = new THREE.Matrix4().makeRotationY(t * 2.0)
      const scale = new THREE.Matrix4().makeScale(0.8, 0.8, 0.8)

      earthMatrix.multiply(orbitRotation)
      earthMatrix.multiply(translation)
      earthMatrix.multiply(spinRotation)
      earthMatrix.multiply(scale)

      earthRef.current.matrixAutoUpdate = false
      earthRef.current.matrix.copy(earthMatrix)

      const el = document.getElementById('matrix-hud')
      if (el) {
        const m = earthMatrix.elements
        el.innerText =
          `[${m[0].toFixed(2)}, ${m[4].toFixed(2)}, ${m[8].toFixed(2)},  ${m[12].toFixed(2)}]
[${m[1].toFixed(2)}, ${m[5].toFixed(2)}, ${m[9].toFixed(2)},  ${m[13].toFixed(2)}]
[${m[2].toFixed(2)}, ${m[6].toFixed(2)}, ${m[10].toFixed(2)}, ${m[14].toFixed(2)}]
[${m[3].toFixed(2)}, ${m[7].toFixed(2)}, ${m[11].toFixed(2)}, ${m[15].toFixed(2)}]`
      }
    }

    if (moonPivotRef.current) {
      moonPivotRef.current.rotation.y += 0.02
    }
  })

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" wireframe />
        <axesHelper args={[3]} />
      </mesh>

      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#0088ff" />
        <axesHelper args={[2]} />

        <group ref={moonPivotRef}>
          <mesh position={[2, 0, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#aaaaaa" />
          </mesh>
        </group>
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
    </group>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#050505', overflow: 'hidden' }}>

      <div style={{
        position: 'absolute', top: 20, left: 20, color: '#00ffcc',
        fontFamily: 'monospace', background: 'rgba(0,0,0,0.85)',
        padding: '15px', borderRadius: '8px', zIndex: 10, border: '1px solid #00ffcc'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0088ff' }}>🌍 Matriz 4x4 (Tierra)</h3>
        <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '12px' }}>M = Orbita * Traslación * Giro * Escala</p>
        <pre id="matrix-hud" style={{ color: '#fff', fontSize: '14px', margin: 0 }}>
          Calculando...
        </pre>
      </div>

      <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
        <OrbitControls enableDamping />
        <SolarSystem />
      </Canvas>
    </div>
  )
}