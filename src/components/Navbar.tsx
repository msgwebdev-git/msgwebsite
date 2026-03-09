"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronDown, Globe, X, ArrowRight, Check, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Container } from "./layout";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const languages = [
  { code: "ro", label: "RO" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
] as const;

interface NavbarProps {
  logoVisible?: boolean;
}

export function Navbar({ logoVisible = true }: NavbarProps) {
  const t = useTranslations("nav");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [expertiseOpen, setExpertiseOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    {
      label: t("services"),
      href: "#services",
      submenu: [
        { label: t("eventTurnkey"), href: "/services/turnkey" },
        { label: t("eventLogistics"), href: "/services/logistics" },
        { label: t("eventTechnical"), href: "/services/technical" },
        { label: t("eventVideoproduction"), href: "/services/videoproduction" },
        { label: t("eventDigital"), href: "/services/digital" },
        { label: t("eventAdvertising"), href: "/services/advertising" },
        { label: t("eventSecurity"), href: "/services/security" },
      ],
    },
    {
      label: t("expertise"),
      href: "#expertise",
      submenu: [
        { label: t("expFestivals"), href: "/expertise/festivals" },
        { label: t("expConcerts"), href: "/expertise/concerts" },
        { label: t("expConceptProjects"), href: "/expertise/concept-projects" },
        { label: t("expConferences"), href: "/expertise/conferences" },
        { label: t("expBrandLaunches"), href: "/expertise/brand-launches" },
        { label: t("expSports"), href: "/expertise/sports" },
        { label: t("expCorporate"), href: "/expertise/corporate" },
        { label: t("expCustom"), href: "/expertise/custom" },
      ],
    },
    { label: t("projects"), href: "/projects" },
    { label: t("about"), href: "/about" },
    { label: t("contacts"), href: "/contacts" },
  ];

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when any overlay is open
  const anyOverlayOpen = isOpen || servicesOpen || expertiseOpen;
  useEffect(() => {
    if (anyOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyOverlayOpen]);

  // Close overlays on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (servicesOpen) setServicesOpen(false);
        if (expertiseOpen) setExpertiseOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [servicesOpen, expertiseOpen]);

  const servicesLink = navLinks[0];
  const expertiseLink = navLinks[1];

  const logoSrc = "/white-logo.svg";

  const switchLocale = (locale: string) => {
    router.replace(pathname, { locale, scroll: false });
    setLangMenuOpen(false);
  };

  const getCurrentLocale = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const locale = path.split("/")[1];
      if (["ro", "ru", "en"].includes(locale)) {
        return locale.toUpperCase();
      }
    }
    return "RO";
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav
            className={cn(
              "flex items-center justify-between transition-all duration-500",
              isScrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
            )}
          >
            {/* Logo */}
            <Link href="/" className="relative z-50 flex-shrink-0">
              {mounted ? (
                <Image
                  src={logoSrc}
                  alt="Media Show Grup"
                  width={160}
                  height={72}
                  data-navbar-logo
                  className={cn(
                    "w-auto transition-all duration-500",
                    isScrolled ? "h-8 lg:h-9" : "h-9 lg:h-10",
                    !logoVisible && "opacity-0"
                  )}
                  priority
                />
              ) : (
                <div className="h-9 lg:h-10 w-28 bg-muted animate-pulse" />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.submenu ? (
                    <button
                      onClick={() => {
                        if (link.label === servicesLink.label) setServicesOpen(true);
                        else if (link.label === expertiseLink.label) setExpertiseOpen(true);
                      }}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2 text-sm font-medium cursor-pointer",
                        "text-foreground/70 hover:text-foreground transition-colors duration-300",
                        "font-heading tracking-wider group"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          ((link.label === servicesLink.label && servicesOpen) || (link.label === expertiseLink.label && expertiseOpen)) && "rotate-180"
                        )}
                      />
                      <span
                        className={cn(
                          "absolute bottom-0 left-3 right-3 h-px bg-foreground",
                          "origin-left scale-x-0 group-hover:scale-x-100",
                          "transition-transform duration-300 ease-out"
                        )}
                      />
                    </button>
                  ) : link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2 text-sm font-medium",
                        "text-foreground/70 hover:text-foreground transition-colors duration-300",
                        "font-heading tracking-wider group"
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "absolute bottom-0 left-3 right-3 h-px bg-foreground",
                          "origin-left scale-x-0 group-hover:scale-x-100",
                          "transition-transform duration-300 ease-out"
                        )}
                      />
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2 text-sm font-medium",
                        "text-foreground/70 hover:text-foreground transition-colors duration-300",
                        "font-heading tracking-wider group"
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "absolute bottom-0 left-3 right-3 h-px bg-foreground",
                          "origin-left scale-x-0 group-hover:scale-x-100",
                          "transition-transform duration-300 ease-out"
                        )}
                      />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Language Switcher */}
              <div
                className="relative"
                onMouseEnter={() => setLangMenuOpen(true)}
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2",
                    "text-sm font-medium",
                    "text-foreground/80 hover:text-foreground transition-colors"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  <span>{mounted ? getCurrentLocale() : "RO"}</span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      langMenuOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "absolute top-full right-0 pt-2 opacity-0 invisible",
                    "transition-all duration-200",
                    langMenuOpen && "opacity-100 visible"
                  )}
                >
                  <div className="bg-background border border-border min-w-[80px] p-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={cn(
                          "block w-full px-3 py-1.5 text-left text-sm",
                          "hover:bg-muted transition-colors",
                          (mounted ? getCurrentLocale() : "RO") === lang.label
                            ? "text-primary font-medium"
                            : "text-foreground/70"
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:+37322838539"
                className={cn(
                  "flex items-center gap-2 ml-3 px-4 py-2",
                  "text-sm font-heading tracking-wider",
                  "text-foreground/80 hover:text-primary transition-colors"
                )}
              >
                <Phone className="w-4 h-4" />
                <span>+373 22 83 85 39</span>
              </a>
            </div>

            {/* Mobile: Phone + Language + Burger */}
            <div className="flex items-center gap-1 lg:hidden relative z-50">
              {/* Phone */}
              <a
                href="tel:+37322838539"
                className="w-10 h-10 flex items-center justify-center text-foreground/80"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Language Drawer Trigger */}
              <Drawer>
                <DrawerTrigger asChild>
                  <button
                    className={cn(
                      "w-10 h-10 flex items-center justify-center",
                      "text-foreground/80 hover:text-foreground transition-colors"
                    )}
                    aria-label="Change language"
                  >
                    <span className="text-xs font-heading tracking-wider">
                      {mounted ? getCurrentLocale() : "RO"}
                    </span>
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="text-center font-heading tracking-wider">
                      <Globe className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      {t("language")}
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-8">
                    {languages.map((lang) => {
                      const isActive = (mounted ? getCurrentLocale() : "RO") === lang.label;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => switchLocale(lang.code)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-4",
                            "border-b border-border last:border-0",
                            "transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-foreground/70 hover:text-foreground"
                          )}
                        >
                          <span className="font-heading tracking-wider text-lg">
                            {lang.label === "RO" ? "Română" : lang.label === "RU" ? "Русский" : "English"}
                          </span>
                          {isActive && <Check className="w-5 h-5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </DrawerContent>
              </Drawer>

              {/* Burger Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center",
                  "text-foreground hover:text-foreground/70 transition-colors"
                )}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-4">
                  <span
                    className={cn(
                      "absolute left-0 h-px w-full bg-current transition-all duration-300",
                      isOpen ? "top-1/2 rotate-45" : "top-0"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-px w-full bg-current transition-all duration-300",
                      isOpen ? "opacity-0 scale-x-0" : "opacity-100"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-px w-full bg-current transition-all duration-300",
                      isOpen ? "top-1/2 -rotate-45" : "bottom-0"
                    )}
                  />
                </div>
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Fullscreen Services Overlay (Desktop) */}
      <AnimatePresence>
        {servicesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] hidden lg:flex bg-[#0a0a0a]"
          >
            {/* Close button */}
            <button
              onClick={() => setServicesOpen(false)}
              className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <Container className="flex flex-col justify-center h-full">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
                style={{ marginBottom: "var(--space-lg)" }}
              >
                {servicesLink.label}
              </motion.span>

              <nav className="grid grid-cols-2 gap-x-16 gap-y-2">
                {servicesLink.submenu!.map((sublink, i) => (
                  <motion.div
                    key={sublink.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{
                      delay: 0.15 + i * 0.06,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {sublink.href.startsWith("/") ? (
                      <Link
                        href={sublink.href}
                        onClick={() => setServicesOpen(false)}
                        className="group/svc flex items-center justify-between py-5 border-b border-white/10 hover:border-primary/50 transition-colors duration-300 cursor-pointer"
                      >
                        <span className="font-heading tracking-wide text-white/80 group-hover/svc:text-white transition-colors duration-300" style={{ fontSize: "clamp(1.25rem, 2.2vw, 2rem)" }}>
                          {sublink.label}
                        </span>
                        <ArrowRight className="w-5 h-5 text-white/20 group-hover/svc:text-primary group-hover/svc:translate-x-1 transition-all duration-300" />
                      </Link>
                    ) : (
                      <a
                        href={sublink.href}
                        onClick={() => setServicesOpen(false)}
                        className="group/svc flex items-center justify-between py-5 border-b border-white/10 hover:border-primary/50 transition-colors duration-300 cursor-pointer"
                      >
                        <span className="font-heading tracking-wide text-white/80 group-hover/svc:text-white transition-colors duration-300" style={{ fontSize: "clamp(1.25rem, 2.2vw, 2rem)" }}>
                          {sublink.label}
                        </span>
                        <ArrowRight className="w-5 h-5 text-white/20 group-hover/svc:text-primary group-hover/svc:translate-x-1 transition-all duration-300" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </nav>
            </Container>

            {/* Noise overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] mix-blend-overlay">
              <svg width="100%" height="100%">
                <filter id="services-noise">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="4"
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#services-noise)" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Expertise Overlay (Desktop) */}
      <AnimatePresence>
        {expertiseOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] hidden lg:flex bg-[#0a0a0a]"
          >
            <button
              onClick={() => setExpertiseOpen(false)}
              className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <Container className="flex flex-col justify-center h-full">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block"
                style={{ marginBottom: "var(--space-lg)" }}
              >
                {expertiseLink.label}
              </motion.span>

              <nav className="grid grid-cols-2 gap-x-16 gap-y-2">
                {expertiseLink.submenu!.map((sublink, i) => (
                  <motion.div
                    key={sublink.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{
                      delay: 0.15 + i * 0.06,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={sublink.href}
                      onClick={() => setExpertiseOpen(false)}
                      className="group/svc flex items-center justify-between py-5 border-b border-white/10 hover:border-primary/50 transition-colors duration-300 cursor-pointer"
                    >
                      <span className="font-heading tracking-wide text-white/80 group-hover/svc:text-white transition-colors duration-300" style={{ fontSize: "clamp(1.25rem, 2.2vw, 2rem)" }}>
                        {sublink.label}
                      </span>
                      <ArrowRight className="w-5 h-5 text-white/20 group-hover/svc:text-primary group-hover/svc:translate-x-1 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </Container>

            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] mix-blend-overlay">
              <svg width="100%" height="100%">
                <filter id="expertise-noise">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="4"
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#expertise-noise)" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          "bg-background transition-all duration-500",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      >
        <Container className="h-full overflow-y-auto">
          <div className="flex flex-col h-full pt-20 pb-8">
            <nav className="space-y-2">
              {navLinks.map((link, index) => (
                <div key={link.label}>
                  {link.submenu ? (
                    <>
                      <button
                        onClick={() =>
                          setActiveSubmenu(
                            activeSubmenu === link.label ? null : link.label
                          )
                        }
                        className={cn(
                          "w-full flex items-center justify-between py-4",
                          "text-fluid-3xl font-heading",
                          "text-foreground/80 hover:text-foreground transition-colors",
                          "border-b border-border"
                        )}
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "w-6 h-6 transition-transform duration-200",
                            activeSubmenu === link.label && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300",
                          activeSubmenu === link.label
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="py-2 pl-4 space-y-1">
                          {link.submenu.map((sublink) =>
                            sublink.href.startsWith("/") ? (
                              <Link
                                key={sublink.label}
                                href={sublink.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "block py-3 text-fluid-xl font-heading",
                                  "text-foreground/60 hover:text-primary transition-colors"
                                )}
                              >
                                {sublink.label}
                              </Link>
                            ) : (
                              <a
                                key={sublink.label}
                                href={sublink.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "block py-3 text-fluid-xl font-heading",
                                  "text-foreground/60 hover:text-primary transition-colors"
                                )}
                              >
                                {sublink.label}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  ) : link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block py-4 text-fluid-3xl font-heading",
                        "text-foreground/80 hover:text-foreground transition-colors",
                        "border-b border-border"
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block py-4 text-fluid-3xl font-heading",
                        "text-foreground/80 hover:text-foreground transition-colors",
                        "border-b border-border"
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile CTA */}
            <div className="mt-12">
              <Link
                href="/contacts"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "inline-block px-8 py-4 bg-primary",
                  "text-fluid-lg font-heading tracking-wider",
                  "hover:bg-primary/90 transition-colors"
                )}
              >
                {t("getInTouch")}
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-auto pb-8 space-y-2">
              <a
                href="tel:+37322838539"
                className="block text-fluid-base text-muted-foreground hover:text-foreground transition-colors"
              >
                +(373 22) 83 85 39
              </a>
              <a
                href="mailto:info@mediashowgrup.com"
                className="block text-fluid-base text-muted-foreground hover:text-foreground transition-colors"
              >
                info@mediashowgrup.com
              </a>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
