"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { MotionValue, useMotionValueEvent } from "motion/react";
import { HeartModel } from "./HeartModel";

interface HeartSceneProps {
  scrollProgress: MotionValue<number>;
}

useGLTF.preload("/heart.glb");

function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-3, -2, 4]} intensity={0.5} color="#ffffff" />

      <HeartModel progressRef={progressRef} />

      <Sparkles
        count={40}
        scale={5}
        size={1.5}
        speed={0.3}
        opacity={0.25}
        color="#FF4931"
        noise={1.5}
      />

    </>
  );
}

export default function HeartScene({ scrollProgress }: HeartSceneProps) {
  const progressRef = useRef(0);

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    progressRef.current = latest;
  });

  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Scene progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
