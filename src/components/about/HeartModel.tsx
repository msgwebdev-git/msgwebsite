"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const COLOR_RED = new THREE.Color("#FF4931");
const COLOR_WHITE = new THREE.Color("#ffffff");

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Keyframe interpolation with easing
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

interface HeartModelProps {
  progressRef: React.MutableRefObject<number>;
}

export function HeartModel({ progressRef }: HeartModelProps) {
  const gltf = useGLTF("/heart.glb");
  const groupRef = useRef<THREE.Group>(null);
  const meshMatRef = useRef<THREE.MeshStandardMaterial>(null!);

  // Smooth values
  const smooth = useRef({ x: 0, y: 0, s: 1.4, rz: -Math.PI / 4, ry: 0, rx: 0 });

  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((child) => {
      if (!geo && (child as THREE.Mesh).isMesh) {
        geo = (child as THREE.Mesh).geometry;
      }
    });
    return geo;
  }, [gltf.scene]);


  const currentColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = progressRef.current;
    const time = state.clock.elapsedTime;

    // --- Scroll-driven keyframes ---
    // Apple-style: model transforms dramatically between scroll acts
    //
    // Act 1 (0.00-0.15): Heart shape, red, centered, medium
    // Act 2 (0.15-0.30): Transform — rotate + grow + go white (pure visual transition)
    // Act 3 (0.30-0.50): Logo, white, large, shift left — text right
    // Act 4 (0.50-0.70): Logo, shift right — text left
    // Act 5 (0.70-0.85): Logo, center, zoom in — stats
    // Act 6 (0.85-1.00): Logo, center, standard — final message

    // Synced with text blocks: Act1 0–0.18, Act2 0.20–0.38, Act3 0.40–0.58, Act4 0.60–0.78, Act5 0.80–0.98

    // Rotation Z: heart(-45°) → logo(0°) during first gap
    const targetRZ = kf(p, [0, 0.18, 0.20], [-Math.PI / 4, -Math.PI / 4, 0]);

    // Scale
    const targetS = kf(p,
      [0, 0.18, 0.20, 0.38, 0.40, 0.58, 0.60, 0.78, 0.80, 0.98],
      [1.4, 1.4, 1.8, 1.8, 1.8, 1.8, 2.0, 2.0, 2.2, 1.8]
    );

    // Position X: centered → left (text right) → right (text left) → centered
    const targetX = kf(p,
      [0, 0.18, 0.22, 0.34, 0.38, 0.42, 0.54, 0.58, 0.60, 0.98],
      [0, 0,    -1.0, -1.0, 0,    1.0,  1.0,  0,    0,    0]
    );

    // Position Y
    const targetY = kf(p,
      [0, 0.38, 0.58, 0.78, 0.98],
      [0, 0.1, -0.1, 0, 0]
    );

    // Y rotation: scroll-driven turns
    const targetRY = kf(p,
      [0, 0.18, 0.38, 0.58, 0.78, 0.98],
      [0, Math.PI * 0.4, Math.PI * 0.9, Math.PI * 1.4, Math.PI * 2.0, Math.PI * 2.5]
    );

    // X tilt
    const targetRX = kf(p,
      [0, 0.20, 0.40, 0.60, 0.80, 0.98],
      [0.15, 0.1, -0.15, 0.1, -0.05, 0]
    );

    // Color: white → red during first two acts
    const colorT = easeInOutQuad(Math.min(p / 0.20, 1));
    currentColor.copy(COLOR_WHITE).lerp(COLOR_RED, colorT);

    if (meshMatRef.current) {
      meshMatRef.current.color.copy(currentColor);
      meshMatRef.current.emissive.copy(currentColor);
      meshMatRef.current.emissiveIntensity = 0.6;
    }

    // Smooth lerp for position/scale/rotation (spring-like feel)
    const f = 0.06;
    smooth.current.x += (targetX - smooth.current.x) * f;
    smooth.current.y += (targetY - smooth.current.y) * f;
    smooth.current.s += (targetS - smooth.current.s) * f;
    smooth.current.rz += (targetRZ - smooth.current.rz) * f;
    smooth.current.ry += (targetRY - smooth.current.ry) * f;
    smooth.current.rx += (targetRX - smooth.current.rx) * f;

    groupRef.current.position.x = smooth.current.x;
    groupRef.current.position.y = smooth.current.y;
    groupRef.current.rotation.z = smooth.current.rz;

    // Scroll-driven Y rotation + continuous slow auto-spin + ambient oscillation
    groupRef.current.rotation.y = smooth.current.ry + time * 0.35 + Math.sin(time * 0.8) * 0.1;
    // Scroll-driven X tilt + ambient oscillation
    groupRef.current.rotation.x = smooth.current.rx + Math.sin(time * 0.6) * 0.05;

    // Breathing + scroll scale
    const breathe = smooth.current.s * (1 + Math.sin(time * 1.2) * 0.012);
    groupRef.current.scale.setScalar(breathe);
  });

  if (!geometry) return null;

  return (
    <group ref={groupRef} scale={1.4}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={meshMatRef}
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.6}
          metalness={0.15}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

    </group>
  );
}
