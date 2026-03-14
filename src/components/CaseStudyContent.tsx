"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "./layout";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type CaseItem = {
  title: string;
  category: string;
  venue: string;
  image: string;
  slug: string;
  size: string;
};

function ContentBlock({
  label,
  text,
  index,
}: {
  label: string;
  text: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.05 }}
      className="flex flex-col"
    >
      <span
        className="text-fluid-xs font-heading tracking-[0.3em] text-primary uppercase block"
        style={{ marginBottom: "var(--space-sm)" }}
      >
        {label}
      </span>
      <div className="w-8 h-[2px] bg-primary/30" style={{ marginBottom: "var(--space-md)" }} />
      <p className="text-fluid-sm text-black/60 leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

export function CaseStudyContent({ slug }: { slug: string }) {
  const t = useTranslations("caseStudies");
  const pt = useTranslations("projects");
  const items = pt.raw("items") as CaseItem[];
  const currentIndex = items.findIndex((item) => item.slug === slug);
  const project = items[currentIndex];
  const nextProject = items[(currentIndex + 1) % items.length];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  if (!project) return null;

  const sections = [
    { label: t("aboutProject"), text: t(`${slug}.about`) },
    { label: t("ourServices"), text: t(`${slug}.services`) },
    { label: t("resultLabel"), text: t(`${slug}.result`) },
  ];

  return (
    <>
      <Navbar logoVisible />

      <main>
      {/* Hero */}
      <section className="relative h-[70vh] lg:h-[85vh] min-h-[500px] overflow-hidden bg-black">
        <motion.div style={{ y: heroImgY }} className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover scale-110 origin-center"
            priority
            sizes="100vw"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-28 left-0 right-0 z-20"
        >
          <Container>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-fluid-sm font-heading tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToProjects")}
            </Link>
          </Container>
        </motion.div>

        {/* Title overlay */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-0 left-0 right-0 z-10"
        >
          <Container>
            <div style={{ paddingBottom: "var(--space-xl)" }}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-fluid-xs font-heading tracking-[0.3em] text-primary uppercase block"
                style={{ marginBottom: "var(--space-xs)" }}
              >
                {project.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-fluid-hero font-heading tracking-tight text-white leading-[0.95]"
                style={{ marginBottom: "var(--space-sm)" }}
              >
                {project.title}
              </motion.h1>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-fluid-lg text-white/50 font-heading tracking-wider"
              >
                {project.venue}
              </motion.span>
            </div>
          </Container>
        </motion.div>
      </section>

      {/* Content — 3 columns */}
      <article className="relative z-10 bg-white py-fluid-section">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-fluid-lg">
            {sections.map((section, i) => (
              <ContentBlock
                key={section.label}
                label={section.label}
                text={section.text}
                index={i}
              />
            ))}
          </div>
        </Container>
      </article>

      {/* Next Project */}
      <section className="relative z-10 bg-[#0a0a0a] py-fluid-section">
        <Container>
          <span
            className="text-fluid-xs font-heading tracking-[0.3em] text-white/30 uppercase block"
            style={{ marginBottom: "var(--space-md)" }}
          >
            {t("nextProject")}
          </span>
          <Link href={`/cases/${nextProject.slug}`} className="group block">
            <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
              <Image
                src={nextProject.image}
                alt={nextProject.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ padding: "var(--space-lg)" }}
              >
                <span
                  className="text-fluid-xs font-heading tracking-[0.2em] text-white/60 block"
                  style={{ marginBottom: "var(--space-xs)" }}
                >
                  {nextProject.category}
                </span>
                <h3 className="text-fluid-4xl font-heading tracking-tight text-white flex items-center gap-4">
                  {nextProject.title}
                  <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-2" />
                </h3>
              </div>
            </div>
          </Link>
        </Container>
      </section>

      </main>

      <Footer />
    </>
  );
}
