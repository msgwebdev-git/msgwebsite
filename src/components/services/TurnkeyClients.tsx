"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

interface TurnkeyClientsProps {
  namespace: string;
}

export function TurnkeyClients({ namespace }: TurnkeyClientsProps) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const clients = t.raw("clients.items") as string[];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#FAFAF9] py-fluid-section overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08] mix-blend-multiply">
        <svg width="100%" height="100%">
          <filter id="tk-clients-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tk-clients-noise)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <span
            className="text-fluid-xs font-heading tracking-[0.4em] text-black/40 uppercase block"
            style={{ marginBottom: "var(--space-lg)" }}
          >
            {t("clients.label")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-[var(--gap-xl)] gap-y-[var(--gap-md)]">
            {clients.map((client, i) => (
              <motion.span
                key={client}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="font-heading tracking-wider text-black/30 hover:text-black/70 transition-colors duration-500 whitespace-nowrap uppercase"
                style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)" }}
              >
                {client}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
