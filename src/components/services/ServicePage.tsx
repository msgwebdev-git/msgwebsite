"use client";

import { type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceHero } from "./ServiceHero";
import { ServiceOverview } from "./ServiceOverview";
import { ServiceCta } from "./ServiceCta";

interface ServicePageProps {
  namespace: string;
  heroImage: string;
  overviewImage: string;
  children?: ReactNode;
}

export function ServicePage({ namespace, heroImage, overviewImage, children }: ServicePageProps) {
  return (
    <>
      <Navbar logoVisible />
      <main>
        <ServiceHero namespace={namespace} image={heroImage} />
        <ServiceOverview namespace={namespace} image={overviewImage} />
        {children}
        <ServiceCta namespace={namespace} />
      </main>
      <Footer />
    </>
  );
}
