"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "./layout";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact");

  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-[#0a0a0a] border-t border-white/10">
      <Container>
        <div className="py-fluid-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fluid-lg">
            {/* Logo + tagline */}
            <div className="lg:col-span-1">
              <Image
                src="/white-logo.svg"
                alt="Media Show Grup"
                width={140}
                height={40}
                className="h-8 w-auto"
                style={{ marginBottom: "var(--space-sm)" }}
              />
              <p className="text-fluid-xs text-white/40 max-w-[240px]">
                Full-cycle event agency. From concept to execution.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <span className="text-fluid-xs font-heading tracking-[0.3em] text-white/30 block" style={{ marginBottom: "var(--space-sm)" }}>
                {nav("services")}
              </span>
              <ul className="flex flex-col gap-2">
                <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventTurnkey")}</a></li>
                <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventLogistics")}</a></li>
                <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventTechnical")}</a></li>
                <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventVideoproduction")}</a></li>
                <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventDigital")}</a></li>
              </ul>
            </div>

            {/* Pages */}
            <div>
              <span className="text-fluid-xs font-heading tracking-[0.3em] text-white/30 block" style={{ marginBottom: "var(--space-sm)" }}>
                {nav("about")}
              </span>
              <ul className="flex flex-col gap-2">
                <li><a href="#about" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("about")}</a></li>
                <li><a href="#projects" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("projects")}</a></li>
                <li><a href="#expertise" className="text-fluid-xs text-white/50 hover:text-white transition-colors">Expertise</a></li>
                <li><a href="#process" className="text-fluid-xs text-white/50 hover:text-white transition-colors">Process</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <span className="text-fluid-xs font-heading tracking-[0.3em] text-white/30 block" style={{ marginBottom: "var(--space-sm)" }}>
                {nav("contacts")}
              </span>
              <ul className="flex flex-col gap-2">
                <li><a href="tel:+37322000000" className="text-fluid-xs text-white/50 hover:text-white transition-colors">+373 22 000 000</a></li>
                <li><a href="mailto:info@mediashowgrup.com" className="text-fluid-xs text-white/50 hover:text-white transition-colors">info@mediashowgrup.com</a></li>
                <li><span className="text-fluid-xs text-white/50">{contact("addressValue")}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-fluid-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-fluid-xs text-white/30">
            © {year} Media Show Grup. {t("rights")}
          </span>
          <div className="flex items-center gap-fluid-sm">
            <a href="#" className="text-fluid-xs text-white/30 hover:text-white/60 transition-colors">
              {t("privacy")}
            </a>
            <a href="#" className="text-fluid-xs text-white/30 hover:text-white/60 transition-colors">
              {t("terms")}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
