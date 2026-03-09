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
  isMobile?: boolean;
}

export function HeartModel({ progressRef, isMobile = false }: HeartModelProps) {
  const gltf = useGLTF("/heart.glb");
  const groupRef = useRef<THREE.Group>(null);
  const solidMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null!);

  const smooth = useRef({ x: 0, y: 0, s: 1.0, rz: -Math.PI / 4, ry: 0, rx: 0 });

  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((child) => {
      if (!geo && (child as THREE.Mesh).isMesh) {
        geo = (child as THREE.Mesh).geometry;
      }
    });
    return geo;
  }, [gltf.scene]);

  const edgesGeometry = useMemo(() => {
    if (!geometry) return null;
    return new THREE.EdgesGeometry(geometry, 15);
  }, [geometry]);

  // Clipping plane for scan-line reveal (cuts from below)
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), -2), []);
  // Second plane just above for glow line
  const glowPlaneTop = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), -2), []);
  const glowPlaneBottom = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 2), []);

  const currentColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = progressRef.current;
    const time = state.clock.elapsedTime;

    // Scan Y: sweeps from -1.5 to +2.0
    const scanY = kf(p, [0, 0.08, 0.22], [-2.0, -1.5, 2.0]);

    // Solid material: clipped by scan plane (only visible below scanY)
    clipPlane.constant = scanY;

    // Glow strip: thin band at the scan line
    const glowHeight = 0.1;
    glowPlaneTop.constant = scanY;
    glowPlaneBottom.constant = -(scanY - glowHeight);

    // Wireframe fades
    const wireOpacity = kf(p, [0, 0.08, 0.18], [1, 1, 0]);

    // Color: white → red
    const colorT = easeInOutQuad(Math.min(p / 0.20, 1));
    currentColor.copy(COLOR_WHITE).lerp(COLOR_RED, colorT);

    if (solidMatRef.current) {
      solidMatRef.current.color.copy(currentColor);
      solidMatRef.current.emissive.copy(currentColor);
      solidMatRef.current.emissiveIntensity = 0.8;
      solidMatRef.current.clippingPlanes = [clipPlane];
      solidMatRef.current.needsUpdate = true;
    }

    // Glow line: bright white strip at scan boundary
    const glowOpacity = scanY > -1.5 && scanY < 1.8 ? 1 : 0;
    if (glowMatRef.current) {
      glowMatRef.current.color.setRGB(1, 1, 1);
      glowMatRef.current.opacity = glowOpacity * 0.9;
      glowMatRef.current.clippingPlanes = [glowPlaneTop, glowPlaneBottom];
      glowMatRef.current.needsUpdate = true;
    }

    if (wireMatRef.current) {
      wireMatRef.current.opacity = wireOpacity;
      wireMatRef.current.transparent = true;
      wireMatRef.current.color.copy(COLOR_WHITE).lerp(COLOR_RED, colorT * 0.3);
    }

    // --- Scroll keyframes ---
    const targetRZ = kf(p, [0, 0.18, 0.20], [-Math.PI / 4, -Math.PI / 4, 0]);

    const targetS = isMobile
      ? kf(p,
          [0, 0.18, 0.20, 0.38, 0.40, 0.58, 0.60, 0.78, 0.80, 0.98],
          [0.85, 0.85, 0.95, 0.95, 0.95, 0.95, 1.0, 1.0, 1.05, 0.95]
        )
      : kf(p,
          [0, 0.18, 0.20, 0.38, 0.40, 0.58, 0.60, 0.78, 0.80, 0.98],
          [1.0, 1.0, 1.2, 1.2, 1.2, 1.2, 1.3, 1.3, 1.4, 1.2]
        );

    const targetX = isMobile
      ? 0
      : kf(p,
          [0, 0.18, 0.22, 0.34, 0.38, 0.42, 0.54, 0.58, 0.60, 0.98],
          [0, 0,    -0.9, -0.9, 0,    0.9,  0.9,  0,    0,    0]
        );

    const targetY = kf(p,
      [0, 0.04, 0.14, 0.18, 0.38, 0.58, 0.60, 0.64, 0.74, 0.78, 0.80, 0.84, 0.94, 0.98],
      [0, 0.3,  0.3,  0,    0,    0,    0,    0.2,  0.2,  0,    0,    0.2,  0.2,  0]
    );

    const targetRY = kf(p,
      [0, 0.18, 0.38, 0.58, 0.78, 0.98],
      [0, Math.PI * 0.4, Math.PI * 0.9, Math.PI * 1.4, Math.PI * 2.0, Math.PI * 2.5]
    );

    const targetRX = kf(p,
      [0, 0.20, 0.40, 0.60, 0.80, 0.98],
      [0.15, 0.1, -0.15, 0.1, -0.05, 0]
    );

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
    groupRef.current.rotation.y = smooth.current.ry + time * 0.35 + Math.sin(time * 0.8) * 0.1;
    groupRef.current.rotation.x = smooth.current.rx + Math.sin(time * 0.6) * 0.05;

    const breathe = smooth.current.s * (1 + Math.sin(time * 1.2) * 0.012);
    groupRef.current.scale.setScalar(breathe);
  });

  if (!geometry) return null;

  return (
    <group ref={groupRef} scale={1.0}>
      {/* Solid mesh — clipped by scan plane, original material */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={solidMatRef}
          color="#FF4931"
          emissive="#FF4931"
          emissiveIntensity={0.8}
          metalness={0.3}
          roughness={0.4}
          side={THREE.DoubleSide}
          clippingPlanes={[clipPlane]}
          clipShadows
        />
      </mesh>

      {/* Glow line — thin bright strip at scan boundary */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          ref={glowMatRef}
          color="#ffffff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          clippingPlanes={[glowPlaneTop, glowPlaneBottom]}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wireframe edges */}
      {edgesGeometry && (
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial
            ref={wireMatRef}
            color="#ffffff"
            transparent
            opacity={1}
            linewidth={1}
          />
        </lineSegments>
      )}
    </group>
  );
}
