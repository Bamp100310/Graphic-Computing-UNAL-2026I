import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

function ModelDisplay({ format, setModelInfo }) {
  // Se cargan los tres modelos simultáneamente 
  const obj = useLoader(OBJLoader, '/modelo.obj');
  const stl = useLoader(STLLoader, '/modelo.stl');
  const glb = useGLTF('/modelo.glb');

  // Se procesa la geometría dependiendo del formato seleccionado
  const { meshToRender, vertexCount } = useMemo(() => {
    let count = 0;
    let renderContent = null;

    if (format === 'OBJ') {
      let objCount = 0;
      obj.traverse((child) => {
        if (child.isMesh) {
          objCount += child.geometry.attributes.position.count;
          // Le aplicamos un material naranja para diferenciarlo
          child.material = new THREE.MeshStandardMaterial({ color: '#ff9900' });
        }
      });
      count = objCount;
      renderContent = <primitive object={obj} />;

    } else if (format === 'STL') {
      // Los STL son una geometría pura (BufferGeometry), no un objeto completo
      count = stl.attributes.position.count;
      renderContent = (
        <mesh geometry={stl}>
          <meshStandardMaterial color="#00ccff" />
        </mesh>
      );

    } else if (format === 'GLB') {
      let glbCount = 0;
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          glbCount += child.geometry.attributes.position.count;
        }
      });
      count = glbCount;
      renderContent = <primitive object={glb.scene} />;
    }

    return { meshToRender: renderContent, vertexCount: count };
  }, [format, obj, stl, glb]);

  // Se actualiza la UI
  useEffect(() => {
    setModelInfo({ format, vertices: vertexCount });
  }, [format, vertexCount, setModelInfo]);

  return <group>{meshToRender}</group>;
}

export default function App() {
  const [format, setFormat] = useState('OBJ');
  const [modelInfo, setModelInfo] = useState({ format: 'OBJ', vertices: 0 });

  const getBtnStyle = (btnFormat) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    background: format === btnFormat ? '#4a90e2' : '#ffffff',
    color: format === btnFormat ? '#ffffff' : '#333333',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: '0.2s'
  });

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      {/* Interfaz de Usuario */}
      <div style={{ padding: '15px 25px', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>Conversión y Formatos 3D</h2>
          <p style={{ margin: 0, fontSize: '15px', color: '#a0aec0' }}>
            Formato activo: <strong style={{ color: 'white' }}>{modelInfo.format}</strong> | Vértices: <strong style={{ color: 'white' }}>{modelInfo.vertices}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setFormat('OBJ')} style={getBtnStyle('OBJ')}>Modelo .OBJ</button>
          <button onClick={() => setFormat('STL')} style={getBtnStyle('STL')}>Modelo .STL</button>
          <button onClick={() => setFormat('GLB')} style={getBtnStyle('GLB')}>Modelo .GLB (GLTF)</button>
        </div>
      </div>

      {/* Lienzo 3D */}
      <div style={{ flex: 1, background: '#b8b8b8ff' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />

          <Suspense fallback={null}>
            <ModelDisplay format={format} setModelInfo={setModelInfo} />
          </Suspense>

          <OrbitControls autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </div>
    </div>
  );
}