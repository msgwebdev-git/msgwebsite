"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/about-page/AboutHero";
import { AboutMission } from "@/components/about-page/AboutMission";
import { AboutHistory } from "@/components/about-page/AboutHistory";
import { AboutPrinciples } from "@/components/about-page/AboutPrinciples";
import { AboutDivisions } from "@/components/about-page/AboutDivisions";
import { ExpertiseCta } from "@/components/expertise/ExpertiseCta";
import { useIsMobile } from "@/hooks/use-mobile";

const AboutHeartScene = dynamic(
  () => import("@/components/about-page/AboutHeartScene"),
  { ssr: false }
);

export function AboutPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });


  return (
    <div ref={containerRef}>
      <Navbar logoVisible />

      {/* Fixed 3D heart — desktop only */}
      {!isMobile && (
        <div className="fixed inset-0 z-[5] pointer-events-none">
          <AboutHeartScene scrollProgress={scrollYProgress} />
        </div>
      )}


      <main className="relative">
        <AboutHero />
        <AboutMission />
        <AboutHistory />
        <AboutPrinciples />
        <AboutDivisions />
        <ExpertiseCta />
      </main>
      <Footer />
    </div>
  );
}
