"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface DigitalStackProps {
  namespace: string;
}

type StackCategory = {
  title: string;
  tools: string[];
};

export function DigitalStack({ namespace }: DigitalStackProps) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const categories = t.raw("stack.items") as StackCategory[];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="digital-stack-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#digital-stack-noise)" />
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
            {t("stack.label")}
          </span>
          <h2
            className="font-heading tracking-tight text-black"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)", marginBottom: "var(--space-xs)" }}
          >
            {t("stack.title")}
          </h2>
          <p className="text-fluid-lg text-black/50 max-w-2xl">
            {t("stack.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-sm">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group border border-black/10 hover:border-primary/30 transition-colors duration-500"
              style={{ padding: "clamp(1.25rem, 3vw, 2rem)" }}
            >
              <h3
                className="font-heading tracking-wide text-black leading-tight"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)", marginBottom: "clamp(0.75rem, 1.5vw, 1rem)" }}
              >
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-fluid-xs font-heading tracking-wider text-black/35 group-hover:text-black/55 transition-colors duration-500 border border-black/10 group-hover:border-black/20 px-3 py-1.5"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
