"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ── white-logo.svg paths ──────────────────────────────────────────────
// Icon (rotated -45° = heart shape, at 0° = logo orientation)
const ICON_OUTER =
  "M260.92 81.54V260.92H228.3V114.15H146.77V32.61H32.61V228.3H130.46V212H48.92V179.38H163.07V260.92H0V0H179.38V81.54H260.92Z";
const ICON_INNER =
  "M212 130.46V260.92H179.38V163.07H48.9199V48.9199H130.46V81.5399H81.5399V130.46H212Z";
const RED_SQUARE = "M260.92 0H195.69V65.23H260.92V0Z";

// MEDIA (y ≈ 66–118)
const MEDIA = [
  "M305.22 66.0698L327.58 103.03L349.94 66.0698H361.75V118H349.94V84.7698L329.95 118H325.21L305.22 84.7698V118H293.41V66.0698H305.22Z",
  "M420.27 66.0698V77.3898H379.49V87.3598H418.85V95.4998H379.49V106.69H420.27V118.01H367.68V66.0798H420.27V66.0698Z",
  "M461.2 66.0698C473.7 66.0698 483.31 77.3798 483.31 92.0398C483.31 106.7 473.7 118.01 461.2 118.01H426.2V66.0798H461.2V66.0698ZM438.01 106.69H459.02C466.07 106.69 471.49 100.31 471.49 92.0398C471.49 83.7698 466.07 77.3898 459.02 77.3898H438.01V106.69Z",
  "M501.11 66.0698V118H489.3V66.0698H501.11Z",
  "M545.79 66.0698L580 118H566.84L561.06 108.88H526.04L520.26 118H507.1L541.31 66.0698H545.78H545.79ZM532.2 99.8898H554.91L543.56 82.0198L532.21 99.8898H532.2Z",
];

// SHOW (y ≈ 137–189)
const SHOW = [
  "M351.13 137.39V148.71H309.05C306.89 148.71 305.22 150.67 305.22 153.21C305.22 155.75 306.88 157.7 309.05 157.7H339.45C347.06 157.7 352.91 164.59 352.91 173.51C352.91 182.43 347.06 189.32 339.45 189.32H294.14V178H337.28C339.44 178 341.11 176.04 341.11 173.51C341.11 170.98 339.45 169.02 337.28 169.02H306.88C299.27 169.02 293.41 162.13 293.41 153.21C293.41 144.29 299.26 137.4 306.88 137.4H351.14L351.13 137.39Z",
  "M370.69 137.39V157H406.12V137.39H417.93V189.32H406.12V166.99H370.69V189.32H358.88V137.39H370.69Z",
  "M464.71 137.39C477.21 137.39 486.82 148.7 486.82 163.36C486.82 178.02 477.21 189.33 464.71 189.33H446.04C433.54 189.33 423.93 178.02 423.93 163.36C423.93 148.7 433.54 137.39 446.04 137.39H464.71ZM435.74 163.36C435.74 171.63 441.16 178.01 448.21 178.01H462.53C469.58 178.01 475 171.63 475 163.36C475 155.09 469.58 148.71 462.53 148.71H448.21C441.16 148.71 435.74 155.09 435.74 163.36Z",
  "M498.12 137.39L511.75 170.47L525.38 137.39H532.09L545.72 170.47L559.35 137.39H570.53L548.61 189.32H542.15L528.4 155.98L514.65 189.32H508.19L486.27 137.39H498.13H498.12Z",
];

// GRUP (y ≈ 208–261)
const GRUP = [
  "M354.81 208.7V220.02H317.69C310.64 220.02 305.22 226.4 305.22 234.67C305.22 242.94 310.64 249.32 317.69 249.32H343V239.28H313.93V230.6H354.81V260.64H315.51C303.01 260.64 293.4 249.33 293.4 234.67C293.4 220.01 303.01 208.7 315.51 208.7H354.81Z",
  "M407.61 208.7C415.86 208.7 422.21 216.16 422.21 225.84C422.21 234.09 417.55 240.71 411.07 242.36L422.21 260.63H410.4L399.65 242.98H372.62V260.63H360.81V208.7H407.62H407.61ZM372.61 231.66H405.43C408.23 231.66 410.39 229.12 410.39 225.84C410.39 222.56 408.23 220.02 405.43 220.02H372.61V231.67V231.66Z",
  "M440.01 208.7V234.67C440.01 242.94 445.43 249.32 452.48 249.32H465.57C472.62 249.32 478.04 242.94 478.04 234.67V208.7H489.85V234.67C489.85 249.33 480.24 260.64 467.74 260.64H450.3C437.8 260.64 428.19 249.33 428.19 234.67V208.7H440H440.01Z",
  "M542.64 208.7C550.89 208.7 557.24 216.16 557.24 225.84C557.24 235.52 550.9 242.98 542.64 242.98H507.64V260.63H495.83V208.7H542.64ZM507.64 231.66H540.46C543.26 231.66 545.42 229.12 545.42 225.84C545.42 222.56 543.26 220.02 540.46 220.02H507.64V231.67V231.66Z",
];

// Red square center for pulse
const SQ_CX = 228.3;
const SQ_CY = 32.6;

// Icon center (rotation pivot)
const ICON_CX = 130;
const ICON_CY = 130;

// Particles per heartbeat burst
const PARTICLES_PER_BURST = 10;

// xPercent offset to visually center the icon on screen
const ICON_CENTER_OFFSET = 27.5;

interface PageLoaderProps {
  onComplete?: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [checked, setChecked] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const iconGroupRef = useRef<SVGGElement>(null);
  const iconOuterRef = useRef<SVGPathElement>(null);
  const iconInnerRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const particles1Ref = useRef<SVGGElement>(null);
  const particles2Ref = useRef<SVGGElement>(null);
  const squareRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const mediaRef = useRef<SVGGElement>(null);
  const showRef = useRef<SVGGElement>(null);
  const grupRef = useRef<SVGGElement>(null);

  // Check sessionStorage on client only
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("msg-loaded");
    if (hasLoaded) {
      setVisible(false);
      onComplete?.();
    }
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Main animation
  useEffect(() => {
    if (!checked || !visible) return;

    const overlay = overlayRef.current;
    const logoWrap = logoWrapRef.current;
    const svg = svgRef.current;
    const iconGroup = iconGroupRef.current;
    const outer = iconOuterRef.current;
    const inner = iconInnerRef.current;
    const glow = glowRef.current;
    const p1 = particles1Ref.current;
    const p2 = particles2Ref.current;
    const square = squareRef.current;
    const pulse = pulseRef.current;
    const media = mediaRef.current;
    const show = showRef.current;
    const grup = grupRef.current;

    if (
      !overlay || !logoWrap || !svg || !iconGroup || !outer || !inner ||
      !glow || !p1 || !p2 || !square || !pulse || !media || !show || !grup
    ) return;

    document.body.style.overflow = "hidden";

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set([outer, inner], { opacity: 1 });
      gsap.set(square, { opacity: 1 });
      gsap.set(media.children, { opacity: 1 });
      gsap.set(show.children, { opacity: 1 });
      gsap.set(grup.children, { opacity: 1 });
      gsap.set(svg, { xPercent: 0 });
      const tl = gsap.timeline();
      tl.to(overlay, { opacity: 0, duration: 0.5, delay: 0.3, onComplete: finish });
      return () => { tl.kill(); };
    }

    let moveTween: gsap.core.Tween | null = null;

    // ── Initial states ──
    gsap.set(svg, { xPercent: ICON_CENTER_OFFSET });
    gsap.set(iconGroup, {
      rotation: -45,
      scale: 0.85,
      svgOrigin: `${ICON_CX} ${ICON_CY}`,
    });
    gsap.set(outer, { opacity: 0 });
    gsap.set(inner, { opacity: 0 });
    gsap.set(glow, { opacity: 0 });
    gsap.set(square, { opacity: 1, scale: 0, svgOrigin: `${SQ_CX} ${SQ_CY}` });
    gsap.set(pulse, { attr: { r: 0, opacity: 0 } });
    gsap.set(media.children, { opacity: 0, y: 15 });
    gsap.set(show.children, { opacity: 0, y: 15 });
    gsap.set(grup.children, { opacity: 0, y: 15 });

    const tl = gsap.timeline();

    // === Phase 1: Heart appears (centered, rotated -45°) ===
    tl.to(iconGroup, {
      scale: 1, duration: 0.7, ease: "power3.out",
    }, 0);
    tl.to(outer, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
    tl.to(inner, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1);

    // === Phase 2: Heartbeat — "lub-dub" with glow + particles ===

    // ── Beat 1 (strong) ──
    tl.to(iconGroup, { scale: 1.12, duration: 0.12, ease: "power2.out" }, 0.85);
    tl.to(iconGroup, { scale: 1, duration: 0.18, ease: "power2.in" }, 0.97);
    // Glow flash
    tl.to(glow, { opacity: 0.8, duration: 0.12, ease: "power2.out" }, 0.85);
    tl.to(glow, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.97);
    // Particles burst 1
    Array.from(p1.children).forEach((p, i) => {
      const angle = (i * (360 / PARTICLES_PER_BURST)) * Math.PI / 180;
      const dist = 90 + Math.random() * 60;
      tl.fromTo(
        p,
        { attr: { cx: ICON_CX, cy: ICON_CY, r: 2.5, opacity: 0.8 } },
        {
          attr: {
            cx: ICON_CX + Math.cos(angle) * dist,
            cy: ICON_CY + Math.sin(angle) * dist,
            r: 0.5, opacity: 0,
          },
          duration: 0.55, ease: "power2.out", immediateRender: false,
        },
        0.85,
      );
    });

    // ── Beat 2 (softer) ──
    tl.to(iconGroup, { scale: 1.07, duration: 0.1, ease: "power2.out" }, 1.22);
    tl.to(iconGroup, { scale: 1, duration: 0.15, ease: "power2.in" }, 1.32);
    // Glow flash (softer)
    tl.to(glow, { opacity: 0.5, duration: 0.1, ease: "power2.out" }, 1.22);
    tl.to(glow, { opacity: 0, duration: 0.4, ease: "power2.in" }, 1.32);
    // Particles burst 2 (offset angles, smaller)
    Array.from(p2.children).forEach((p, i) => {
      const angle = (i * (360 / PARTICLES_PER_BURST) + 18) * Math.PI / 180;
      const dist = 70 + Math.random() * 50;
      tl.fromTo(
        p,
        { attr: { cx: ICON_CX, cy: ICON_CY, r: 2, opacity: 0.6 } },
        {
          attr: {
            cx: ICON_CX + Math.cos(angle) * dist,
            cy: ICON_CY + Math.sin(angle) * dist,
            r: 0.3, opacity: 0,
          },
          duration: 0.5, ease: "power2.out", immediateRender: false,
        },
        1.22,
      );
    });

    // === Phase 3: Rotate to logo orientation (-45° → 0°) ===
    tl.to(iconGroup, {
      rotation: 0, duration: 0.7, ease: "power2.inOut",
    }, 1.7);

    // === Phase 4: Red square pop + pulse ===
    tl.to(square, {
      scale: 1, duration: 0.5, ease: "back.out(1.7)",
    }, 2.3);
    tl.fromTo(
      pulse,
      { attr: { r: 15, opacity: 0.6 } },
      { attr: { r: 70, opacity: 0 }, duration: 0.6, ease: "power1.out", immediateRender: false },
      2.5,
    );

    // === Phase 5: SVG slides left, text appears ===
    tl.to(svg, {
      xPercent: 0, duration: 0.6, ease: "power2.inOut",
    }, 2.7);
    tl.to(media.children, {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
    }, 2.8);
    tl.to(show.children, {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
    }, 3.0);
    tl.to(grup.children, {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
    }, 3.2);

    // === Phase 6: Move to navbar ===
    tl.call(() => {
      const navLogo = document.querySelector("[data-navbar-logo]");
      if (!navLogo || !logoWrap) return;

      const navRect = navLogo.getBoundingClientRect();
      const wrapRect = logoWrap.getBoundingClientRect();

      const scaleVal = Math.min(
        navRect.width / wrapRect.width,
        navRect.height / wrapRect.height,
      );
      const dx =
        navRect.left + navRect.width / 2 - (wrapRect.left + wrapRect.width / 2);
      const dy =
        navRect.top + navRect.height / 2 - (wrapRect.top + wrapRect.height / 2);

      moveTween = gsap.to(logoWrap, {
        x: dx,
        y: dy,
        scale: scaleVal,
        duration: 0.7,
        ease: "power3.inOut",
      });
    }, [], 3.7);

    // === Phase 7: Overlay fade + finish ===
    tl.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.out" }, 4.2);
    tl.call(finish, [], 4.5);

    return () => {
      tl.kill();
      moveTween?.kill();
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, visible]);

  function finish() {
    setVisible(false);
    document.body.style.overflow = "";
    sessionStorage.setItem("msg-loaded", "1");
    onComplete?.();
  }

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-background overflow-hidden"
      role="progressbar"
      aria-label="Loading"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={logoWrapRef}>
          <svg
            ref={svgRef}
            viewBox="0 0 580 261"
            overflow="visible"
            className="w-[280px] sm:w-[340px] lg:w-[420px] h-auto"
            aria-hidden="true"
          >
            {/* Glow gradient */}
            <defs>
              <radialGradient id="heart-glow">
                <stop offset="0%" stopColor="#FF4931" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#FF4931" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#FF4931" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glow behind heart — pulses with heartbeat */}
            <circle
              ref={glowRef}
              cx={ICON_CX}
              cy={ICON_CY}
              r={160}
              fill="url(#heart-glow)"
              opacity={0}
            />

            {/* Particles — burst 1 */}
            <g ref={particles1Ref}>
              {Array.from({ length: PARTICLES_PER_BURST }, (_, i) => (
                <circle
                  key={`p1-${i}`}
                  cx={ICON_CX}
                  cy={ICON_CY}
                  r={0}
                  fill="white"
                  opacity={0}
                />
              ))}
            </g>

            {/* Particles — burst 2 */}
            <g ref={particles2Ref}>
              {Array.from({ length: PARTICLES_PER_BURST }, (_, i) => (
                <circle
                  key={`p2-${i}`}
                  cx={ICON_CX}
                  cy={ICON_CY}
                  r={0}
                  fill="white"
                  opacity={0}
                />
              ))}
            </g>

            {/* Icon group — rotates from heart (-45°) to logo (0°) */}
            <g ref={iconGroupRef}>
              <path ref={iconOuterRef} d={ICON_OUTER} fill="white" opacity={0} />
              <path ref={iconInnerRef} d={ICON_INNER} fill="white" opacity={0} />
            </g>

            {/* Red square — appears after rotation */}
            <path ref={squareRef} d={RED_SQUARE} fill="#FF4931" opacity={0} />

            {/* Pulse ring */}
            <circle
              ref={pulseRef}
              cx={SQ_CX}
              cy={SQ_CY}
              r={0}
              fill="none"
              stroke="#FF4931"
              strokeWidth={2}
              opacity={0}
            />

            {/* MEDIA */}
            <g ref={mediaRef}>
              {MEDIA.map((d, i) => (
                <path key={`m${i}`} d={d} fill="white" opacity={0} />
              ))}
            </g>

            {/* SHOW */}
            <g ref={showRef}>
              {SHOW.map((d, i) => (
                <path key={`s${i}`} d={d} fill="white" opacity={0} />
              ))}
            </g>

            {/* GRUP */}
            <g ref={grupRef}>
              {GRUP.map((d, i) => (
                <path key={`g${i}`} d={d} fill="white" opacity={0} />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
