"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface ExpertiseResultProps {
  category: string;
}

export function ExpertiseResult({ category }: ExpertiseResultProps) {
  const t = useTranslations("expertise");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden">
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
            style={{ marginBottom: "var(--space-lg)" }}
          >
            {t("resultLabel")}
          </motion.span>

          {/* Large quote-style result */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative"
          >
            {/* Decorative quote marks */}
            <span
              className="absolute -top-8 -left-4 text-primary/10 font-heading leading-none select-none"
              style={{ fontSize: "clamp(4rem, 8vw, 8rem)" }}
            >
              &ldquo;
            </span>

            <p
              className="font-heading text-white leading-[1.3] tracking-tight relative z-10"
              style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
            >
              {t(`${category}.result`)}
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
