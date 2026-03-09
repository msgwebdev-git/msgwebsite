"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExpertiseHero } from "./ExpertiseHero";
import { ExpertiseScope } from "./ExpertiseScope";
import { ExpertiseCases } from "./ExpertiseCases";
import { ExpertiseResult } from "./ExpertiseResult";
import { ExpertiseCta } from "./ExpertiseCta";

interface ExpertisePageProps {
  category: string;
  image: string;
}

export function ExpertisePage({ category, image }: ExpertisePageProps) {
  return (
    <>
      <Navbar logoVisible />
      <main>
        <ExpertiseHero category={category} image={image} />
        <ExpertiseScope category={category} />
        <ExpertiseCases category={category} />
        <ExpertiseResult category={category} />
        <ExpertiseCta />
      </main>
      <Footer />
    </>
  );
}
