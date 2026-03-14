"use client";

import { Link } from "@/i18n/navigation";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "../layout";

interface ServiceHeroProps {
  namespace: string;
  image: string;
}

export function ServiceHero({ namespace, image }: ServiceHeroProps) {
  const t = useTranslations(namespace);

  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 600], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-black flex items-end pt-20 sm:pt-0 pb-24 sm:pb-0">
      <motion.div style={{ y: heroImgY }} className="absolute inset-0">
        <Image
          src={image}
          alt={t("hero.label")}
          fill
          className="object-cover scale-110 origin-center"
          priority
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />

      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="hero-svc-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-svc-noise)" />
        </svg>
      </div>

      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 w-full">
        <Container>
          <div style={{ paddingBottom: "var(--space-xl)" }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
              style={{ marginBottom: "var(--space-md)" }}
            >
              {t("hero.label")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading tracking-tight text-white leading-[1.2]"
              style={{ fontSize: "clamp(1.75rem, 4.5vw, 4rem)", marginBottom: "var(--space-xs)" }}
            >
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-fluid-lg text-white/50 max-w-2xl"
              style={{ marginBottom: "var(--space-lg)" }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/contacts"
                className="group inline-flex items-center gap-3 bg-primary text-white font-heading tracking-wider px-6 py-3 sm:px-8 sm:py-4 text-fluid-sm hover:bg-primary/90 transition-colors"
              >
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
