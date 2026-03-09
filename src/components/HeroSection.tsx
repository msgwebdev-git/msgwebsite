"use client";

import { Link } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { CutoutButton } from "./ui/cutout-button";
import { Container } from "./layout";

const LightRays = dynamic(() => import("./LightRays"), { ssr: false });

interface HeroSectionProps {
  startAnimations?: boolean;
}

export function HeroSection({ startAnimations = true }: HeroSectionProps) {
  const t = useTranslations("hero");
  const tStats = useTranslations("stats");

  const stats = [
    { value: tStats("yearsValue"), label: tStats("years"), suffix: "+" },
    { value: tStats("projectsValue"), label: tStats("projects"), suffix: "+" },
    { value: tStats("clientsValue"), label: tStats("clients"), suffix: "+" },
  ];

  return (
    <section className="relative min-h-[85vh] min-h-[85dvh] flex flex-col justify-center pt-20 lg:pt-24 pb-8 overflow-hidden">
      {/* Light Rays Background */}
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#FF4931"
          raysSpeed={1}
          lightSpread={1.2}
          rayLength={8}
          followMouse={true}
          mouseInfluence={0.3}
          noiseAmount={0}
          distortion={0}
          pulsating={true}
          fadeDistance={3}
          saturation={1.5}
        />
      </div>
      <Container className="relative z-10 flex-1 flex flex-col">
        {/* Border Frame with Logo Shape */}
        <div className="relative flex-1 flex flex-col justify-center px-5 py-3 pt-20 sm:p-8 lg:p-16">
          {/* Custom border lines */}
          {/* Left */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={startAnimations ? { scaleY: 1 } : false}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute left-0 top-0 bottom-0 w-px bg-foreground origin-top"
          />
          {/* Top (partial - stops before cutout) */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={startAnimations ? { scaleX: 1 } : false}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-0 left-0 right-[72px] sm:right-[140px] lg:right-[184px] h-px bg-foreground origin-left"
          />
          {/* Bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={startAnimations ? { scaleX: 1 } : false}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 h-px bg-foreground origin-left"
          />
          {/* Right (partial - starts after cutout) */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={startAnimations ? { scaleY: 1 } : false}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute right-0 top-[72px] sm:top-[140px] lg:top-[184px] bottom-0 w-px bg-foreground origin-top"
          />
          {/* Cutout horizontal line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={startAnimations ? { scaleX: 1 } : false}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute top-[72px] sm:top-[140px] lg:top-[184px] right-0 w-[72px] sm:w-[140px] lg:w-[184px] h-px bg-foreground origin-right"
          />
          {/* Cutout vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={startAnimations ? { scaleY: 1 } : false}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute top-0 right-[72px] sm:right-[140px] lg:right-[184px] h-[72px] sm:h-[140px] lg:h-[184px] w-px bg-foreground origin-top"
          />

          {/* Square button */}
          <motion.a
            href="#showreel"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={startAnimations ? { opacity: 1, scale: 1 } : false}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "absolute top-0 right-0 overflow-hidden",
              "w-[56px] h-[56px] sm:w-[120px] sm:h-[120px] lg:w-[160px] lg:h-[160px]",
              "bg-foreground flex flex-col items-center justify-center gap-1 sm:gap-2",
              "cursor-pointer group"
            )}
          >
            {/* Hover sweep overlay */}
            <span
              className={cn(
                "absolute inset-0 bg-primary",
                "origin-bottom scale-y-0 group-hover:scale-y-100",
                "transition-transform duration-500 ease-out"
              )}
            />
            {/* Triangle play icon */}
            <svg
              className="relative z-10 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 transition-all duration-500 group-hover:scale-125 text-background group-hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6,4 20,12 6,20" />
            </svg>
            <span className="relative z-10 hidden sm:block text-[10px] lg:text-fluid-xs font-heading tracking-wider text-center leading-tight text-background group-hover:text-white transition-colors duration-500">
              {t("watchReel")}
            </span>
          </motion.a>

          {/* Main Content - Centered */}
          <div className="text-center sm:text-center">
          {/* Animated Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={startAnimations ? { y: 0, opacity: 1 } : false}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-fluid-hero font-heading leading-[0.95] tracking-tight"
            >
              {t("titleLine1")}
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-6 sm:mb-8 lg:mb-10">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={startAnimations ? { y: 0, opacity: 1 } : false}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-fluid-hero font-heading leading-[0.95] tracking-tight"
            >
              {t("titleLine2")}
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={startAnimations ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-fluid-base sm:text-fluid-lg lg:text-fluid-xl text-muted-foreground mb-8 sm:mb-10 lg:mb-12"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={startAnimations ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <CutoutButton href="/contacts" variant="filled" className="w-full sm:w-auto">
              {t("cta")}
            </CutoutButton>
            <CutoutButton href="/projects" variant="outline" className="w-full sm:w-auto">
              {t("viewProjects")}
            </CutoutButton>
          </motion.div>
        </div>

        {/* Stats - Bottom of Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={startAnimations ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-between sm:justify-center gap-4 sm:gap-12 lg:gap-20 mt-10 sm:mt-16 lg:mt-24"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={startAnimations ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="flex flex-1 flex-col items-center text-center"
            >
              <span className="text-fluid-xl font-heading text-foreground">
                {stat.value}
                <span>{stat.suffix}</span>
              </span>
              <span className="text-fluid-xs text-muted-foreground mt-1">
                {stat.label}
              </span>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
