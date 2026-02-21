import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

function Model({ mode, setModelInfo }) {
  const obj = useLoader(OBJLoader, '/modelo.obj');

  const { parts, totalVertices, totalFaces } = useMemo(() => {
    const partsArray = [];
    let vCount = 0;
    let fCount = 0;

    obj.traverse((child) => {
      if (child.isMesh) {
        partsArray.push(child.geometry);
        vCount += child.geometry.attributes.position.count;
        fCount += child.geometry.index
          ? child.geometry.index.count / 3
          : child.geometry.attributes.position.count / 3;
      }
    });

    return { parts: partsArray, totalVertices: vCount, totalFaces: fCount };
  }, [obj]);

  useEffect(() => {
    setModelInfo({ vertices: totalVertices, faces: totalFaces });
  }, [totalVertices, totalFaces, setModelInfo]);

  return (
    <group>
      {parts.map((geometry, index) => (
        <group key={index}>
          {/* MODO CARAS o ARISTAS */}
          {(mode === 'caras' || mode === 'aristas') && (
            <mesh geometry={geometry}>
              <meshStandardMaterial
                // Gris claro para caras, cian brillante para aristas
                color={mode === 'aristas' ? "#00ffcc" : "#cccccc"}
                wireframe={mode === 'aristas'}
              />
              {/* Bordes oscuros solo en modo caras para resaltar la geometría */}
              {mode === 'caras' && <Edges color="#333333" threshold={15} />}
            </mesh>
          )}

          {/* MODO VÉRTICES */}
          {mode === 'vertices' && (
            <points geometry={geometry}>
              {/* Tamaño de los puntos reducido significativamente */}
              <pointsMaterial color="#ff3333" size={0.005} sizeAttenuation={true} />
            </points>
          )}
        </group>
      ))}
    </group>
  );
}

export default function App() {
  const [mode, setMode] = useState('caras');
  const [modelInfo, setModelInfo] = useState({ vertices: 0, faces: 0 });

  // Función auxiliar para los estilos de los botones
  const getButtonStyle = (buttonMode) => ({
    padding: '8px 16px',
    cursor: 'pointer',
    background: mode === buttonMode ? '#4a90e2' : '#ffffff',
    color: mode === buttonMode ? '#ffffff' : '#000000', // Texto oscuro si el fondo es blanco
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  });

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      <div style={{ padding: '15px', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>Taller Mundo 3D</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#a0aec0' }}>
            Vértices totales: {modelInfo.vertices} | Caras totales: {modelInfo.faces}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setMode('caras')} style={getButtonStyle('caras')}>Caras</button>
          <button onClick={() => setMode('aristas')} style={getButtonStyle('aristas')}>Aristas</button>
          <button onClick={() => setMode('vertices')} style={getButtonStyle('vertices')}>Vértices</button>
        </div>
      </div>

      <div style={{ flex: 1, background: '#1a1a1a' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <Model mode={mode} setModelInfo={setModelInfo} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </div>
    </div>
  );
}