"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "../layout";

type CaseItem = {
  title: string;
  category: string;
  venue: string;
  image: string;
  slug: string;
  size: string;
};

interface ServiceCasesProps {
  namespace: string;
  slugs: string[];
}

export function ServiceCases({ namespace, slugs }: ServiceCasesProps) {
  const t = useTranslations(namespace);
  const pt = useTranslations("projects");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const allItems = pt.raw("items") as CaseItem[];
  const items = allItems.filter((item) => slugs.includes(item.slug));

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="svc-cases-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#svc-cases-noise)" />
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
            {t("cases.label")}
          </span>
          <h2
            className="text-fluid-5xl font-heading tracking-tight text-white"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("cases.title")}
          </h2>
          <p className="text-fluid-lg text-white/60 max-w-2xl">
            {t("cases.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-xs">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="case-card case-card-regular group relative"
            >
              <Link href={`/cases/${item.slug}`} className="block w-full h-full">
                <span className="absolute top-0 right-0 w-10 h-10 bg-primary z-20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <div
                  className="relative w-full h-full overflow-hidden case-card-clip"
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
          ))}
        </div>

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
            {t("cases.viewAll")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
