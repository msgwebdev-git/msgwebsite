"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function HeartModel() {
  const gltf = useGLTF("/heart.glb");
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((child) => {
      if (!geo && (child as THREE.Mesh).isMesh) {
        geo = (child as THREE.Mesh).geometry;
      }
    });
    return geo;
  }, [gltf.scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    const breathe = 0.9 + Math.sin(t * 1.2) * 0.02;
    groupRef.current.scale.setScalar(breathe);
  });

  if (!geometry) return null;

  return (
    <group ref={groupRef} scale={0.9}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#FF4931"
          emissive="#FF4931"
          emissiveIntensity={0.8}
          metalness={0.3}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function AboutHeroHeart() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      dpr={[1, 1]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, -2, 4]} intensity={0.6} color="#ffffff" />
        <pointLight position={[0, 0, -3]} intensity={8} color="#FF4931" distance={10} decay={2} />
        <HeartModel />
        <Sparkles
          count={10}
          scale={5}
          size={0.8}
          speed={0.2}
          opacity={0.15}
          color="#FF4931"
          noise={1.5}
        />
      </Suspense>
    </Canvas>
  );
}
