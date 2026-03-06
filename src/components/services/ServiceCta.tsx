"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Container } from "../layout";

interface ServiceCtaProps {
  namespace: string;
}

export function ServiceCta({ namespace }: ServiceCtaProps) {
  const t = useTranslations(namespace);
  const ct = useTranslations("contact");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} id="contacts" className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="svc-cta-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#svc-cta-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-fluid-5xl font-heading tracking-tight text-white"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("cta.title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-fluid-xl text-white/50 max-w-xl"
            style={{ marginBottom: "var(--space-lg)" }}
          >
            {t("cta.subtitle")}
          </motion.p>

          <motion.a
            href="mailto:info@mediashowgrup.com"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group inline-flex items-center gap-3 bg-primary text-white font-heading tracking-wider px-10 py-5 text-fluid-sm hover:bg-primary/90 transition-colors"
            style={{ marginBottom: "var(--space-xl)" }}
          >
            {t("cta.button")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-fluid-md"
          >
            <a href="tel:+37322838539" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-fluid-sm font-heading tracking-wider">+(373 22) 83 85 39</span>
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <a href="mailto:info@mediashowgrup.com" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <span className="text-fluid-sm font-heading tracking-wider">info@mediashowgrup.com</span>
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-3 text-white/40">
              <MapPin className="w-4 h-4" />
              <span className="text-fluid-sm font-heading tracking-wider">{ct("addressValue")}</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
