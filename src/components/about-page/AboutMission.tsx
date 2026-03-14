"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

export function AboutMission() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative z-10 bg-black/85 backdrop-blur-sm py-fluid-section overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-fluid-xl">
          {/* Left: label + large quote */}
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
              style={{ marginBottom: "var(--space-md)" }}
            >
              {t("mission.label")}
            </motion.span>

            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative"
            >
              <span
                className="absolute -top-6 -left-3 text-primary/10 font-heading leading-none select-none"
                style={{ fontSize: "clamp(4rem, 8vw, 8rem)" }}
              >
                &ldquo;
              </span>
              <p
                className="font-heading text-white leading-[1.35] tracking-tight relative z-10"
                style={{ fontSize: "clamp(1.125rem, 2.2vw, 2.2rem)" }}
              >
                {t("mission.text")}
              </p>
            </motion.blockquote>
          </div>

          {/* Right: description */}
          <div className="lg:col-span-7 flex items-end">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-fluid-base text-white/50 leading-relaxed lg:max-w-xl lg:ml-auto"
            >
              {t("mission.description")}
            </motion.p>
          </div>
        </div>
      </Container>
    </section>
  );
}
