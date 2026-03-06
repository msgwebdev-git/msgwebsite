"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "./layout";

const stepKeys = ["brief", "concept", "planning", "execution", "report"] as const;

function StepCard({
  stepKey,
  index,
}: {
  stepKey: string;
  index: number;
}) {
  const t = useTranslations("process");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="process-step flex flex-col"
    >
      <span className="process-step-number font-heading text-primary/30 leading-none block">
        0{index + 1}
      </span>

      <div className="w-8 h-[2px] bg-primary/30" style={{ marginBlock: "clamp(0.75rem, 1.5vw, 1.25rem)" }} />

      <h3 className="process-step-title font-heading tracking-wide text-black leading-tight">
        {t(`${stepKey}.title`)}
      </h3>

      <p
        className="process-step-desc text-black/50 leading-relaxed"
        style={{ marginTop: "clamp(0.375rem, 0.8vw, 0.75rem)" }}
      >
        {t(`${stepKey}.description`)}
      </p>
    </motion.div>
  );
}

export function ProcessSection() {
  const t = useTranslations("process");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden"
    >
      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "var(--space-xl)" }}
        >
          <h2
            className="text-fluid-5xl font-heading tracking-tight text-black"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("title")}
          </h2>
          <p className="text-fluid-lg text-black/50 max-w-2xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-fluid-md">
          {stepKeys.map((key, i) => (
            <StepCard key={key} stepKey={key} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-fluid-sm"
          style={{ marginTop: "var(--space-xl)" }}
        >
          <a
            href="#contacts"
            className="group inline-flex items-center gap-3 bg-primary text-white font-heading tracking-wider px-8 py-4 text-fluid-sm hover:bg-primary/90 transition-colors"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
          <span className="text-fluid-xs text-black/40">
            {t("ctaHint")}
          </span>
        </motion.div>
      </Container>
    </section>
  );
}
