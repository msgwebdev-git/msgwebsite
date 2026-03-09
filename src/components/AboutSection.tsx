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
import { useIsMobile } from "@/hooks/use-mobile";

const HeartScene = dynamic(() => import("./about/HeartScene"), {
  ssr: false,
});

/* ─── Act text block ─── */
function ActText({
  scrollProgress,
  fadeIn,
  fadeOut,
  children,
  align = "left",
  isMobile = false,
}: {
  scrollProgress: MotionValue<number>;
  fadeIn: [number, number];
  fadeOut: [number, number];
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  isMobile?: boolean;
}) {
  const opacity = useTransform(
    scrollProgress,
    [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollProgress,
    [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]],
    [60, 0, 0, -30]
  );

  const smoothOpacity = useSpring(opacity, { stiffness: 150, damping: 35 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 30 });

  const mobileAlign = "items-center text-center left-0 right-0";
  const desktopAlign =
    align === "right"
      ? "items-end text-left right-0"
      : align === "center"
        ? "items-center text-center left-0 right-0"
        : "items-start text-left left-0";

  return (
    <motion.div
      className={`absolute inset-y-0 flex flex-col justify-center pointer-events-none z-10 px-5 sm:px-8 lg:px-[6vw] ${isMobile ? mobileAlign : desktopAlign}`}
      style={{ opacity: smoothOpacity, y: smoothY }}
    >
      <div style={{ maxWidth: isMobile ? "85vw" : "35vw" }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Animated line by line ─── */
function RevealText({
  text,
  scrollProgress,
  start,
  end,
  className = "",
  tag: Tag = "p",
  style,
}: {
  text: string;
  scrollProgress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
  tag?: "h2" | "h3" | "p" | "span";
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  const range = end - start;

  return (
    <Tag className={className} style={style}>
      {words.map((word, i) => {
        const stagger = range / words.length;
        const enterAt = start + i * stagger;
        const fullAt = Math.min(enterAt + stagger * 4, end);

        return (
          <RevealWord
            key={`${i}-${word}`}
            word={word}
            scrollProgress={scrollProgress}
            enterAt={enterAt}
            fullAt={fullAt}
            addSpace={i < words.length - 1}
          />
        );
      })}
    </Tag>
  );
}

function RevealWord({
  word,
  scrollProgress,
  enterAt,
  fullAt,
  addSpace,
}: {
  word: string;
  scrollProgress: MotionValue<number>;
  enterAt: number;
  fullAt: number;
  addSpace: boolean;
}) {
  const opacity = useTransform(scrollProgress, [enterAt, fullAt], [0.15, 1]);
  const smoothOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });

  return (
    <motion.span
      className="inline-block"
      style={{ opacity: smoothOpacity, marginRight: addSpace ? "0.3em" : 0 }}
    >
      {word}
    </motion.span>
  );
}

/* ─── Font size helpers ─── */
const mobileLabelSize = "clamp(0.65rem, 2.5vw, 0.875rem)";
const desktopLabelSize = "clamp(0.65rem, 0.8vw, 1rem)";
const mobileHeadlineSize = "clamp(1.75rem, 7vw, 2.5rem)";
const desktopHeadlineSize = "clamp(2rem, 3.5vw, 4.5rem)";
const mobileHeroHeadlineSize = "clamp(2rem, 8vw, 3rem)";
const desktopHeroHeadlineSize = "clamp(2.5rem, 5.5vw, 7rem)";
const mobileBodySize = "clamp(0.875rem, 3.5vw, 1.125rem)";
const desktopBodySize = "clamp(0.95rem, 1.15vw, 1.35rem)";
const mobileDividerWidth = "10vw";
const desktopDividerWidth = "2.5vw";
const mobileSpacing = "3vw";
const desktopSpacing = "1.2vw";

/* ─── Main Section ─── */
export function AboutSection() {
  const t = useTranslations("aboutSection.story");
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [0.5, 0]);

  // Model brightness: dims more on mobile so text is readable over centered model
  const canvasBrightness = useTransform(
    scrollYProgress,
    [
      0, 0.04, 0.14, 0.18,
      0.20, 0.24, 0.34, 0.38,
      0.40, 0.44, 0.54, 0.58,
      0.60, 0.64, 0.74, 0.78,
      0.80, 0.84, 0.94, 0.98,
    ],
    isMobile
      ? [
          1, 0.3, 0.3, 1,
          1, 0.3, 0.3, 1,
          1, 0.3, 0.3, 1,
          1, 0.3, 0.3, 1,
          1, 0.3, 0.3, 0.3,
        ]
      : [
          1, 0.5, 0.5, 1,
          1, 0.5, 0.5, 1,
          1, 0.5, 0.5, 1,
          1, 0.5, 0.5, 1,
          1, 0.5, 0.5, 0.5,
        ]
  );
  const smoothBrightness = useSpring(canvasBrightness, { stiffness: 120, damping: 30 });
  const canvasFilter = useTransform(smoothBrightness, (v) => `brightness(${v})`);

  const lbl = isMobile ? mobileLabelSize : desktopLabelSize;
  const hdl = isMobile ? mobileHeadlineSize : desktopHeadlineSize;
  const heroHdl = isMobile ? mobileHeroHeadlineSize : desktopHeroHeadlineSize;
  const bdy = isMobile ? mobileBodySize : desktopBodySize;
  const dvd = isMobile ? mobileDividerWidth : desktopDividerWidth;
  const spc = isMobile ? mobileSpacing : desktopSpacing;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative"
      style={{ height: isMobile ? "600vh" : "1000vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Canvas */}
        <motion.div className="absolute inset-0" style={{ filter: canvasFilter }}>
          <HeartScene scrollProgress={scrollYProgress} isMobile={isMobile} />
        </motion.div>

        {/* ── Act 1: Centered hero statement ── */}
        <ActText
          scrollProgress={scrollYProgress}
          fadeIn={[0.00, 0.04]}
          fadeOut={[0.14, 0.18]}
          align="center"
          isMobile={isMobile}
        >
          <span className="font-heading tracking-[0.4em] text-primary block uppercase" style={{ fontSize: lbl, marginBottom: spc }}>
            {t("slogan.label")}
          </span>
          <RevealText
            text={t("slogan.headline")}
            scrollProgress={scrollYProgress}
            start={0.00}
            end={0.04}
            tag="h2"
            className="font-heading tracking-tight leading-[0.9] text-white"
            style={{ fontSize: heroHdl, marginBottom: spc }}
          />
          <div className="h-px bg-primary/40 mx-auto" style={{ width: dvd, marginBottom: spc }} />
          <RevealText
            text={t("slogan.body")}
            scrollProgress={scrollYProgress}
            start={0.02}
            end={0.06}
            tag="p"
            className="text-white/60 leading-relaxed" style={{ fontSize: bdy }}
          />
        </ActText>

        {/* ── Act 2: Text right, model left ── */}
        <ActText
          scrollProgress={scrollYProgress}
          fadeIn={[0.20, 0.24]}
          fadeOut={[0.34, 0.38]}
          align="right"
          isMobile={isMobile}
        >
          <span className="font-heading tracking-[0.4em] text-primary block uppercase" style={{ fontSize: lbl, marginBottom: spc }}>
            {t("origin.label")}
          </span>
          <RevealText
            text={t("origin.headline")}
            scrollProgress={scrollYProgress}
            start={0.20}
            end={0.24}
            tag="h3"
            className="font-heading tracking-tight leading-none text-white"
            style={{ fontSize: hdl, marginBottom: spc }}
          />
          <div className="h-px bg-white/20" style={{ width: dvd, marginBottom: spc }} />
          <RevealText
            text={t("origin.body")}
            scrollProgress={scrollYProgress}
            start={0.22}
            end={0.26}
            tag="p"
            className="text-white/60 leading-relaxed" style={{ fontSize: bdy }}
          />
        </ActText>

        {/* ── Act 3: Text left, model right ── */}
        <ActText
          scrollProgress={scrollYProgress}
          fadeIn={[0.40, 0.44]}
          fadeOut={[0.54, 0.58]}
          align="left"
          isMobile={isMobile}
        >
          <span className="font-heading tracking-[0.4em] text-primary block uppercase" style={{ fontSize: lbl, marginBottom: spc }}>
            {t("growth.label")}
          </span>
          <RevealText
            text={t("growth.headline")}
            scrollProgress={scrollYProgress}
            start={0.40}
            end={0.44}
            tag="h3"
            className="font-heading tracking-tight leading-none text-white"
            style={{ fontSize: hdl, marginBottom: spc }}
          />
          <div className="h-px bg-white/20" style={{ width: dvd, marginBottom: spc }} />
          <RevealText
            text={t("growth.body")}
            scrollProgress={scrollYProgress}
            start={0.42}
            end={0.46}
            tag="p"
            className="text-white/60 leading-relaxed" style={{ fontSize: bdy }}
          />
        </ActText>

        {/* ── Act 4: Centered bottom ── */}
        <ActText
          scrollProgress={scrollYProgress}
          fadeIn={[0.60, 0.64]}
          fadeOut={[0.74, 0.78]}
          align="center"
          isMobile={isMobile}
        >
          <span className="font-heading tracking-[0.4em] text-primary block uppercase" style={{ fontSize: lbl, marginBottom: spc }}>
            {t("mission.label")}
          </span>
          <RevealText
            text={t("mission.headline")}
            scrollProgress={scrollYProgress}
            start={0.60}
            end={0.64}
            tag="h3"
            className="font-heading tracking-tight leading-none text-white"
            style={{ fontSize: isMobile ? mobileHeroHeadlineSize : "clamp(2rem, 4vw, 5.5rem)", marginBottom: spc }}
          />
          <RevealText
            text={t("mission.body")}
            scrollProgress={scrollYProgress}
            start={0.62}
            end={0.66}
            tag="p"
            className="text-white/60 leading-relaxed" style={{ fontSize: bdy }}
          />
        </ActText>

        {/* ── Act 5: Final centered ── */}
        <ActText
          scrollProgress={scrollYProgress}
          fadeIn={[0.80, 0.84]}
          fadeOut={[0.94, 0.98]}
          align="center"
          isMobile={isMobile}
        >
          <span className="font-heading tracking-[0.4em] text-primary block uppercase" style={{ fontSize: lbl, marginBottom: spc }}>
            {t("positioning.label")}
          </span>
          <RevealText
            text={t("positioning.headline")}
            scrollProgress={scrollYProgress}
            start={0.80}
            end={0.84}
            tag="h3"
            className="font-heading tracking-tight leading-[0.95] text-white"
            style={{ fontSize: isMobile ? mobileHeroHeadlineSize : "clamp(2rem, 4.5vw, 4rem)", marginBottom: spc }}
          />
          <div className="h-px bg-primary/40 mx-auto" style={{ width: dvd, marginBottom: spc }} />
          <RevealText
            text={t("positioning.body")}
            scrollProgress={scrollYProgress}
            start={0.82}
            end={0.86}
            tag="p"
            className="text-white/60 leading-relaxed" style={{ fontSize: bdy }}
          />
        </ActText>

        {/* Scroll hint */}
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
