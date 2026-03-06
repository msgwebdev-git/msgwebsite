"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface VideoStatsProps {
  namespace: string;
}

type StatItem = {
  value: string;
  label: string;
  description: string;
};

export function VideoStats({ namespace }: VideoStatsProps) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const items = t.raw("stats.items") as StatItem[];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="video-stats-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#video-stats-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "var(--space-xl)" }}
        >
          <span
            className="text-fluid-xs font-heading tracking-[0.4em] text-white/40 uppercase block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("stats.label")}
          </span>
          <h2
            className="font-heading tracking-tight text-white"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
          >
            {t("stats.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-fluid-md">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="border-t-2 border-primary/40"
              style={{ paddingTop: "clamp(1rem, 2vw, 1.5rem)" }}
            >
              <span
                className="font-heading text-white leading-none block"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
              >
                {item.value}
              </span>
              <span
                className="font-heading tracking-wider text-white/60 uppercase block"
                style={{ fontSize: "clamp(0.7rem, 1vw, 0.85rem)", marginTop: "clamp(0.5rem, 1vw, 0.75rem)" }}
              >
                {item.label}
              </span>
              <p
                className="text-fluid-xs text-white/30 leading-relaxed"
                style={{ marginTop: "clamp(0.25rem, 0.5vw, 0.5rem)" }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
