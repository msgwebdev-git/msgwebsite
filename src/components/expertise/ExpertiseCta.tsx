"use client";

import { Link } from "@/i18n/navigation";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Container } from "../layout";

export function ExpertiseCta() {
  const t = useTranslations("expertise");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative z-10 bg-primary py-fluid-section overflow-hidden">
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-fluid-lg">
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="font-heading tracking-tight text-white whitespace-nowrap"
              style={{ fontSize: "clamp(2rem, 5vw, 6rem)", marginBottom: "var(--space-xs)" }}
            >
              {t("ctaTitle")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-fluid-lg text-white/70"
            >
              {t("ctaSubtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <Link
              href="/contacts"
              className="group flex items-center justify-between bg-white text-black font-heading tracking-wider px-10 py-5 text-fluid-sm hover:bg-white/90 transition-colors w-full"
            >
              {t("ctaButton")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-6">
              <a href="tel:+37322838539" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-fluid-sm font-heading tracking-wider">+(373 22) 83 85 39</span>
              </a>
              <a href="mailto:info@mediashowgrup.com" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-fluid-sm font-heading tracking-wider">info@mediashowgrup.com</span>
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
