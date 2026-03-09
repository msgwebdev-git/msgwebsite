"use client";

import { Link } from "@/i18n/navigation";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./layout";

const featuredKeys = ["turnkey", "logistics"] as const;
const regularKeys = [
  "technical",
  "videoproduction",
  "digital",
  "advertising",
  "security",
] as const;

function ServiceCard({
  serviceKey,
  index,
  isInView,
  featured = false,
}: {
  serviceKey: string;
  index: number;
  isInView: boolean;
  featured?: boolean;
}) {
  const t = useTranslations("services");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: "easeOut" }}
      className="group relative"
      style={{ containerType: "inline-size" }}
    >
      {/* White square with arrow — outside clipPath */}
      <span className="absolute top-0 right-0 w-10 h-10 bg-white z-20 flex items-center justify-center">
        <ArrowUpRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>

      <a
        href={`#${serviceKey}`}
        className={cn(
          "relative block bg-[#0a0a0a] cursor-pointer flex flex-col justify-between",
          featured ? "service-card-featured" : "service-card-regular"
        )}
        style={{
          clipPath: "polygon(0 0, calc(100% - 52px) 0, calc(100% - 52px) 52px, 100% 52px, 100% 100%, 0 100%)",
        }}
      >
        {/* Border frame with cutout */}
        <span className="absolute left-0 top-0 bottom-0 w-px bg-white/15 group-hover:bg-white/30 transition-colors duration-500" />
        <span className="absolute top-0 left-0 h-px bg-white/15 group-hover:bg-white/30 transition-colors duration-500" style={{ right: 52 }} />
        <span className="absolute bottom-0 left-0 right-0 h-px bg-white/15 group-hover:bg-white/30 transition-colors duration-500" />
        <span className="absolute right-0 bottom-0 w-px bg-white/15 group-hover:bg-white/30 transition-colors duration-500" style={{ top: 52 }} />
        <span className="absolute right-0 w-[52px] h-px bg-white/15 group-hover:bg-white/30 transition-colors duration-500" style={{ top: 52 }} />
        <span className="absolute top-0 h-[52px] w-px bg-white/15 group-hover:bg-white/30 transition-colors duration-500" style={{ right: 52 }} />

        {/* Top: Number */}
        <div>
          <span className="service-card-number font-heading tracking-[0.4em] text-white/60">
            0{index + 1}
          </span>
        </div>

        {/* Bottom: Title + Description */}
        <div>
          <h3 className="service-card-title font-heading tracking-tight text-white transition-colors duration-300 leading-[1.1]">
            {t(`${serviceKey}.title`)}
          </h3>
          <p className="service-card-desc text-white/50 leading-relaxed transition-colors duration-300 group-hover:text-white/80 line-clamp-2">
            {t(`${serviceKey}.description`)}
          </p>

          <span className="service-card-link inline-flex items-center gap-1 font-heading tracking-wider text-white/40 group-hover:text-white transition-colors duration-300">
            {t("learnMore")}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>

          {/* Accent line */}
          <div className="service-card-line h-px bg-white/15 relative overflow-hidden">
            <div className="h-full w-0 bg-white transition-all duration-700 ease-out group-hover:w-full" />
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export function ServicesSection() {
  const t = useTranslations("services");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 30%"],
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#0a0a0a", "#FF4931"]
  );

  return (
    <motion.section
      ref={sectionRef}
      id="services"
      className="relative z-10 py-fluid-section overflow-hidden -mt-[100vh]"
      style={{ backgroundColor: bgColor }}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="services-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#services-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "var(--space-xl)" }}
        >
          <span className="text-fluid-xs font-heading tracking-[0.4em] text-white/60 block" style={{ marginBottom: "var(--space-xs)" }}>
            {t("whatWeDo")}
          </span>
          <h2 className="text-fluid-5xl font-heading tracking-tight text-white" style={{ marginBottom: "var(--space-xs)" }}>
            {t("title")}
          </h2>
          <p className="text-fluid-lg text-white/60 max-w-2xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Featured Cards — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm" style={{ marginBottom: "var(--gap-sm)" }}>
          {featuredKeys.map((key, index) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              index={index}
              isInView={isInView}
              featured
            />
          ))}
        </div>

        {/* Regular Cards — 3 columns + CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-sm">
          {regularKeys.map((key, index) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              index={featuredKeys.length + index}
              isInView={isInView}
            />
          ))}

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + (featuredKeys.length + regularKeys.length) * 0.1, ease: "easeOut" }}
            className="group relative"
            style={{ containerType: "inline-size" }}
          >
            {/* Black square with arrow */}
            <span className="absolute top-0 right-0 w-10 h-10 bg-black z-20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>

            <Link
              href="/contacts"
              className="service-card-regular relative block bg-white cursor-pointer flex flex-col items-center justify-center text-center"
              style={{
                clipPath: "polygon(0 0, calc(100% - 52px) 0, calc(100% - 52px) 52px, 100% 52px, 100% 100%, 0 100%)",
              }}
            >
              <span className="service-card-title font-heading tracking-tight text-black leading-[1.1]">
                {t("cta")}
              </span>
            </Link>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}
