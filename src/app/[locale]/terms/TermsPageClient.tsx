"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, useInView, AnimatePresence } from "motion/react";
import { List } from "lucide-react";

/* ────────────────────────────── TOC Data ────────────────────────────── */

const sections = [
  { id: "intro", num: "01", title: "Введение" },
  { id: "definitions", num: "02", title: "Определения" },
  { id: "acceptance", num: "03", title: "Принятие Условий" },
  { id: "site-usage", num: "04", title: "Использование Сайта" },
  { id: "services", num: "05", title: "Описание Услуг" },
  { id: "inquiries", num: "06", title: "Заявки и Обращения" },
  { id: "intellectual", num: "07", title: "Интеллектуальная Собственность" },
  { id: "user-content", num: "08", title: "Пользовательский Контент" },
  { id: "prohibited", num: "09", title: "Запрещенные Действия" },
  { id: "third-party", num: "10", title: "Сторонние Ссылки" },
  { id: "disclaimers", num: "11", title: "Отказ от Гарантий" },
  { id: "liability", num: "12", title: "Ограничение Ответственности" },
  { id: "indemnification", num: "13", title: "Возмещение Убытков" },
  { id: "governing-law", num: "14", title: "Применимое Право" },
  { id: "changes", num: "15", title: "Изменения Условий" },
  { id: "contact", num: "16", title: "Контакты" },
] as const;

/* ──────────────────────── Active Section Hook ──────────────────────── */

function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

/* ────────────────────── Animated Section Wrapper ────────────────────── */

function Section({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      id={id}
      className="scroll-mt-28 border-t border-white/[0.06] pt-10 pb-10"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────── Typography Classes ──────────────────────── */

const h2 = "text-fluid-2xl font-heading tracking-tight text-white mb-5";
const h3 = "text-fluid-lg font-heading tracking-tight text-white/90 mb-3 mt-6 first:mt-0";
const p = "text-fluid-sm text-white/55 leading-[1.8] mb-4 last:mb-0";
const ul = "text-fluid-sm text-white/55 leading-[1.8] mb-4 last:mb-0 space-y-2 pl-5 list-none";
const li = "[&>strong]:text-white/80";
const accent = "text-primary hover:text-primary/80 transition-colors underline underline-offset-4";

/* ══════════════════════════ MAIN COMPONENT ══════════════════════════ */

export function TermsPageClient() {
  const activeSection = useActiveSection();
  const [tocOpen, setTocOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  const tocItems = sections.map((s) => (
    <button
      key={s.id}
      onClick={() => scrollTo(s.id)}
      className={cn(
        "group flex items-center gap-3 w-full text-left py-2 px-3 transition-all duration-200 cursor-pointer",
        activeSection === s.id
          ? "text-white bg-white/[0.04]"
          : "text-white/35 hover:text-white/60"
      )}
    >
      <span
        className={cn(
          "text-[10px] font-heading tracking-widest tabular-nums transition-colors duration-200",
          activeSection === s.id ? "text-primary" : "text-white/20 group-hover:text-white/40"
        )}
      >
        {s.num}
      </span>
      <span className="text-fluid-xs leading-tight">{s.title}</span>
    </button>
  ));

  return (
    <>
      <Navbar />

      <main>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative z-10 bg-[#0a0a0a] pt-32 sm:pt-40 lg:pt-48 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="terms-hero-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#terms-hero-noise)" />
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-fluid-xs font-heading tracking-[0.5em] text-primary uppercase block"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              LEGAL
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-white leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
            >
              Условия использования
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-[2px] bg-primary mx-auto"
              style={{ marginTop: "var(--space-md)", marginBottom: "var(--space-md)" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-fluid-sm text-white/40 font-heading tracking-wider"
            >
              Последнее обновление: 04 декабря 2025 года
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ BODY ═══════════════════════ */}
      <section className="relative z-10 bg-[#0a0a0a] pb-fluid-section">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="terms-body-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#terms-body-noise)" />
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto flex gap-fluid-lg">
            {/* ─── Desktop TOC ─── */}
            <nav className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-28">
                <span className="text-[10px] font-heading tracking-[0.4em] text-white/25 block mb-5 px-3">
                  СОДЕРЖАНИЕ
                </span>
                <div className="flex flex-col">{tocItems}</div>
              </div>
            </nav>

            {/* ─── Content ─── */}
            <div className="flex-1 min-w-0">
              {/* Intro */}
              <Section id="intro">
                <p className={p}>
                  Добро пожаловать на сайт www.mediashowgrup.com (далее — «Сайт»), принадлежащий и управляемый S.C. MEDIA SHOW GRUP S.R.L. (далее — «Компания», «Мы»). Настоящие Условия использования (далее — «Условия») регулируют Ваш доступ к Сайту и его использование.
                </p>
                <p className={p}>
                  Пожалуйста, внимательно ознакомьтесь с настоящими Условиями перед использованием Сайта. Используя Сайт, Вы подтверждаете, что прочитали, поняли и согласны соблюдать настоящие Условия.
                </p>
              </Section>

              {/* Definitions */}
              <Section id="definitions">
                <h2 className={h2}>Определения</h2>
                <ul className={ul}>
                  <li className={li}><strong>Компания</strong> — S.C. MEDIA SHOW GRUP S.R.L., mun. Chişinău, sec. Botanica, str. Busuioceşti, 23, ap.(of.) 4. Физический адрес: str. Petricani, 17, Chișinău, MD2059.</li>
                  <li className={li}><strong>Сайт</strong> — веб-сайт www.mediashowgrup.com и все его страницы.</li>
                  <li className={li}><strong>Пользователь</strong> (далее — «Вы») — любое физическое или юридическое лицо, посещающее или использующее Сайт.</li>
                  <li className={li}><strong>Услуги</strong> — услуги, предлагаемые Компанией: организация мероприятий «под ключ», техническое обеспечение, видеопроизводство, логистика, digital-маркетинг, реклама и обеспечение безопасности.</li>
                  <li className={li}><strong>Контент</strong> — любые тексты, изображения, видео, графика, логотипы и иные материалы, размещенные на Сайте.</li>
                </ul>
              </Section>

              {/* Acceptance */}
              <Section id="acceptance">
                <h2 className={h2}>Принятие Условий</h2>
                <p className={p}>
                  Получая доступ к Сайту или используя его, Вы соглашаетесь с настоящими Условиями и нашей Политикой конфиденциальности. Если Вы не согласны с какой-либо частью этих Условий, пожалуйста, прекратите использование Сайта.
                </p>
                <p className={p}>
                  Использование Сайта разрешено лицам, достигшим 16 лет. Если Вы младше 16 лет, использование Сайта допускается только с согласия родителей или законных представителей.
                </p>
              </Section>

              {/* Site Usage */}
              <Section id="site-usage">
                <h2 className={h2}>Использование Сайта</h2>
                <p className={p}>
                  Сайт предназначен для информационных целей: ознакомления с услугами Компании, портфолио выполненных проектов и отправки обращений через формы обратной связи.
                </p>
                <p className={p}>
                  Сайт не является интернет-магазином. Через Сайт нельзя приобрести товары или услуги напрямую. Все коммерческие условия оказания услуг обсуждаются индивидуально и оформляются отдельными договорами.
                </p>
                <p className={p}>
                  Вы обязуетесь использовать Сайт только в законных целях и в соответствии с настоящими Условиями.
                </p>
              </Section>

              {/* Services */}
              <Section id="services">
                <h2 className={h2}>Описание Услуг</h2>
                <p className={p}>
                  Компания предоставляет полный цикл услуг по организации мероприятий, включая:
                </p>
                <ul className={ul}>
                  <li className={li}>Организация мероприятий «под ключ» (фестивали, концерты, конференции, корпоративы)</li>
                  <li className={li}>Техническое обеспечение (свет, звук, LED-экраны, сценические конструкции)</li>
                  <li className={li}>Видеопроизводство (съемка, монтаж, прямые трансляции)</li>
                  <li className={li}>Логистика мероприятий</li>
                  <li className={li}>Digital-маркетинг и продвижение</li>
                  <li className={li}>Наружная реклама</li>
                  <li className={li}>Обеспечение безопасности</li>
                </ul>
                <p className={p}>
                  Информация об услугах на Сайте носит ознакомительный характер и не является публичной офертой. Стоимость, сроки и условия оказания услуг определяются индивидуально для каждого проекта.
                </p>
              </Section>

              {/* Inquiries */}
              <Section id="inquiries">
                <h2 className={h2}>Заявки и Обращения</h2>
                <p className={p}>
                  Через Сайт Вы можете отправить заявку или заполнить бриф для предварительной оценки проекта. Отправка заявки не является заключением договора и не обязывает ни одну из сторон.
                </p>
                <p className={p}>
                  Информация, предоставленная Вами через формы Сайта, обрабатывается в соответствии с нашей Политикой конфиденциальности. Мы обязуемся связаться с Вами в разумные сроки после получения заявки.
                </p>
                <p className={p}>
                  Вы гарантируете, что информация, указанная в формах, является достоверной и актуальной.
                </p>
              </Section>

              {/* Intellectual Property */}
              <Section id="intellectual">
                <h2 className={h2}>Интеллектуальная Собственность</h2>
                <p className={p}>
                  Весь Контент Сайта, включая, но не ограничиваясь: тексты, фотографии, видеоматериалы, графический дизайн, логотипы, иконки, шрифты и программный код, является собственностью Компании или используется с разрешения правообладателей и защищен законодательством Республики Молдова и международными нормами об интеллектуальной собственности.
                </p>
                <p className={p}>
                  Без письменного согласия Компании запрещается:
                </p>
                <ul className={ul}>
                  <li className={li}>Копирование, воспроизведение или распространение Контента</li>
                  <li className={li}>Модификация или создание производных работ на основе Контента</li>
                  <li className={li}>Использование Контента в коммерческих целях</li>
                  <li className={li}>Удаление или изменение уведомлений об авторских правах</li>
                </ul>
                <p className={p}>
                  Допускается просмотр и загрузка материалов исключительно для личного, некоммерческого использования при условии сохранения всех указаний об авторских правах.
                </p>
              </Section>

              {/* User Content */}
              <Section id="user-content">
                <h2 className={h2}>Пользовательский Контент</h2>
                <p className={p}>
                  Отправляя через формы Сайта любые материалы (тексты, файлы, описания проектов), Вы предоставляете Компании неисключительное право использовать эти материалы для обработки Вашего обращения и подготовки коммерческого предложения.
                </p>
                <p className={p}>
                  Вы гарантируете, что предоставленные материалы не нарушают права третьих лиц, не содержат вредоносного кода и соответствуют законодательству Республики Молдова.
                </p>
              </Section>

              {/* Prohibited */}
              <Section id="prohibited">
                <h2 className={h2}>Запрещенные Действия</h2>
                <p className={p}>При использовании Сайта запрещается:</p>
                <ul className={ul}>
                  <li className={li}>Нарушать действующее законодательство Республики Молдова или международное право</li>
                  <li className={li}>Передавать вредоносное ПО, вирусы или иной деструктивный код</li>
                  <li className={li}>Осуществлять несанкционированный доступ к системам или сетям Сайта</li>
                  <li className={li}>Использовать автоматизированные средства (боты, скраперы) для сбора данных с Сайта</li>
                  <li className={li}>Предоставлять ложную или вводящую в заблуждение информацию</li>
                  <li className={li}>Использовать Сайт для рассылки спама или нежелательных сообщений</li>
                  <li className={li}>Нарушать работоспособность Сайта любым способом</li>
                </ul>
                <p className={p}>
                  Компания оставляет за собой право ограничить доступ к Сайту для лиц, нарушающих настоящие Условия.
                </p>
              </Section>

              {/* Third-party */}
              <Section id="third-party">
                <h2 className={h2}>Сторонние Ссылки и Сервисы</h2>
                <p className={p}>
                  Сайт может содержать ссылки на сторонние веб-сайты и сервисы, которые не контролируются Компанией. Мы не несем ответственности за содержание, политику конфиденциальности или практики сторонних ресурсов.
                </p>
                <p className={p}>
                  Сайт использует сторонние сервисы аналитики и рекламы (Google Analytics, Meta Pixel, Yandex Metrika и другие). Использование этих сервисов регулируется их собственными условиями и политиками конфиденциальности.
                </p>
              </Section>

              {/* Disclaimers */}
              <Section id="disclaimers">
                <h2 className={h2}>Отказ от Гарантий</h2>
                <p className={p}>
                  Сайт предоставляется на условиях «как есть» (as is) и «как доступно» (as available). Компания не гарантирует, что Сайт будет работать бесперебойно, без ошибок или что дефекты будут исправлены.
                </p>
                <p className={p}>
                  Компания не дает никаких явных или подразумеваемых гарантий относительно полноты, точности или актуальности информации на Сайте. Цены, сроки и условия оказания услуг могут отличаться от указанных на Сайте.
                </p>
                <p className={p}>
                  Компания не гарантирует, что Сайт свободен от вирусов или иных вредоносных компонентов.
                </p>
              </Section>

              {/* Liability */}
              <Section id="liability">
                <h2 className={h2}>Ограничение Ответственности</h2>
                <p className={p}>
                  В максимальной степени, допускаемой законодательством Республики Молдова, Компания не несет ответственности за любые прямые, косвенные, случайные, специальные или штрафные убытки, возникающие в результате:
                </p>
                <ul className={ul}>
                  <li className={li}>Использования или невозможности использования Сайта</li>
                  <li className={li}>Любого контента, полученного с Сайта</li>
                  <li className={li}>Несанкционированного доступа к Вашим данным</li>
                  <li className={li}>Действий третьих лиц на Сайте</li>
                  <li className={li}>Перерывов в работе Сайта</li>
                </ul>
                <p className={p}>
                  Данное ограничение применяется независимо от правовой теории, на которой основано требование, даже если Компания была предупреждена о возможности таких убытков.
                </p>
              </Section>

              {/* Indemnification */}
              <Section id="indemnification">
                <h2 className={h2}>Возмещение Убытков</h2>
                <p className={p}>
                  Вы соглашаетесь защитить, возместить и оградить Компанию, её руководителей, сотрудников и партнеров от любых претензий, убытков, расходов и обязательств (включая разумные расходы на юридическую помощь), возникающих в связи с:
                </p>
                <ul className={ul}>
                  <li className={li}>Нарушением Вами настоящих Условий</li>
                  <li className={li}>Нарушением Вами прав третьих лиц</li>
                  <li className={li}>Любым контентом, предоставленным Вами через Сайт</li>
                </ul>
              </Section>

              {/* Governing Law */}
              <Section id="governing-law">
                <h2 className={h2}>Применимое Право и Разрешение Споров</h2>
                <p className={p}>
                  Настоящие Условия регулируются и толкуются в соответствии с законодательством Республики Молдова, без учета коллизионных норм.
                </p>
                <p className={p}>
                  Любые споры, возникающие из настоящих Условий или в связи с ними, подлежат разрешению путем переговоров. В случае невозможности разрешения спора путем переговоров, спор передается на рассмотрение в компетентные суды Республики Молдова по месту нахождения Компании (г. Кишинёв).
                </p>
                <p className={p}>
                  Если какое-либо положение настоящих Условий будет признано недействительным или неисполнимым, остальные положения сохраняют свою силу.
                </p>
              </Section>

              {/* Changes */}
              <Section id="changes">
                <h2 className={h2}>Изменения Условий</h2>
                <p className={p}>
                  Компания оставляет за собой право изменять настоящие Условия в любое время. Обновленные Условия вступают в силу с момента их публикации на Сайте.
                </p>
                <p className={p}>
                  Продолжение использования Сайта после публикации изменений означает Ваше согласие с обновленными Условиями. Мы рекомендуем периодически проверять эту страницу.
                </p>
              </Section>

              {/* Contact */}
              <Section id="contact">
                <h2 className={h2}>Свяжитесь с Нами</h2>
                <p className={p}>
                  Если у Вас есть вопросы по настоящим Условиям:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <a
                    href="mailto:info@mediashowgrup.com"
                    className="group flex items-center gap-4 border border-white/[0.08] hover:border-primary/30 p-5 transition-all duration-300"
                  >
                    <span className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <div>
                      <span className="text-[10px] font-heading tracking-[0.3em] text-white/30 block">EMAIL</span>
                      <span className="text-fluid-sm text-white/70 group-hover:text-white transition-colors">info@mediashowgrup.com</span>
                    </div>
                  </a>
                  <a
                    href="tel:+37322838539"
                    className="group flex items-center gap-4 border border-white/[0.08] hover:border-primary/30 p-5 transition-all duration-300"
                  >
                    <span className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </span>
                    <div>
                      <span className="text-[10px] font-heading tracking-[0.3em] text-white/30 block">ТЕЛЕФОН</span>
                      <span className="text-fluid-sm text-white/70 group-hover:text-white transition-colors">+(373 22) 83 85 39</span>
                    </div>
                  </a>
                </div>
              </Section>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════ Mobile TOC Button ═══════════════════ */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-12 h-12 bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* ═══════════════════ Mobile TOC Panel ═══════════════════ */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setTocOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#111] border-t border-white/10 max-h-[70vh] overflow-y-auto"
            >
              <div className="p-6">
                <span className="text-[10px] font-heading tracking-[0.4em] text-white/25 block mb-4">
                  СОДЕРЖАНИЕ
                </span>
                <div className="flex flex-col">{tocItems}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      </main>

      <Footer />
    </>
  );
}
