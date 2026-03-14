"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

export function AboutPrinciples() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const items = t.raw("principles.items") as { title: string; description: string }[];

  return (
    <section ref={ref} className="relative z-10 bg-black/85 backdrop-blur-sm py-fluid-section overflow-hidden">
      <Container className="relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
          style={{ marginBottom: "var(--space-xs)" }}
        >
          {t("principles.label")}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-heading tracking-tight text-white leading-[1.3]"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)", marginBottom: "var(--space-xl)" }}
        >
          {t("principles.title")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid-md">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="group relative border border-white/[0.06] p-5 sm:p-8 hover:border-primary/20 transition-colors duration-500"
            >
              {/* Number */}
              <span className="text-fluid-4xl font-heading text-white/[0.06] leading-none block mb-4">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="text-fluid-lg font-heading text-white mb-2">
                {item.title}
              </h3>

              <p className="text-fluid-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                {item.description}
              </p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
