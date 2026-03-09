"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Marquee } from "@/components/Marquee";
import { ShowreelSection } from "@/components/ShowreelSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { CasesSection } from "@/components/CasesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

import { PageLoader } from "@/components/PageLoader";

export default function HomeClient() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      <PageLoader onComplete={() => setLoaderDone(true)} />
      <Navbar logoVisible={loaderDone} />
      <main>
        <HeroSection startAnimations={loaderDone} />
        <Marquee />
        <ShowreelSection />
        <AboutSection />
        <ServicesSection />
        <ExpertiseSection />
        <CasesSection />
        <ProcessSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
