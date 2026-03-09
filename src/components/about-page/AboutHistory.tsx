"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { Container } from "../layout";

function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: { year: string; title: string; description: string };
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const isEven = index % 2 === 0;

  /* ── Mobile: single-column left-aligned timeline ── */
  const mobileLayout = (
    <div className="relative grid grid-cols-[auto_1fr] gap-0 items-start sm:hidden">
      {/* Left: dot + line */}
      <div className="relative flex flex-col items-center w-8">
        {index > 0 && <div className="w-[1px] h-6 bg-black/10" />}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex-shrink-0 my-1"
        >
          <div className="w-3 h-3 rounded-full bg-primary ring-3 ring-[#FAFAF9]" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-[1px] flex-1 bg-black/10 origin-top"
          />
        )}
      </div>

      {/* Right: content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="py-4 pl-3"
      >
        <span className="font-heading text-primary leading-none tracking-tight block text-xl mb-1">
          {item.year}
        </span>
        <h3 className="font-heading text-black leading-tight tracking-tight text-base mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-black/45 leading-relaxed">
          {item.description}
        </p>
      </motion.div>
    </div>
  );

  /* ── Desktop: alternating left/right timeline ── */
  const desktopLayout = (
    <div className="relative hidden sm:grid grid-cols-[1fr_auto_1fr] gap-0 items-start">
      {/* Left side */}
      <div className={`py-8 ${isEven ? "pr-8 lg:pr-16" : ""}`}>
        {isEven ? (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-right"
          >
            <span
              className="font-heading text-primary leading-none tracking-tight block"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)", marginBottom: "0.5rem" }}
            >
              {item.year}
            </span>
            <h3
              className="font-heading text-black leading-tight tracking-tight"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.35rem)", marginBottom: "0.35rem" }}
            >
              {item.title}
            </h3>
            <p className="text-fluid-sm text-black/45 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ) : (
          <div />
        )}
      </div>

      {/* Center: dot + line */}
      <div className="relative flex flex-col items-center w-12">
        {index > 0 && <div className="w-[1px] h-8 bg-black/10" />}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex-shrink-0 my-1"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-[#FAFAF9]" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute -inset-2.5 rounded-full border border-primary/20"
          />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-[1px] flex-1 bg-black/10 origin-top"
          />
        )}
      </div>

      {/* Right side */}
      <div className={`py-8 ${!isEven ? "pl-8 lg:pl-16" : ""}`}>
        {!isEven ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span
              className="font-heading text-primary leading-none tracking-tight block"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)", marginBottom: "0.5rem" }}
            >
              {item.year}
            </span>
            <h3
              className="font-heading text-black leading-tight tracking-tight"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.35rem)", marginBottom: "0.35rem" }}
            >
              {item.title}
            </h3>
            <p className="text-fluid-sm text-black/45 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      {mobileLayout}
      {desktopLayout}
    </div>
  );
}

export function AboutHistory() {
  const t = useTranslations("aboutPage");
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const items = t.raw("history.items") as { year: string; title: string; description: string }[];

  // Scroll-driven progress line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative z-10 py-fluid-section overflow-hidden">
      {/* Background — below 3D */}
      <div className="absolute inset-0 z-[1] bg-[#FAFAF9]" />
      {/* Subtle noise */}
      <div className="absolute inset-0 pointer-events-none z-[2] opacity-[0.06] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="about-history-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#about-history-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "var(--space-xl)" }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("history.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading tracking-tight text-black leading-[1.3]"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)", marginBottom: "var(--space-sm)" }}
          >
            {t("history.title")}
          </motion.h2>

          {/* Year range pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="inline-flex items-center gap-3"
          >
            <span className="font-heading text-black/30 tracking-tight" style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}>
              {items[0]?.year}
            </span>
            <div className="w-10 h-[1px] bg-black/15" />
            <span className="font-heading text-primary tracking-tight" style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}>
              {items[items.length - 1]?.year}
            </span>
          </motion.div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto">
          {/* Scroll-driven progress line (behind the dots) */}
          <div className="absolute left-[15px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-black/[0.06]">
            <motion.div
              className="absolute top-0 left-0 w-full bg-primary/40 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {items.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} isLast={i === items.length - 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}
