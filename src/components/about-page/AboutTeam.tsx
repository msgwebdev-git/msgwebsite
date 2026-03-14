"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "../layout";

export function AboutTeam() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const members = t.raw("team.members") as { name: string; role: string }[];

  return (
    <section ref={ref} className="relative z-10 bg-black/90 backdrop-blur-sm py-fluid-section overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-fluid-xl" style={{ marginBottom: "var(--space-xl)" }}>
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
              style={{ marginBottom: "var(--space-xs)" }}
            >
              {t("team.label")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-heading tracking-tight text-white leading-[1.3]"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
            >
              {t("team.title")}
            </motion.h2>
          </div>

          <div className="lg:col-span-7 flex items-end">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-fluid-base text-white/50 leading-relaxed"
            >
              {t("team.description")}
            </motion.p>
          </div>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-fluid-md">
          {members.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="text-center"
            >
              {/* Avatar placeholder */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <span className="text-fluid-lg font-heading text-white/20">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>

              <h3 className="text-fluid-sm font-heading text-white leading-tight mb-1">
                {member.name}
              </h3>
              <span className="text-fluid-xs text-white/40">
                {member.role}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
