"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface SecurityApproachProps {
  namespace: string;
}

type ApproachItem = {
  title: string;
  description: string;
};

export function SecurityApproach({ namespace }: SecurityApproachProps) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const items = t.raw("approach.items") as ApproachItem[];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="security-approach-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#security-approach-noise)" />
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
            {t("approach.label")}
          </span>
          <h2
            className="font-heading tracking-tight text-black"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)", marginBottom: "var(--space-xs)" }}
          >
            {t("approach.title")}
          </h2>
          <p className="text-fluid-lg text-black/50 max-w-2xl">
            {t("approach.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-sm">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex gap-[clamp(1rem,2vw,1.5rem)] border border-black/10 hover:border-primary/30 transition-colors duration-500"
              style={{ padding: "clamp(1.25rem, 3vw, 2rem)" }}
            >
              <span
                className="font-heading text-primary/25 leading-none shrink-0"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                0{i + 1}
              </span>
              <div>
                <h3
                  className="font-heading tracking-wide text-black leading-tight"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)", marginBottom: "clamp(0.375rem, 0.8vw, 0.625rem)" }}
                >
                  {item.title}
                </h3>
                <p className="text-fluid-sm text-black/40 group-hover:text-black/60 transition-colors duration-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
