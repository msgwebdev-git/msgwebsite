"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <>
      <Navbar logoVisible />
      <section className="relative z-10 bg-black min-h-[70vh] flex items-center">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-32">
            <h1 className="text-fluid-4xl font-heading tracking-tight text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-fluid-lg text-white/50 mb-8">
              {t("description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="bg-primary px-8 py-4 text-white font-heading tracking-wider text-fluid-sm hover:bg-primary/90 transition-colors"
              >
                {t("retry")}
              </button>
              <Link
                href="/"
                className="px-8 py-4 border border-white/[0.08] text-white/50 font-heading tracking-wider text-fluid-sm hover:border-white/20 hover:text-white/70 transition-all"
              >
                {t("home")}
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
}
