import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sphere, Plane, Stats } from '@react-three/drei'
import { useControls, folder } from 'leva'
import * as THREE from 'three'

// Shader de profundidad optimizado
const DepthShader = {
  uniforms: {
    uNear: { value: 0.1 },
    uFar: { value: 1000 },
  },
  vertexShader: `
    varying float vDepth;
    void main() {
      vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
      vDepth = -viewPos.z;
      gl_Position = projectionMatrix * viewPos;
    }
  `,
  fragmentShader: `
    uniform float uNear;
    uniform float uFar;
    varying float vDepth;
    void main() {
      float range = max(uFar - uNear, 0.01);
      float linearDepth = clamp((vDepth - uNear) / range, 0.0, 1.0);
      
      // Aplicamos un factor de exposición para que no se vea negro con valores de Far muy altos
      // Esto es como usar "Visión Nocturna" en el buffer
      float exposure = 10.0; 
      float visibleDepth = pow(linearDepth, 0.5); // Corrección Gamma para resaltar detalles oscuros
      
      gl_FragColor = vec4(vec3(visibleDepth), 1.0);
    }
  `
}

function SceneContent() {
  const sphereRef = useRef()

  // --- CONTROLES REESTRUCTURADOS PARA EVITAR NaN ---
  const settings = useControls({
    Camera: folder({
      near: { value: 0.1, min: 0.01, max: 5, step: 0.01, label: 'Near' },
      far: { value: 1000, min: 10, max: 5000, step: 10, label: 'Far' },
    }),
    ZFighting: folder({
      showFighting: { value: true, label: 'Plano Rojo' },
      separation: { value: 0.005, min: 0, max: 0.1, step: 0.0001, label: 'Gap' },
    }),
    RenderState: folder({
      visDepth: { value: false, label: 'Modo Depth' },
      dTest: { value: true, label: 'Depth Test' },
      polyOff: { value: false, label: 'Poly Offset' },
    })
  })

  const depthMat = useMemo(() => new THREE.ShaderMaterial(DepthShader), [])

  useFrame((state) => {
    // Sincronización manual de la cámara y el shader
    depthMat.uniforms.uNear.value = settings.near
    depthMat.uniforms.uFar.value = settings.far
    
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 2 + 1.5
    }
  })

  return (
    <>
      {/* Seteo directo de la cámara para evitar inconsistencias */}
      <PerspectiveCamera makeDefault near={settings.near} far={settings.far} position={[10, 10, 15]} />
      <OrbitControls makeDefault />
      
      <color attach="background" args={[settings.visDepth ? 'black' : '#202020']} />
      
      {/* ILUMINACIÓN MEJORADA */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[10, 10, 10]} intensity={2.5} castShadow />
      <pointLight position={[-10, 5, -10]} intensity={1.5} color="#4444ff" />

      {/* 1. SUELO (Gris) */}
      <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        {settings.visDepth ? <primitive object={depthMat} attach="material" /> : <meshStandardMaterial color="#555555" />}
      </Plane>

      {/* 2. PLANO ROJO (Z-Fighting) */}
      {settings.showFighting && (
        <Plane 
          args={[15, 15]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, settings.separation, 0]}
        >
          {settings.visDepth ? 
            <primitive object={depthMat} attach="material" /> : 
            <meshStandardMaterial 
              color="#ff4444" 
              polygonOffset={settings.polyOff} 
              polygonOffsetFactor={-4} 
              polygonOffsetUnits={-4} 
            />
          }
        </Plane>
      )}

      {/* 3. ESFERA (Azul Cosmere) */}
      <Sphere ref={sphereRef} args={[1.2, 64, 64]}>
        {settings.visDepth ? 
          <primitive object={depthMat} attach="material" /> : 
          <meshStandardMaterial color="#0088ff" roughness={0.1} metalness={0.5} depthTest={settings.dTest} />
        }
      </Sphere>

      {/* 4. PARED (Referencia) */}
      <mesh position={[-10, 5, 0]}>
        <boxGeometry args={[0.5, 10, 30]} />
        {settings.visDepth ? <primitive object={depthMat} attach="material" /> : <meshStandardMaterial color="#777777" />}
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <SceneContent />
        <Stats />
      </Canvas>
    </div>
  )
}