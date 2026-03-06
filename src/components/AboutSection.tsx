"use client";

import { useRef } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
  MotionValue,
} from "motion/react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import SplitText from "./SplitText";

const HeartScene = dynamic(() => import("./about/HeartScene"), {
  ssr: false,
});

function ScrollText({
  scrollProgress,
  fadeIn,
  fadeOut,
  children,
  className = "",
}: {
  scrollProgress: MotionValue<number>;
  fadeIn: [number, number];
  fadeOut: [number, number];
  children: React.ReactNode;
  className?: string;
}) {
  const opacity = useTransform(
    scrollProgress,
    [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollProgress,
    [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
    [40, 0, 0, -20]
  );
  const scale = useTransform(
    scrollProgress,
    [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
    [0.95, 1, 1, 0.98]
  );

  const smoothOpacity = useSpring(opacity, { stiffness: 200, damping: 40 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 150, damping: 30 });

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ opacity: smoothOpacity, y: smoothY, scale: smoothScale }}
    >
      {children}
    </motion.div>
  );
}

export function AboutSection() {
  const t = useTranslations("aboutSection.story");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [0.5, 0]);

  // Canvas dims when text is active, bright in gaps
  // Text blocks: 0.00–0.18, 0.20–0.38, 0.40–0.58, 0.60–0.78, 0.80–0.98
  const canvasBrightness = useTransform(
    scrollYProgress,
    [0, 0.03, 0.14, 0.18,   0.20, 0.23, 0.34, 0.38,   0.40, 0.43, 0.54, 0.58,   0.60, 0.63, 0.74, 0.78,   0.80, 0.83, 0.94, 0.98],
    [1, 0.25, 0.25, 1,      1,    0.25, 0.25, 1,       1,    0.25, 0.25, 1,       1,    0.25, 0.25, 1,       1,    0.25, 0.25, 0.25]
  );
  const smoothBrightness = useSpring(canvasBrightness, { stiffness: 120, damping: 30 });
  const canvasFilter = useTransform(smoothBrightness, (v) => `brightness(${v})`);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative"
      style={{ height: "1000vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Canvas — dims when text is active */}
        <motion.div className="absolute inset-0" style={{ filter: canvasFilter }}>
          <HeartScene scrollProgress={scrollYProgress} />
        </motion.div>

        {/* Text overlays */}
        <div className="absolute inset-0 z-10">

        {/* Act 1: 0.00–0.18 (fade 0.00–0.04, hold 0.04–0.14, fade 0.14–0.18) */}
        <ScrollText
          scrollProgress={scrollYProgress}
          fadeIn={[0.00, 0.04]}
          fadeOut={[0.14, 0.18]}
          className="inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <span className="text-xs font-heading tracking-[0.4em] text-primary mb-6 block uppercase">
            {t("slogan.label")}
          </span>
          <SplitText
            text={t("slogan.headline")}
            scrollProgress={scrollYProgress}
            start={0.00}
            end={0.04}
            tag="h2"
            splitBy="chars"
            className="font-heading tracking-tight leading-[0.9] text-white whitespace-nowrap"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          />
          <div className="w-12 h-px bg-primary/40 mx-auto mt-8 mb-6" />
          <SplitText
            text={t("slogan.body")}
            scrollProgress={scrollYProgress}
            start={0.02}
            end={0.05}
            tag="p"
            splitBy="words"
            className="text-xl lg:text-2xl text-white/70 max-w-lg mx-auto leading-relaxed"
          />
        </ScrollText>

        {/* Act 2: 0.20–0.38 (fade 0.20–0.24, hold 0.24–0.34, fade 0.34–0.38) */}
        <ScrollText
          scrollProgress={scrollYProgress}
          fadeIn={[0.20, 0.24]}
          fadeOut={[0.34, 0.38]}
          className="inset-y-0 right-0 w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24"
        >
          <span className="text-xs font-heading tracking-[0.4em] text-primary mb-4 block uppercase">
            {t("origin.label")}
          </span>
          <SplitText
            text={t("origin.headline")}
            scrollProgress={scrollYProgress}
            start={0.20}
            end={0.24}
            tag="h3"
            splitBy="chars"
            className="font-heading tracking-tight leading-none mb-6 text-white whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          />
          <div className="w-10 h-px bg-white/20 mb-6" />
          <SplitText
            text={t("origin.body")}
            scrollProgress={scrollYProgress}
            start={0.22}
            end={0.25}
            tag="p"
            splitBy="words"
            className="text-xl lg:text-2xl text-white/70 max-w-md leading-relaxed"
          />
        </ScrollText>

        {/* Act 3: 0.40–0.58 (fade 0.40–0.44, hold 0.44–0.54, fade 0.54–0.58) */}
        <ScrollText
          scrollProgress={scrollYProgress}
          fadeIn={[0.40, 0.44]}
          fadeOut={[0.54, 0.58]}
          className="inset-y-0 left-0 w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24"
        >
          <span className="text-xs font-heading tracking-[0.4em] text-primary mb-4 block uppercase">
            {t("growth.label")}
          </span>
          <SplitText
            text={t("growth.headline")}
            scrollProgress={scrollYProgress}
            start={0.40}
            end={0.44}
            tag="h3"
            splitBy="chars"
            className="font-heading tracking-tight leading-none mb-6 text-white whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          />
          <div className="w-10 h-px bg-white/20 mb-6" />
          <SplitText
            text={t("growth.body")}
            scrollProgress={scrollYProgress}
            start={0.42}
            end={0.45}
            tag="p"
            splitBy="words"
            className="text-xl lg:text-2xl text-white/70 max-w-md leading-relaxed"
          />
        </ScrollText>

        {/* Act 4: 0.60–0.78 (fade 0.60–0.64, hold 0.64–0.74, fade 0.74–0.78) */}
        <ScrollText
          scrollProgress={scrollYProgress}
          fadeIn={[0.60, 0.64]}
          fadeOut={[0.74, 0.78]}
          className="inset-0 flex flex-col items-center justify-end pb-[15vh] text-center px-6"
        >
          <span className="text-xs font-heading tracking-[0.4em] text-primary mb-4 block uppercase">
            {t("mission.label")}
          </span>
          <SplitText
            text={t("mission.headline")}
            scrollProgress={scrollYProgress}
            start={0.60}
            end={0.64}
            tag="h3"
            splitBy="chars"
            className="font-heading tracking-tight leading-none mb-5 text-white whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          />
          <SplitText
            text={t("mission.body")}
            scrollProgress={scrollYProgress}
            start={0.62}
            end={0.65}
            tag="p"
            splitBy="words"
            className="text-xl lg:text-2xl text-white/70 max-w-lg mx-auto leading-relaxed"
          />
        </ScrollText>

        {/* Act 5: 0.80–0.98 (fade 0.80–0.84, hold 0.84–0.94, fade 0.94–0.98) */}
        <ScrollText
          scrollProgress={scrollYProgress}
          fadeIn={[0.80, 0.84]}
          fadeOut={[0.94, 0.98]}
          className="inset-0 flex flex-col items-center justify-end pb-[12vh] text-center px-6"
        >
          <span className="text-xs font-heading tracking-[0.4em] text-primary mb-4 block uppercase">
            {t("positioning.label")}
          </span>
          <SplitText
            text={t("positioning.headline")}
            scrollProgress={scrollYProgress}
            start={0.80}
            end={0.84}
            tag="h3"
            splitBy="chars"
            className="font-heading tracking-tight leading-[0.95] mb-5 text-white whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          />
          <div className="w-12 h-px bg-primary/40 mx-auto mb-5" />
          <SplitText
            text={t("positioning.body")}
            scrollProgress={scrollYProgress}
            start={0.82}
            end={0.85}
            tag="p"
            splitBy="words"
            className="text-xl lg:text-2xl text-white/70 max-w-lg mx-auto leading-relaxed"
          />
        </ScrollText>

        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-[9px] font-heading tracking-[0.35em] text-foreground/30 mb-2">
            SCROLL
          </span>
          <div className="w-px h-8 bg-foreground/10 relative overflow-hidden">
            <motion.div
              className="w-full bg-primary/50"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: "40%" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
