"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Container } from "./layout";

const categoryKeys = [
  "festivals",
  "concerts",
  "conceptProjects",
  "conferences",
  "brandLaunches",
  "sports",
  "corporate",
  "custom",
] as const;

type CategoryKey = (typeof categoryKeys)[number];

const categoryImages: Record<CategoryKey, string> = {
  festivals: "/expertise/festivals.jpg",
  concerts: "/expertise/concerts.jpg",
  conceptProjects: "/expertise/concept-projects.jpg",
  conferences: "/expertise/conferences.jpg",
  brandLaunches: "/expertise/brand-launches.jpg",
  sports: "/expertise/sports.jpg",
  corporate: "/expertise/corporate.jpg",
  custom: "/expertise/custom.jpg",
};

function TabPanelTop({ categoryKey }: { categoryKey: CategoryKey }) {
  const t = useTranslations("expertise");

  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="expertise-panel"
    >
      {/* Photo + description side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-fluid-lg" style={{ marginBottom: "var(--space-md)" }}>
        <div className="lg:col-span-2 relative overflow-hidden aspect-[16/10]">
          <Image
            src={categoryImages[categoryKey]}
            alt={t(`${categoryKey}.title`)}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
        <div className="lg:col-span-3 flex flex-col justify-center">
          <p className="expertise-description text-black/70 leading-relaxed">
            {t(`${categoryKey}.description`)}
          </p>
          <div
            className="relative pl-4 border-l-2 border-primary/40"
            style={{ marginTop: "var(--space-sm)" }}
          >
            <p className="expertise-result text-black/80 italic leading-relaxed">
              {t(`${categoryKey}.result`)}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black/10" />
    </motion.div>
  );
}

function TabPanelBottom({ categoryKey }: { categoryKey: CategoryKey }) {
  const t = useTranslations("expertise");
  const whatWeDo = t.raw(`${categoryKey}.whatWeDo`) as string[];
  const cases = t.raw(`${categoryKey}.cases`) as Array<{
    name: string;
    venue: string;
  }>;

  return (
    <motion.div
      key={categoryKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="container-fluid"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* What we do — light bg */}
        <div className="lg:col-span-3 lg:pr-[var(--gap-lg)]" style={{ paddingTop: "var(--space-md)", paddingBottom: "var(--space-lg)" }}>
          <span
            className="text-fluid-xs font-heading tracking-[0.3em] text-black/40 block"
            style={{ marginBottom: "var(--space-sm)" }}
          >
            {t("whatWeDoLabel")}
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-[var(--gap-md)] gap-y-1">
            {whatWeDo.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="flex items-start gap-3 py-1.5"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-[0.45em] flex-shrink-0" />
                <span className="expertise-item text-black/60">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Cases — dark block, hidden on mobile */}
        <div
          className="hidden lg:block lg:col-span-2 relative"
          style={{ padding: "var(--space-md) var(--space-md) var(--space-lg) var(--space-md)" }}
        >
          {/* Dark bg extending to right edge of viewport */}
          <div
            className="absolute inset-y-0 bg-[#0a0a0a]"
            style={{ left: 0, right: "-50vw" }}
          />
          <div className="relative z-10">
            <span
              className="text-fluid-xs font-heading tracking-[0.3em] text-white/40 block"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              {t("casesLabel")}
            </span>
            <div className="flex flex-col divide-y divide-white/10">
              {cases.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  className="py-3 first:pt-0"
                >
                  <span className="expertise-case-name text-white font-heading tracking-wide">
                    {c.name}
                  </span>
                  <span className="expertise-case-venue text-white/40 block sm:inline sm:ml-2">
                    — {c.venue}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ExpertiseSection() {
  const t = useTranslations("expertise");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState<CategoryKey>("festivals");

  const handleTabClick = (key: CategoryKey) => {
    setActiveTab(key);
    const tabEl = document.getElementById(`expertise-tab-${key}`);
    tabEl?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <motion.section
      ref={sectionRef}
      id="expertise"
      className="relative z-10 bg-[#FAFAF9] pt-[clamp(6rem,5rem+8vw,14rem)] pb-0 overflow-x-clip"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="expertise-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#expertise-noise)" />
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
          <span
            className="text-fluid-xs font-heading tracking-[0.4em] text-black/60 block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("sectionLabel")}
          </span>
          <h2
            className="text-fluid-5xl font-heading tracking-tight text-black"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("title")}
          </h2>
          <p className="text-fluid-lg text-black/60 max-w-2xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Tab Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: "var(--space-lg)" }}
          className="relative"
        >
          {/* Scroll fade hints */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FAFAF9] to-transparent z-10 pointer-events-none lg:hidden" />
          <div
            role="tablist"
            aria-label={t("title")}
            className="flex overflow-x-auto scrollbar-hide gap-1 pb-px border-b border-black/10"
          >
            {categoryKeys.map((key) => (
              <button
                key={key}
                id={`expertise-tab-${key}`}
                role="tab"
                aria-selected={activeTab === key}
                aria-controls={`expertise-panel-${key}`}
                onClick={() => handleTabClick(key)}
                className={cn(
                  "expertise-tab-trigger relative whitespace-nowrap flex-shrink-0",
                  "font-heading tracking-wider transition-colors duration-300",
                  "pb-3 cursor-pointer",
                  activeTab === key
                    ? "text-black"
                    : "text-black/40 hover:text-black/70"
                )}
              >
                {t(`${key}.title`)}
                {activeTab === key && (
                  <motion.span
                    layoutId="expertise-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content — top part (photo + description) */}
        <div
          role="tabpanel"
          id={`expertise-panel-${activeTab}`}
          aria-labelledby={`expertise-tab-${activeTab}`}
        >
          <AnimatePresence mode="wait">
            <TabPanelTop key={activeTab} categoryKey={activeTab} />
          </AnimatePresence>
        </div>
      </Container>

      {/* Bottom part — full width: what we do (light) + cases (dark) */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <TabPanelBottom key={activeTab} categoryKey={activeTab} />
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
