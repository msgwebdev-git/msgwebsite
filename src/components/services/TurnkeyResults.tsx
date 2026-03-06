"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface TurnkeyResultsProps {
  namespace: string;
}

type ResultItem = {
  value: string;
  label: string;
  description: string;
};

export function TurnkeyResults({ namespace }: TurnkeyResultsProps) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const items = t.raw("results.items") as ResultItem[];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="tk-results-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tk-results-noise)" />
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
            className="text-fluid-xs font-heading tracking-[0.4em] text-black/50 uppercase block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("results.label")}
          </span>
          <h2
            className="font-heading tracking-tight text-black"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
          >
            {t("results.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-fluid-md">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="border-t-2 border-primary/30"
              style={{ paddingTop: "var(--space-sm)" }}
            >
              <span
                className="font-heading text-primary leading-none block"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                {item.value}
              </span>
              <span
                className="font-heading tracking-wide text-black block"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
                  marginTop: "clamp(0.25rem, 0.5vw, 0.5rem)",
                }}
              >
                {item.label}
              </span>
              <p
                className="text-fluid-xs text-black/50 leading-relaxed"
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
