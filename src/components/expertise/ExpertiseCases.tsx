"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";
import { MapPin } from "lucide-react";

interface ExpertiseCasesProps {
  category: string;
}

export function ExpertiseCases({ category }: ExpertiseCasesProps) {
  const t = useTranslations("expertise");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const cases = t.raw(`${category}.cases`) as { name: string; venue: string }[];

  return (
    <section ref={ref} className="relative z-10 bg-[#111111] py-fluid-section overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.2] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="exp-cases-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#exp-cases-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
          style={{ marginBottom: "var(--space-xs)" }}
        >
          {t("casesLabel")}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)", marginBottom: "var(--space-lg)" }}
        >
          {t(`${category}.title`)}
        </motion.h2>

        {/* Cases as horizontal scrollable cards on mobile, grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-md">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="group relative border border-white/[0.08] p-8 hover:border-primary/30 transition-colors duration-500"
            >
              {/* Number accent */}
              <span className="absolute top-4 right-4 text-fluid-xs font-heading text-white/10 tracking-wider">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="text-fluid-lg font-heading text-white leading-tight" style={{ marginBottom: "var(--space-xs)" }}>
                {c.name}
              </h3>

              <div className="flex items-center gap-2 text-white/40">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-fluid-sm">{c.venue}</span>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
