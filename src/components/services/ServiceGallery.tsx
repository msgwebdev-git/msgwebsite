"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface ServiceGalleryProps {
  namespace: string;
}

type GalleryItem = {
  image: string;
  title: string;
};

export function ServiceGallery({ namespace }: ServiceGalleryProps) {
  const t = useTranslations(namespace);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const items = t.raw("gallery.items") as GalleryItem[];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#0a0a0a] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="svc-gallery-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#svc-gallery-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "var(--space-lg)" }}
        >
          <span
            className="text-fluid-xs font-heading tracking-[0.4em] text-white/60 block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("gallery.label")}
          </span>
          <h2
            className="font-heading tracking-tight text-white"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)",
            }}
          >
            {t("gallery.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-fluid-xs">
          {items.map((item, i) => (
            <motion.div
              key={item.image}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ padding: "clamp(0.75rem, 2cqi, 1.5rem)" }}
              >
                <span className="text-fluid-xs font-heading tracking-wide text-white/80">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
