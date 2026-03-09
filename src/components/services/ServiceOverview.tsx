"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface ServiceOverviewProps {
  namespace: string;
  image: string;
}

export function ServiceOverview({ namespace, image }: ServiceOverviewProps) {
  const t = useTranslations(namespace);
  const st = useTranslations("stats");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const includes = t.raw("overview.includes") as string[];

  return (
    <section ref={ref} className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="svc-overview-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#svc-overview-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-xl">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-fluid-xs font-heading tracking-[0.4em] text-black/50 uppercase block"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              {t("overview.label")}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading tracking-tight text-black"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)", marginBottom: "var(--space-sm)" }}
            >
              {t("overview.title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-fluid-base text-black/60 leading-relaxed"
              style={{ marginBottom: "var(--space-lg)" }}
            >
              {t("overview.description")}
            </motion.p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-[var(--gap-md)] gap-y-1">
              {includes.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-start gap-3 py-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-[0.5em] flex-shrink-0" />
                  <span className="text-fluid-sm text-black/70">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-fluid-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[4/3] overflow-hidden"
              style={{
                clipPath: "polygon(0 0, calc(100% - 32px) 0, calc(100% - 32px) 32px, 100% 32px, 100% 100%, 0 100%)",
              }}
            >
              <Image
                src={image}
                alt={t("overview.title")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            <div className="grid grid-cols-3 gap-fluid-sm">
              {[
                { value: st("yearsValue"), label: st("years") },
                { value: st("projectsValue"), label: st("projects") },
                { value: st("clientsValue"), label: st("clients") },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <span className="text-fluid-4xl font-heading text-primary block leading-none">
                    {stat.value}+
                  </span>
                  <span className="text-fluid-xs text-black/50 font-heading tracking-wider mt-1 block">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
