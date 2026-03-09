"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface ServiceFeaturesProps {
  namespace: string;
}

type FeatureItem = {
  title: string;
  description: string;
};

export function ServiceFeatures({ namespace }: ServiceFeaturesProps) {
  const t = useTranslations(namespace);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const items = t.raw("features.items") as FeatureItem[];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="svc-features-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#svc-features-noise)" />
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
            className="text-fluid-xs font-heading tracking-[0.4em] text-white/60 block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("features.label")}
          </span>
          <h2
            className="font-heading tracking-tight text-white"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)",
              marginBottom: "var(--space-xs)",
            }}
          >
            {t("features.title")}
          </h2>
          <p className="text-fluid-lg text-white/60 max-w-2xl">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-sm">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="group relative border border-white/10 p-[clamp(1.25rem,3vw,2.5rem)] hover:border-primary/40 transition-colors duration-500"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 24px) 0, calc(100% - 24px) 24px, 100% 24px, 100% 100%, 0 100%)",
              }}
            >
              <span className="absolute top-0 right-0 w-6 h-6 bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500 flex items-center justify-center">
                <span className="text-[10px] font-heading text-white/60">
                  0{i + 1}
                </span>
              </span>
              <h3
                className="font-heading tracking-wide text-white leading-tight"
                style={{
                  fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                  marginBottom: "clamp(0.5rem, 1vw, 0.75rem)",
                }}
              >
                {item.title}
              </h3>
              <p className="text-fluid-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
