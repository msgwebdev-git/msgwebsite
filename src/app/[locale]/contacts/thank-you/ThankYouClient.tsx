"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/layout";
import { Link } from "@/i18n/navigation";

export function ThankYouClient() {
  const t = useTranslations("thankYou");

  return (
    <>
      <Navbar logoVisible />

      <main>
      <section className="relative z-10 bg-black min-h-[80vh] flex items-center">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-32">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-primary"
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-fluid-4xl font-heading tracking-tight text-white mb-4"
            >
              {t("title")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-fluid-lg text-white/50 mb-12"
            >
              {t("subtitle")}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/"
                className="group flex items-center gap-3 bg-primary px-8 py-4 text-white font-heading tracking-wider text-fluid-sm hover:bg-primary/90 transition-colors"
              >
                {t("backHome")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contacts"
                className="flex items-center gap-3 px-8 py-4 border border-white/[0.08] text-white/50 font-heading tracking-wider text-fluid-sm hover:border-white/20 hover:text-white/70 transition-all"
              >
                {t("backContacts")}
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
      </main>

      <Footer />
    </>
  );
}
