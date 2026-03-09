"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface ExpertiseScopeProps {
  category: string;
}

export function ExpertiseScope({ category }: ExpertiseScopeProps) {
  const t = useTranslations("expertise");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const items = t.raw(`${category}.whatWeDo`) as string[];

  return (
    <section ref={ref} className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden">
      <Container className="relative z-10">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between" style={{ marginBottom: "var(--space-xl)" }}>
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              {t("scopeLabel")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading tracking-tight text-white"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
            >
              {t("whatWeDoLabel")}
            </motion.h2>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block flex-1 h-[1px] bg-white/10 origin-left ml-12"
          />
        </div>

        {/* Numbered items in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[var(--gap-xl)] gap-y-0">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              className="group flex items-start gap-6 border-b border-white/[0.06] py-6"
            >
              <span
                className="text-fluid-3xl font-heading text-white/[0.08] leading-none flex-shrink-0 tabular-nums"
                style={{ minWidth: "2.5em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-fluid-base text-white/70 leading-relaxed pt-1 group-hover:text-white transition-colors duration-300">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
