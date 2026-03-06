"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type CaseItem = {
  title: string;
  category: string;
  venue: string;
  image: string;
  slug: string;
  size: "large" | "regular";
};

const gridPlacements = [
  "lg:col-span-2 case-card-large",
  "case-card-regular",
  "case-card-regular",
  "lg:col-span-2 case-card-large",
  "case-card-regular",
  "case-card-regular",
  "case-card-regular",
  "lg:col-span-2 case-card-large",
  "case-card-regular",
];

function ProjectCard({ item, index }: { item: CaseItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn("case-card group relative", gridPlacements[index])}
    >
      <Link href={`/cases/${item.slug}`} className="block w-full h-full">
        <span className="absolute top-0 right-0 w-10 h-10 bg-primary z-20 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>

        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 52px) 0, calc(100% - 52px) 52px, 100% 52px, 100% 100%, 0 100%)",
          }}
        >
          <Image
            src={item.image}
            alt={item.title}
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
              className="case-card-category font-heading tracking-[0.2em] text-white/60 block"
              style={{ marginBottom: "clamp(0.25rem, 1cqi, 0.5rem)" }}
            >
              {item.category}
            </span>
            <h3 className="case-card-title font-heading tracking-wide text-white leading-tight">
              {item.title}
            </h3>
            <span
              className="case-card-venue text-white/50 block"
              style={{ marginTop: "clamp(0.25rem, 1cqi, 0.5rem)" }}
            >
              {item.venue}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const items = t.raw("items") as CaseItem[];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <Navbar logoVisible />

      <section className="relative z-10 bg-[#0a0a0a] pt-40 pb-fluid-section overflow-hidden">
        {/* Noise overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="projects-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="4"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#projects-noise)" />
          </svg>
        </div>

        <Container className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "var(--space-xl)" }}
          >
            <span
              className="text-fluid-xs font-heading tracking-[0.4em] text-white/60 block"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              {t("sectionLabel")}
            </span>
            <h1
              className="text-fluid-hero font-heading tracking-tight text-white"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              {t("title")}
            </h1>
            <p className="text-fluid-lg text-white/60 max-w-2xl">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-xs">
            {items.map((item, i) => (
              <ProjectCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
