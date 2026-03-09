"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./layout";
import { useIsMobile } from "@/hooks/use-mobile";

function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 cursor-pointer"
      >
        <span className="text-fluid-xs font-heading tracking-[0.3em] text-white/30">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-white/30 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact");
  const isMobile = useIsMobile();

  const year = new Date().getFullYear();

  const servicesLinks = (
    <ul className="flex flex-col gap-2">
      <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventTurnkey")}</a></li>
      <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventLogistics")}</a></li>
      <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventTechnical")}</a></li>
      <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventVideoproduction")}</a></li>
      <li><a href="#services" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("eventDigital")}</a></li>
    </ul>
  );

  const pagesLinks = (
    <ul className="flex flex-col gap-2">
      <li><a href="#about" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("about")}</a></li>
      <li><a href="#projects" className="text-fluid-xs text-white/50 hover:text-white transition-colors">{nav("projects")}</a></li>
      <li><a href="#expertise" className="text-fluid-xs text-white/50 hover:text-white transition-colors">Expertise</a></li>
      <li><a href="#process" className="text-fluid-xs text-white/50 hover:text-white transition-colors">Process</a></li>
    </ul>
  );

  const contactLinks = (
    <ul className="flex flex-col gap-2">
      <li><a href="tel:+37322000000" className="text-fluid-xs text-white/50 hover:text-white transition-colors">+373 22 000 000</a></li>
      <li><a href="mailto:info@mediashowgrup.com" className="text-fluid-xs text-white/50 hover:text-white transition-colors">info@mediashowgrup.com</a></li>
      <li><span className="text-fluid-xs text-white/50">{contact("addressValue")}</span></li>
    </ul>
  );

  return (
    <footer className="relative z-10 bg-[#0a0a0a] border-t border-white/10">
      <Container>
        <div className="py-fluid-lg">
          {/* Logo */}
          <div className="text-center sm:text-left" style={{ marginBottom: "var(--space-lg)" }}>
            <Image
              src="/white-logo.svg"
              alt="Media Show Grup"
              width={140}
              height={40}
              className="h-8 w-auto mx-auto sm:mx-0"
              style={{ marginBottom: "var(--space-sm)" }}
            />
            <p className="text-fluid-xs text-white/40 max-w-[240px] mx-auto sm:mx-0">
              Full-cycle event agency. From concept to execution.
            </p>
          </div>

          {isMobile ? (
            /* Mobile: Accordions */
            <div>
              <FooterAccordion title={nav("services")}>
                {servicesLinks}
              </FooterAccordion>
              <FooterAccordion title={nav("about")}>
                {pagesLinks}
              </FooterAccordion>
              <FooterAccordion title={nav("contacts")}>
                {contactLinks}
              </FooterAccordion>
            </div>
          ) : (
            /* Desktop: Grid */
            <div className="grid sm:grid-cols-3 gap-fluid-lg">
              <div>
                <span className="text-fluid-xs font-heading tracking-[0.3em] text-white/30 block" style={{ marginBottom: "var(--space-sm)" }}>
                  {nav("services")}
                </span>
                {servicesLinks}
              </div>
              <div>
                <span className="text-fluid-xs font-heading tracking-[0.3em] text-white/30 block" style={{ marginBottom: "var(--space-sm)" }}>
                  {nav("about")}
                </span>
                {pagesLinks}
              </div>
              <div>
                <span className="text-fluid-xs font-heading tracking-[0.3em] text-white/30 block" style={{ marginBottom: "var(--space-sm)" }}>
                  {nav("contacts")}
                </span>
                {contactLinks}
              </div>
            </div>
          )}
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
