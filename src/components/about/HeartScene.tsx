"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import { MotionValue, useMotionValueEvent } from "motion/react";
import { HeartModel } from "./HeartModel";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeartSceneProps {
  scrollProgress: MotionValue<number>;
  isMobile?: boolean;
}

useGLTF.preload("/heart.glb");

function Scene({ progressRef, isMobile }: { progressRef: React.MutableRefObject<number>; isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, -2, 4]} intensity={0.6} color="#ffffff" />
      {/* Rim light — red accent from behind */}
      <pointLight position={[0, 0, -3]} intensity={8} color="#FF4931" distance={10} decay={2} />
      {!isMobile && (
        <pointLight position={[-2, 1, -2]} intensity={4} color="#FF4931" distance={8} decay={2} />
      )}

      <HeartModel progressRef={progressRef} isMobile={isMobile} />

      <Sparkles
        count={isMobile ? 15 : 40}
        scale={5}
        size={isMobile ? 1 : 1.5}
        speed={0.3}
        opacity={0.25}
        color="#FF4931"
        noise={1.5}
      />

    </>
  );
}

export default function HeartScene({ scrollProgress, isMobile: isMobileProp }: HeartSceneProps) {
  const isMobileHook = useIsMobile();
  const isMobile = isMobileProp ?? isMobileHook;
  const progressRef = useRef(0);

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    progressRef.current = latest;
  });

  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance", localClippingEnabled: true }}
      style={{ background: "transparent", position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Scene progressRef={progressRef} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
