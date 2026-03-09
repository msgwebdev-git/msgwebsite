"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Container } from "../layout";

interface ExpertiseHeroProps {
  category: string;
  image: string;
}

export function ExpertiseHero({ category, image }: ExpertiseHeroProps) {
  const t = useTranslations("expertise");

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-black">
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={t(`${category}.title`)}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Large category title — centered, editorial style */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-fluid-xs font-heading tracking-[0.5em] text-white/60 uppercase block"
          style={{ marginBottom: "var(--space-sm)" }}
        >
          {t("sectionLabel")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-white leading-[1.15] tracking-tight uppercase"
          style={{ fontSize: "clamp(3rem, 10vw, 10rem)" }}
        >
          {t(`${category}.title`)}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-[2px] bg-primary origin-center"
          style={{ marginTop: "var(--space-md)", marginBottom: "var(--space-md)" }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-fluid-lg text-white/70 max-w-3xl leading-relaxed"
        >
          {t(`${category}.description`)}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0"
        />
      </motion.div>
    </section>
  );
}
