"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "../layout";

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

const gridPlacements = [
  "lg:col-span-2 turnkey-card-large",
  "lg:col-span-2 turnkey-card-large",
  "turnkey-card-regular",
  "turnkey-card-regular",
  "turnkey-card-regular",
  "turnkey-card-regular",
  "lg:col-span-2 turnkey-card-large",
  "lg:col-span-2 turnkey-card-large",
];

function ExpertiseCard({
  categoryKey,
  index,
}: {
  categoryKey: CategoryKey;
  index: number;
}) {
  const t = useTranslations("expertise");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn("turnkey-card group relative", gridPlacements[index])}
    >
      <span className="absolute top-0 right-0 w-10 h-10 bg-primary z-20 flex items-center justify-center">
        <ArrowUpRight className="w-4 h-4 text-white" />
      </span>

      <div
        className="relative w-full h-full overflow-hidden case-card-clip"
      >
        <Image
          src={categoryImages[categoryKey]}
          alt={t(`${categoryKey}.title`)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{ padding: "clamp(1rem, 4cqi, 2.5rem)" }}
        >
          <span
            className="turnkey-card-number font-heading tracking-[0.2em] text-primary/60 block"
            style={{ marginBottom: "clamp(0.25rem, 1cqi, 0.5rem)" }}
          >
            0{index + 1}
          </span>
          <h3 className="turnkey-card-title font-heading tracking-wide text-white leading-tight">
            {t(`${categoryKey}.title`)}
          </h3>
          <p
            className="turnkey-card-desc text-white/0 group-hover:text-white/60 transition-colors duration-500 leading-relaxed line-clamp-2"
            style={{ marginTop: "clamp(0.25rem, 1cqi, 0.5rem)" }}
          >
            {t(`${categoryKey}.description`)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function TurnkeyExpertise({ namespace = "serviceTurnkey" }: { namespace?: string }) {
  const t = useTranslations(namespace);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden"
    >
      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="tk-expertise-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#tk-expertise-noise)"
          />
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
            className="text-fluid-xs font-heading tracking-[0.4em] text-white/60 block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("expertise.label")}
          </span>
          <h2
            className="text-fluid-5xl font-heading tracking-tight text-white"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("expertise.title")}
          </h2>
          <p className="text-fluid-lg text-white/60 max-w-2xl">
            {t("expertise.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fluid-xs">
          {categoryKeys.map((key, i) => (
            <ExpertiseCard key={key} categoryKey={key} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
