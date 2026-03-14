"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Container } from "../layout";
import { useIsMobile } from "@/hooks/use-mobile";

const AboutHeroHeart = dynamic(
  () => import("./AboutHeroHeart"),
  { ssr: false }
);

export function AboutHero() {
  const t = useTranslations("aboutPage");
  const st = useTranslations("stats");
  const isMobile = useIsMobile();

  return (
    <section className="relative z-10 min-h-[100dvh] flex items-end pb-10 sm:pb-16 lg:pb-24 pt-20 sm:pt-0 overflow-hidden">
      {/* Mobile-only: static 3D heart as hero background */}
      {isMobile && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <AboutHeroHeart />
          </Suspense>
        </div>
      )}
      {/* Dark overlay to ensure text readability over 3D scene */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      <Container className="relative z-[2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-fluid-lg items-end">
          {/* Main content */}
          <div className="lg:col-span-8">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-fluid-xs font-heading tracking-[0.5em] text-primary uppercase block"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              {t("hero.label")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-white leading-[1.15] tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 5vw, 5rem)" }}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-[2px] bg-primary origin-left"
              style={{ marginTop: "var(--space-md)", marginBottom: "var(--space-md)" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-fluid-lg text-white/50 max-w-xl"
            >
              {t("hero.subtitle")}
            </motion.p>
          </div>

          {/* Stats column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="flex flex-row lg:flex-col gap-4 sm:gap-8"
            >
              {[
                { value: st("yearsValue"), label: st("years") },
                { value: st("projectsValue"), label: st("projects") },
                { value: st("clientsValue"), label: st("clients") },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="border-l-2 border-primary/40 pl-5"
                >
                  <span
                    className="font-heading text-white block leading-none"
                    style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
                  >
                    {stat.value}+
                  </span>
                  <span className="text-fluid-xs text-white/30 font-heading tracking-wider mt-1 block uppercase">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-white/0 via-white/40 to-white/0"
        />
      </motion.div>
    </section>
  );
}
