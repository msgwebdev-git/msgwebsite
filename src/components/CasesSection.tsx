"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Container } from "./layout";
import { useIsMobile } from "@/hooks/use-mobile";

type CaseItem = {
  title: string;
  category: string;
  venue: string;
  image: string;
  slug: string;
  size: "large" | "regular";
};

/** Grid placement for 9 items in a bento layout */
const gridPlacements = [
  "lg:col-span-2 case-card-large",   // 1 — Festivalul Lupilor
  "case-card-regular",                // 2 — День Вина
  "case-card-regular",                // 3 — Tradițiilor Românești
  "lg:col-span-2 case-card-large",   // 4 — Pădurilor
  "case-card-regular",                // 5 — Soundstalgic
  "case-card-regular",                // 6 — Eurovision
  "case-card-regular",                // 7 — ДДТ
  "lg:col-span-2 case-card-large",   // 8 — Zdob și Zdub
  "case-card-regular",                // 9 — Скриптонит
];

function CaseCard({
  item,
  index,
}: {
  item: CaseItem;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "case-card group relative",
        gridPlacements[index]
      )}
    >
      <Link href={`/cases/${item.slug}`} className="block w-full h-full">
        {/* Arrow square — outside clipPath */}
        <span className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary z-20 flex items-center justify-center">
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>

        {/* Card with cutout */}
        <div
          className="relative w-full h-full overflow-hidden case-card-clip"
        >
          {/* Photo */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: "clamp(1rem, 4cqi, 2.5rem)" }}>
            <span className="case-card-category font-heading tracking-[0.2em] text-white/60 block" style={{ marginBottom: "clamp(0.25rem, 1cqi, 0.5rem)" }}>
              {item.category}
            </span>
            <h3 className="case-card-title font-heading tracking-wide text-white leading-tight">
              {item.title}
            </h3>
            <span className="case-card-venue text-white/50 block" style={{ marginTop: "clamp(0.25rem, 1cqi, 0.5rem)" }}>
              {item.venue}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const MOBILE_CARDS_LIMIT = 4;

export function CasesSection() {
  const t = useTranslations("projects");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const isMobile = useIsMobile();
  const allItems = t.raw("items") as CaseItem[];
  const items = isMobile ? allItems.slice(0, MOBILE_CARDS_LIMIT) : allItems;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="cases-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#cases-noise)" />
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
            className="text-fluid-xs font-heading tracking-[0.4em] text-white/60 block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("sectionLabel")}
          </span>
          <h2
            className="text-fluid-5xl font-heading tracking-tight text-white"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("title")}
          </h2>
          <p className="text-fluid-lg text-white/60 max-w-2xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-xs">
          {items.map((item, i) => (
            <CaseCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
          style={{ marginTop: "var(--space-xl)" }}
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-fluid-sm font-heading tracking-wider text-white/50 hover:text-white transition-colors"
          >
            {t("viewAll")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
