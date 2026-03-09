"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface AboutHeartModelProps {
  progressRef: React.MutableRefObject<number>;
  isMobile: boolean;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function kf(progress: number, inputs: number[], outputs: number[]): number {
  if (progress <= inputs[0]) return outputs[0];
  if (progress >= inputs[inputs.length - 1]) return outputs[outputs.length - 1];
  for (let i = 0; i < inputs.length - 1; i++) {
    if (progress <= inputs[i + 1]) {
      const t = (progress - inputs[i]) / (inputs[i + 1] - inputs[i]);
      return lerp(outputs[i], outputs[i + 1], easeInOutQuad(t));
    }
  }
  return outputs[outputs.length - 1];
}

export function AboutHeartModel({ progressRef, isMobile }: AboutHeartModelProps) {
  const gltf = useGLTF("/heart.glb");
  const groupRef = useRef<THREE.Group>(null);

  const smooth = useRef({ x: 0, y: 0, s: 1.0, ry: 0, rx: 0, rz: 0 });

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

    const p = progressRef.current;
    const time = state.clock.elapsedTime;

    // --- History section: ~0.22–0.45 of page scroll ---
    // Before history: normal large model floating around
    // During history: shrink + travel down center line of timeline
    // After history: grow back

    const targetX = isMobile
      ? 0
      : kf(p,
          [0,   0.15, 0.20, 0.22, 0.60, 0.66, 0.74, 0.9, 1.0],
          [1.2, 1.2,  0.5,  0,    0,    -1.0, 1.0,  -0.8, 0]
        );
    const targetY = isMobile
      ? 0
      : kf(p,
          [0,   0.15, 0.20, 0.22, 0.60, 0.66, 0.74, 0.9, 1.0],
          [0,   -0.3, 0.3,  0,    0,    0,    -0.2, 0,    0]
        );
    const targetS = isMobile
      ? kf(p,
          [0,    0.08, 0.14, 0.85, 0.92, 1.0],
          [0.85, 0.85, 0,    0,    0.85,  0.85]
        )
      : kf(p,
          [0,   0.15, 0.20, 0.22, 0.60, 0.66, 0.74, 0.9, 1.0],
          [1.3, 1.1,  0.5,  0.18, 0.18, 0.6,  1.1,  1.2,  1.3]
        );

    // Rotation: spin faster during timeline travel
    const targetRY = kf(p,
      [0,   0.22, 0.60, 1.0],
      [0,   Math.PI * 1.5, Math.PI * 5, Math.PI * 8]
    );
    const targetRX = kf(p,
      [0,   0.2,  0.22, 0.60, 0.66, 0.8,  1.0],
      [0.2, -0.3, 0,    0,    0.2,  0.15, 0]
    );
    const targetRZ = kf(p,
      [0,    0.3,  0.6,  1.0],
      [-0.1, 0.15, -0.1, 0]
    );

    const f = 0.07;
    smooth.current.x += (targetX - smooth.current.x) * f;
    smooth.current.y += (targetY - smooth.current.y) * f;
    smooth.current.s += (targetS - smooth.current.s) * f;
    smooth.current.ry += (targetRY - smooth.current.ry) * f;
    smooth.current.rx += (targetRX - smooth.current.rx) * f;
    smooth.current.rz += (targetRZ - smooth.current.rz) * f;

    groupRef.current.position.x = smooth.current.x;
    groupRef.current.position.y = smooth.current.y;

    // Scroll-driven rotation + subtle idle wobble
    groupRef.current.rotation.y = smooth.current.ry + Math.sin(time * 0.4) * 0.05;
    groupRef.current.rotation.x = smooth.current.rx + Math.sin(time * 0.3) * 0.03;
    groupRef.current.rotation.z = smooth.current.rz;

    // Breathing scale
    const breathe = smooth.current.s * (1 + Math.sin(time * 1.2) * 0.015);
    groupRef.current.scale.setScalar(breathe);
  });

  if (!geometry) return null;

  return (
    <group ref={groupRef} scale={1.3}>
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
