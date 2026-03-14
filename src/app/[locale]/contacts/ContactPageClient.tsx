"use client";

import { useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Clock, ArrowRight, ArrowLeft, Upload, X, Check, CalendarIcon, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/layout";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import dynamic from "next/dynamic";

const Calendar = dynamic(() => import("@/components/ui/calendar").then(m => m.Calendar), { ssr: false });
const Popover = dynamic(() => import("@/components/ui/popover").then(m => m.Popover), { ssr: false });
const PopoverContent = dynamic(() => import("@/components/ui/popover").then(m => m.PopoverContent), { ssr: false });
const PopoverTrigger = dynamic(() => import("@/components/ui/popover").then(m => m.PopoverTrigger), { ssr: false });
const Select = dynamic(() => import("@/components/ui/select").then(m => m.Select), { ssr: false });
const SelectContent = dynamic(() => import("@/components/ui/select").then(m => m.SelectContent), { ssr: false });
const SelectItem = dynamic(() => import("@/components/ui/select").then(m => m.SelectItem), { ssr: false });
const SelectTrigger = dynamic(() => import("@/components/ui/select").then(m => m.SelectTrigger), { ssr: false });
const SelectValue = dynamic(() => import("@/components/ui/select").then(m => m.SelectValue), { ssr: false });

const EVENT_TYPE_KEYS = ["festival", "concert", "conference", "corporate", "brandLaunch", "sports", "custom"] as const;
const SERVICE_KEYS = ["turnkey", "technical", "video", "logistics", "digital", "advertising", "security"] as const;
const GUEST_KEYS = ["upTo100", "100to500", "500to1000", "1000to5000", "5000plus"] as const;
const BUDGET_KEYS = ["undecided", "small", "medium", "large", "enterprise"] as const;

const TOTAL_STEPS = 5;

const inputClass = "bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white text-fluid-sm placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-colors";
const labelClass = "text-fluid-xs font-heading tracking-[0.2em] text-white/40 uppercase";

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-5 py-3 text-fluid-xs font-heading tracking-wider border transition-all duration-200",
        selected
          ? "bg-primary border-primary text-white"
          : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/70"
      )}
    >
      {selected && <Check className="w-3.5 h-3.5 inline mr-2 -mt-0.5" />}
      {children}
    </button>
  );
}

export function ContactPageClient() {
  const t = useTranslations("contactPage");
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const [mode, setMode] = useState<"simple" | "brief">("simple");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Simple form
  const [simple, setSimple] = useState({ name: "", email: "", phone: "", message: "" });

  // Brief wizard
  const [step, setStep] = useState(1);
  const [brief, setBrief] = useState({
    name: "", company: "", email: "", phone: "",
    eventTypes: [] as string[],
    services: [] as string[],
    eventDate: "",
    guestCount: "",
    budget: "",
    details: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleArray = (field: "eventTypes" | "services", key: string) => {
    setBrief((s) => ({
      ...s,
      [field]: s[field].includes(key)
        ? s[field].filter((k) => k !== key)
        : [...s[field], key],
    }));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.size <= 10 * 1024 * 1024) setFile(f);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setStatus("sending");
    try {
      const body = mode === "simple"
        ? { type: "simple", ...simple }
        : { type: "brief", ...brief, fileName: file?.name };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.push("/contacts/thank-you");
      } else setStatus("error");
    } catch { setStatus("error"); }
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canProceed = () => {
    if (step === 1) return brief.name.trim() && brief.email.trim();
    return true;
  };

  const infoItems = [
    { icon: Phone, label: t("info.phoneLabel"), value: t("info.phoneValue"), href: `tel:${t("info.phoneValue").replace(/\s/g, "")}` },
    { icon: Mail, label: t("info.emailLabel"), value: t("info.emailValue"), href: `mailto:${t("info.emailValue")}` },
    { icon: MapPin, label: t("info.addressLabel"), value: t("info.addressValue"), href: undefined },
    { icon: Clock, label: t("info.scheduleLabel"), value: t("info.scheduleValue"), href: undefined },
  ];

  return (
    <>
      <Navbar logoVisible />

      <main>
      {/* Hero */}
      <section className="relative z-10 bg-black pt-32 pb-fluid-lg">
        <Container>
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-fluid-xs font-heading tracking-[0.4em] text-primary uppercase block" style={{ marginBottom: "var(--space-xs)" }}>
            {t("label")}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-heading tracking-tight text-white leading-[1.15]" style={{ fontSize: "clamp(2rem, 5vw, 6rem)" }}>
            {t("title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-fluid-lg text-white/50 mt-4 max-w-2xl">
            {t("subtitle")}
          </motion.p>
        </Container>
      </section>

      {/* Form + Info */}
      <section ref={ref} className="relative z-10 bg-[#0a0a0a] py-fluid-section">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-fluid-xl">
            {/* Form Column */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              {/* Toggle */}
              <div className="flex gap-0 mb-8">
                <button
                  type="button"
                  onClick={() => { setMode("simple"); setStatus("idle"); }}
                  className={cn(
                    "px-6 py-3 font-heading tracking-wider text-fluid-xs transition-all duration-200 border",
                    mode === "simple" ? "bg-white text-black border-white" : "bg-transparent text-white/40 border-white/[0.08] hover:text-white/60"
                  )}
                >
                  {t("modeSimple")}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("brief"); setStatus("idle"); }}
                  className={cn(
                    "px-6 py-3 font-heading tracking-wider text-fluid-xs transition-all duration-200 border border-l-0",
                    mode === "brief" ? "bg-white text-black border-white" : "bg-transparent text-white/40 border-white/[0.08] hover:text-white/60"
                  )}
                >
                  {t("modeBrief")}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {mode === "simple" ? (
                  <motion.form key="simple" onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>{t("form.name")}</label>
                        <input type="text" required value={simple.name} onChange={(e) => setSimple((s) => ({ ...s, name: e.target.value }))} placeholder={t("form.namePlaceholder")} className={inputClass} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>{t("form.email")}</label>
                        <input type="email" required value={simple.email} onChange={(e) => setSimple((s) => ({ ...s, email: e.target.value }))} placeholder={t("form.emailPlaceholder")} className={inputClass} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>{t("form.phone")}</label>
                        <input type="tel" value={simple.phone} onChange={(e) => setSimple((s) => ({ ...s, phone: e.target.value }))} placeholder={t("form.phonePlaceholder")} className={inputClass} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>{t("form.message")}</label>
                      <textarea required rows={4} value={simple.message} onChange={(e) => setSimple((s) => ({ ...s, message: e.target.value }))} placeholder={t("form.messagePlaceholder")} className={cn(inputClass, "resize-none")} />
                    </div>
                    <button type="submit" disabled={status === "sending"} className="group flex items-center justify-between bg-primary px-8 py-4 text-white font-heading tracking-wider text-fluid-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                      {status === "sending" ? t("form.sending") : t("form.send")}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                    {status === "error" && <p className="text-red-400 text-fluid-sm">{t("form.error")}</p>}
                  </motion.form>
                ) : (
                  <motion.div key="brief" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                    {/* Progress bar */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-fluid-xs font-heading tracking-[0.2em] text-white/30">
                          {step} / {TOTAL_STEPS}
                        </span>
                      </div>
                      <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={false}
                          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Contact info */}
                        {step === 1 && (
                          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col gap-6">
                            <h3 className="font-heading text-white text-fluid-base tracking-wide">{t("form.name")} & {t("form.email")}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex flex-col gap-2">
                                <label className={labelClass}>{t("form.name")} *</label>
                                <input type="text" value={brief.name} onChange={(e) => setBrief((s) => ({ ...s, name: e.target.value }))} placeholder={t("form.namePlaceholder")} className={inputClass} />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className={labelClass}>{t("form.company")}</label>
                                <input type="text" value={brief.company} onChange={(e) => setBrief((s) => ({ ...s, company: e.target.value }))} placeholder={t("form.companyPlaceholder")} className={inputClass} />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex flex-col gap-2">
                                <label className={labelClass}>{t("form.email")} *</label>
                                <input type="email" value={brief.email} onChange={(e) => setBrief((s) => ({ ...s, email: e.target.value }))} placeholder={t("form.emailPlaceholder")} className={inputClass} />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className={labelClass}>{t("form.phone")}</label>
                                <input type="tel" value={brief.phone} onChange={(e) => setBrief((s) => ({ ...s, phone: e.target.value }))} placeholder={t("form.phonePlaceholder")} className={inputClass} />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2: Event type */}
                        {step === 2 && (
                          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col gap-6">
                            <h3 className="font-heading text-white text-fluid-base tracking-wide">{t("form.eventType")}</h3>
                            <div className="flex flex-wrap gap-3">
                              {EVENT_TYPE_KEYS.map((key) => (
                                <Chip key={key} selected={brief.eventTypes.includes(key)} onClick={() => toggleArray("eventTypes", key)}>
                                  {t(`form.eventTypes.${key}`)}
                                </Chip>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Services */}
                        {step === 3 && (
                          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col gap-6">
                            <h3 className="font-heading text-white text-fluid-base tracking-wide">{t("form.services")}</h3>
                            <div className="flex flex-wrap gap-3">
                              {SERVICE_KEYS.map((key) => (
                                <Chip key={key} selected={brief.services.includes(key)} onClick={() => toggleArray("services", key)}>
                                  {t(`form.serviceOptions.${key}`)}
                                </Chip>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Step 4: Date, guests, budget */}
                        {step === 4 && (
                          <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col gap-6">
                            <h3 className="font-heading text-white text-fluid-base tracking-wide">{t("form.eventDate")}, {t("form.guestCount")}, {t("form.budget")}</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              {/* Date picker */}
                              <div className="flex flex-col gap-2">
                                <label className={labelClass}>{t("form.eventDate")}</label>
                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                  <PopoverTrigger asChild>
                                    <button type="button" className="bg-white/[0.04] border border-white/[0.08] px-5 h-[52px] text-fluid-sm focus:outline-none focus:border-primary/40 transition-colors flex items-center justify-between w-full text-left">
                                      <span className={selectedDate ? "text-white" : "text-white/20"}>
                                        {selectedDate ? selectedDate.toLocaleDateString() : "—"}
                                      </span>
                                      <CalendarIcon className="w-4 h-4 text-white/30" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent align="start" className="w-auto p-0 bg-[#111] border-white/[0.08] rounded-none">
                                    <Calendar
                                      mode="single"
                                      selected={selectedDate}
                                      onSelect={(date) => {
                                        setSelectedDate(date);
                                        setBrief((s) => ({ ...s, eventDate: date ? date.toISOString().split("T")[0] : "" }));
                                        setCalendarOpen(false);
                                      }}
                                      className="bg-[#111] text-white [--cell-size:40px]"
                                      classNames={{
                                        day: "text-white/70 hover:bg-white/10 rounded-none",
                                        today: "bg-white/[0.06] text-white rounded-none",
                                        outside: "text-white/20",
                                        month_caption: "text-white font-heading tracking-wider",
                                        weekday: "text-white/30 font-heading text-xs",
                                        button_previous: "text-white/40 hover:text-white hover:bg-white/10",
                                        button_next: "text-white/40 hover:text-white hover:bg-white/10",
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              {/* Guest count */}
                              <div className="flex flex-col gap-2">
                                <label className={labelClass}>{t("form.guestCount")}</label>
                                <Select value={brief.guestCount} onValueChange={(v) => setBrief((s) => ({ ...s, guestCount: v }))}>
                                  <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] px-5 h-[52px] text-white text-fluid-sm rounded-none shadow-none focus:border-primary/40 focus:ring-0 data-[placeholder]:text-white/20 [&_svg]:text-white/30">
                                    <SelectValue placeholder="—" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#111] border-white/[0.08] rounded-none">
                                    {GUEST_KEYS.map((key) => (
                                      <SelectItem key={key} value={key} className="text-white/70 font-heading tracking-wider focus:bg-white/[0.06] focus:text-white rounded-none">
                                        {t(`form.guestOptions.${key}`)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Budget */}
                              <div className="flex flex-col gap-2">
                                <label className={labelClass}>{t("form.budget")}</label>
                                <Select value={brief.budget} onValueChange={(v) => setBrief((s) => ({ ...s, budget: v }))}>
                                  <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] px-5 h-[52px] text-white text-fluid-sm rounded-none shadow-none focus:border-primary/40 focus:ring-0 data-[placeholder]:text-white/20 [&_svg]:text-white/30">
                                    <SelectValue placeholder="—" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#111] border-white/[0.08] rounded-none">
                                    {BUDGET_KEYS.map((key) => (
                                      <SelectItem key={key} value={key} className="text-white/70 font-heading tracking-wider focus:bg-white/[0.06] focus:text-white rounded-none">
                                        {t(`form.budgetOptions.${key}`)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 5: Details + file */}
                        {step === 5 && (
                          <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col gap-6">
                            <h3 className="font-heading text-white text-fluid-base tracking-wide">{t("form.details")}</h3>
                            <div className="flex flex-col gap-2">
                              <textarea rows={5} value={brief.details} onChange={(e) => setBrief((s) => ({ ...s, details: e.target.value }))} placeholder={t("form.detailsPlaceholder")} className={cn(inputClass, "resize-none")} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between mt-8 gap-4">
                        {step > 1 ? (
                          <button type="button" onClick={prev} className="group flex items-center gap-2 px-6 py-4 border border-white/[0.08] text-white/50 font-heading tracking-wider text-fluid-xs hover:border-white/20 hover:text-white/70 transition-all">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            {t("form.back")}
                          </button>
                        ) : <div />}

                        {step < TOTAL_STEPS ? (
                          <button type="button" onClick={next} disabled={!canProceed()} className="group flex items-center gap-2 bg-primary px-8 py-4 text-white font-heading tracking-wider text-fluid-xs hover:bg-primary/90 transition-colors disabled:opacity-40">
                            {t("form.next")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        ) : (
                          <button type="button" onClick={handleSubmit} disabled={status === "sending"} className="group flex items-center gap-2 bg-primary px-8 py-4 text-white font-heading tracking-wider text-fluid-xs hover:bg-primary/90 transition-colors disabled:opacity-60">
                            {status === "sending" ? t("form.sending") : t("form.sendBrief")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        )}
                      </div>

                      {status === "error" && <p className="text-red-400 text-fluid-sm mt-4">{t("form.error")}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="flex flex-col gap-8 lg:pt-16">
              {infoItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }} className="flex items-start gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/[0.08] bg-white/[0.03] group-hover:border-primary/30 transition-colors">
                    <item.icon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <span className="text-fluid-xs font-heading tracking-[0.2em] text-white/30 uppercase block mb-1">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-fluid-base text-white hover:text-primary transition-colors font-heading">{item.value}</a>
                    ) : (
                      <span className="text-fluid-base text-white font-heading">{item.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="mt-4">
                <span className="text-fluid-xs font-heading tracking-[0.2em] text-white/30 uppercase block mb-4">{t("social.label")}</span>
                <div className="flex items-center gap-4">
                  <a href="https://www.facebook.com/mediashowgrup" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center border border-white/[0.08] bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.06] transition-all">
                    <svg className="w-5 h-5 text-white/40 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/mediashowgrup" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center border border-white/[0.08] bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.06] transition-all">
                    <svg className="w-5 h-5 text-white/40 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="relative z-10 bg-[#0a0a0a] pb-fluid-section">
        <Container>
          <div className="h-[350px] lg:h-[450px] overflow-hidden border border-white/[0.08]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.5!2d28.8469!3d47.0347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c45d8e4c4b1%3A0x1!2sStrada%20Petricani%2017%2C%20Chi%C8%99in%C4%83u!5e0!3m2!1sen!2smd!4v1"
              width="100%" height="100%"
              style={{ border: 0, filter: "invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.1) grayscale(0.3)" }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Media Show Grup — Strada Petricani 17, Chișinău"
            />
          </div>
        </Container>
      </section>
      </main>

      <Footer />
    </>
  );
}
