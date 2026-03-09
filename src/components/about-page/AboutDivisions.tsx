"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

const divisionLogos: Record<string, string> = {
  "MS-PROD": "/logos/msprod.svg",
  "Line Production": "/logos/line.svg",
  "Art Garage": "/logos/artgarage.svg",
  "Libra Guard": "/logos/libraguard.svg",
  "goQode": "/logos/goqode.svg",
};

export function AboutDivisions() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const items = t.raw("divisions.items") as { name: string; description: string }[];

  return (
    <section ref={ref} className="relative z-10 bg-black/85 backdrop-blur-sm py-fluid-section overflow-hidden">
      <Container className="relative z-10">
        <div className="text-center" style={{ marginBottom: "var(--space-xl)" }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("divisions.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading tracking-tight text-white leading-[1.3]"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
          >
            {t("divisions.title")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-fluid-md">
          {items.map((item, i) => {
            const logo = divisionLogos[item.name];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-full aspect-[3/2] mb-4 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:border-primary/20 group-hover:bg-white/[0.06] transition-all duration-300 overflow-hidden">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={item.name}
                      width={120}
                      height={60}
                      className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 max-w-[70%] max-h-[50%]"
                    />
                  ) : (
                    <span className="font-heading text-white/20 group-hover:text-white/40 transition-colors duration-300 text-fluid-xs">
                      {item.name}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-white text-fluid-sm mb-1">
                  {item.name}
                </h3>
                <p className="text-fluid-xs text-white/35 leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
