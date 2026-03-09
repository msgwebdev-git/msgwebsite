"use client";

import { Link } from "@/i18n/navigation";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "../layout";

interface ServiceProcessProps {
  namespace: string;
}

export function ServiceProcess({ namespace }: ServiceProcessProps) {
  const t = useTranslations(namespace);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const steps = t.raw("process.steps") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="svc-process-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#svc-process-noise)" />
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
            {t("process.label")}
          </span>
          <h2
            className="text-fluid-5xl font-heading tracking-tight text-black"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("process.title")}
          </h2>
          <p className="text-fluid-lg text-black/50 max-w-2xl">
            {t("process.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-fluid-md">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="process-step flex flex-col"
            >
              <span className="process-step-number font-heading text-primary/30 leading-none block">
                0{i + 1}
              </span>
              <div
                className="w-8 h-[2px] bg-primary/30"
                style={{ marginBlock: "clamp(0.75rem, 1.5vw, 1.25rem)" }}
              />
              <h3 className="process-step-title font-heading tracking-wide text-black leading-tight">
                {step.title}
              </h3>
              <p
                className="process-step-desc text-black/50 leading-relaxed"
                style={{ marginTop: "clamp(0.375rem, 0.8vw, 0.75rem)" }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-fluid-sm"
          style={{ marginTop: "var(--space-xl)" }}
        >
          <Link
            href="/contacts"
            className="group inline-flex items-center gap-3 bg-primary text-white font-heading tracking-wider px-8 py-4 text-fluid-sm hover:bg-primary/90 transition-colors"
          >
            {t("process.cta")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
