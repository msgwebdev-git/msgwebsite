"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "../layout";

interface TurnkeyFaqProps {
  namespace: string;
}

type FaqItem = {
  question: string;
  answer: string;
};

export function TurnkeyFaq({ namespace }: TurnkeyFaqProps) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const items = t.raw("faq.items") as FaqItem[];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="tk-faq-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tk-faq-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-fluid-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <span
              className="text-fluid-xs font-heading tracking-[0.4em] text-white/40 uppercase block"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              {t("faq.label")}
            </span>
            <h2
              className="font-heading tracking-tight text-white"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
            >
              {t("faq.title")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-white/10"
                >
                  <AccordionTrigger className="text-left font-heading tracking-wide text-white hover:text-primary transition-colors py-5 cursor-pointer" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.125rem)" }}>
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-fluid-sm text-white/50 leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
