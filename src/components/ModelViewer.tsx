import React, { useRef, useState, ErrorInfo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode, children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GLTF Loading Error:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function FallbackMesh({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.05 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      {/* A stylized placeholder shape */}
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#b39369" wireframe={true} />
    </mesh>
  );
}

function Model({ url, hovered }: { url: string; hovered: boolean }) {
  // If url is empty or known to be invalid, we throw immediately to trigger fallback
  if (!url || url.includes('placeholder')) throw new Error("Placeholder URL");
  
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!modelRef.current) return;
    
    // Hover scale 5%
    const targetScale = hovered ? 1.05 : 1.0;
    modelRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    
    // Very subtle auto rotation
    modelRef.current.rotation.y += delta * 0.1;
  });

  return <primitive ref={modelRef} object={scene} position={[0, -1, 0]} />;
}

export default function ModelViewer({ url }: { url: string }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      className="w-full h-full cursor-grab active:cursor-grabbing relative bg-mj-surface border border-white/5 group"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{ overflow: 'hidden', borderRadius: 'inherit' }}
    >
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        {/* Adds realistic lighting to the dark theme */}
        <Environment preset="city" />
        
        <React.Suspense fallback={<FallbackMesh hovered={hovered} />}>
          <ErrorBoundary fallback={<FallbackMesh hovered={hovered} />}>
             <Model url={url} hovered={hovered} />
          </ErrorBoundary>
          {/* subtle floor shadow */}
          <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
        </React.Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="bg-mj-base/80 backdrop-blur-sm text-mj-text text-[10px] tracking-widest uppercase px-2 py-1 border border-white/10 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v16h16"/><path d="m5 19 6-6"/><path d="m2 6 3-3 3 3"/><path d="m18 16 3 3-3 3"/></svg>
          Drag to rotate
        </span>
      </div>
    </div>
  );
}
