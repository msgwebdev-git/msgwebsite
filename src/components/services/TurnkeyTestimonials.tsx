"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface TurnkeyTestimonialsProps {
  namespace: string;
}

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  project: string;
};

export function TurnkeyTestimonials({ namespace }: TurnkeyTestimonialsProps) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const items = t.raw("testimonials.items") as Testimonial[];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="tk-testimonials-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tk-testimonials-noise)" />
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
            className="text-fluid-xs font-heading tracking-[0.4em] text-black/50 uppercase block"
            style={{ marginBottom: "var(--space-xs)" }}
          >
            {t("testimonials.label")}
          </span>
          <h2
            className="font-heading tracking-tight text-black"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
          >
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-fluid-md">
          {items.map((item, i) => (
            <motion.blockquote
              key={item.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col justify-between border border-black/10 bg-white"
              style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}
            >
              <div>
                <span className="text-primary/20 font-heading leading-none block" style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}>
                  &ldquo;
                </span>
                <p
                  className="text-fluid-sm text-black/70 leading-relaxed italic"
                  style={{ marginTop: "-1rem" }}
                >
                  {item.quote}
                </p>
              </div>
              <div style={{ marginTop: "var(--space-md)" }}>
                <span className="font-heading tracking-wide text-black block" style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}>
                  {item.author}
                </span>
                <span className="text-fluid-xs text-black/40 block">{item.role}</span>
                <span className="text-fluid-xs text-primary/60 font-heading tracking-wider block" style={{ marginTop: "0.25rem" }}>
                  {item.project}
                </span>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
