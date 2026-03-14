"use client";

import { useEffect, useRef } from "react";

interface AnimatedNoiseProps {
  opacity?: number;
  className?: string;
}

export function AnimatedNoise({ opacity = 0.15, className = "" }: AnimatedNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const resize = () => {
      // Use higher resolution on small screens to avoid chunky grain
      const scale = window.innerWidth <= 768 ? 1 : 0.5;
      canvas.width = Math.ceil(window.innerWidth * scale);
      canvas.height = Math.ceil(window.innerHeight * scale);
    };

    const noise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = Math.random() * 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      frame++;
      if (frame % 3 === 0) {
        noise();
      }
      animationId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[100] ${className}`}
      style={{
        opacity,
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  );
}
