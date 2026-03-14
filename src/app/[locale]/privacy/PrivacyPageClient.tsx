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
  { id: "definitions", num: "02", title: "Интерпретация и Определения" },
  { id: "data-collection", num: "03", title: "Сбор Персональных Данных" },
  { id: "tracking", num: "04", title: "Cookies и Отслеживание" },
  { id: "data-usage", num: "05", title: "Использование Данных" },
  { id: "data-retention", num: "06", title: "Хранение Данных" },
  { id: "data-transfer", num: "07", title: "Передача Данных" },
  { id: "data-deletion", num: "08", title: "Удаление Данных" },
  { id: "disclosure", num: "09", title: "Раскрытие Данных" },
  { id: "security", num: "10", title: "Безопасность" },
  { id: "children", num: "11", title: "Конфиденциальность Детей" },
  { id: "ccpa", num: "12", title: "Права CCPA / CPRA" },
  { id: "third-party", num: "13", title: "Сторонние Ссылки" },
  { id: "changes", num: "14", title: "Изменения Политики" },
  { id: "contact", num: "15", title: "Контакты" },
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

function Section({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
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
const ul =
  "text-fluid-sm text-white/55 leading-[1.8] mb-4 last:mb-0 space-y-2 pl-5 list-none";
const li = "[&>strong]:text-white/80";
const accent = "text-primary hover:text-primary/80 transition-colors underline underline-offset-4";

/* ══════════════════════════ MAIN COMPONENT ══════════════════════════ */

export function PrivacyPageClient() {
  const activeSection = useActiveSection();
  const [tocOpen, setTocOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  /* ─── TOC items ─── */
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
        {/* Noise */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="privacy-hero-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#privacy-hero-noise)" />
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
              Политика конфиденциальности
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
        {/* Noise */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="privacy-body-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#privacy-body-noise)" />
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
                  Эта Политика конфиденциальности описывает наши политики и процедуры по сбору, использованию и раскрытию Вашей информации при использовании Сайта www.mediashowgrup.com и рассказывает о Ваших правах на конфиденциальность и о том, как закон защищает Вас.
                </p>
                <p className={p}>
                  Мы используем Ваши Персональные данные для улучшения Сайта. Используя Сайт, Вы соглашаетесь со сбором и использованием информации в соответствии с этой Политикой конфиденциальности.
                </p>
                <p className={p}>
                  В соответствии с Законом № 195/2024 о защите персональных данных Республики Молдова (который полностью транспонирует Общий регламент по защите данных — GDPR ЕС), Мы выступаем в качестве оператора данных и соблюдаем юридические требования по защите данных. Надзорный орган — Национальный центр по защите персональных данных (CNPDCP).
                </p>
              </Section>

              {/* Definitions */}
              <Section id="definitions">
                <h2 className={h2}>Интерпретация и Определения</h2>
                <h3 className={h3}>Интерпретация</h3>
                <p className={p}>
                  Слова, начальные буквы которых написаны с заглавной буквы, имеют значения, определенные в следующих условиях. Следующие определения имеют одинаковое значение независимо от того, появляются ли они в единственном или множественном числе.
                </p>
                <h3 className={h3}>Определения</h3>
                <p className={p}>В целях этой Политики конфиденциальности:</p>
                <ul className={ul}>
                  <li className={li}><strong>Компания</strong> — S.C. MEDIA SHOW GRUP S.R.L., mun. Chişinău, sec. Botanica, str. Busuioceşti, 23, ap.(of.) 4. Физический адрес: str. Petricani, 17, Chișinău, MD2059.</li>
                  <li className={li}><strong>Персональные Данные</strong> — любая информация, относящаяся к идентифицированному или идентифицируемому физическому лицу.</li>
                  <li className={li}><strong>Cookies</strong> — небольшие файлы, размещаемые на Вашем устройстве, содержащие детали истории просмотра.</li>
                  <li className={li}><strong>Устройство</strong> — любое устройство, которое может получить доступ к Сайту (компьютер, телефон, планшет).</li>
                  <li className={li}><strong>Поставщик Услуг</strong> — физическое или юридическое лицо, обрабатывающее данные от имени Компании.</li>
                  <li className={li}><strong>Данные Использования</strong> — данные, собираемые автоматически при использовании Сайта.</li>
                  <li className={li}><strong>Сайт</strong> — www.mediashowgrup.com</li>
                  <li className={li}><strong>Страна</strong> — Республика Молдова.</li>
                </ul>
              </Section>

              {/* Data Collection */}
              <Section id="data-collection">
                <h2 className={h2}>Сбор и Использование Ваших Персональных Данных</h2>
                <h3 className={h3}>Персональные Данные</h3>
                <p className={p}>
                  При использовании Нашего Сайта Мы можем попросить Вас предоставить определенную личную информацию, которая может включать:
                </p>
                <ul className={ul}>
                  <li className={li}>Адрес электронной почты</li>
                  <li className={li}>Имя и фамилия</li>
                  <li className={li}>Номер телефона</li>
                  <li className={li}>Адрес</li>
                  <li className={li}>Другие сведения из форм обратной связи</li>
                </ul>
                <h3 className={h3}>Данные Использования</h3>
                <p className={p}>
                  Данные Использования собираются автоматически и могут включать: IP-адрес, тип и версию браузера, посещенные страницы, время и дату посещения, время на страницах, уникальные идентификаторы устройства и диагностические данные.
                </p>
                <p className={p}>
                  При доступе через мобильное устройство дополнительно собираются: тип устройства, уникальный ID, мобильная ОС и тип браузера.
                </p>
              </Section>

              {/* Tracking */}
              <Section id="tracking">
                <h2 className={h2}>Технологии Отслеживания и Cookies</h2>
                <p className={p}>
                  Мы используем Cookies и подобные технологии для отслеживания активности на Сайте и хранения информации. Технологии включают beacons, tags и scripts.
                </p>
                <ul className={ul}>
                  <li className={li}><strong>Browser Cookies</strong> — файл на Вашем устройстве. Вы можете настроить браузер на отказ от Cookies, однако некоторые функции могут быть недоступны.</li>
                  <li className={li}><strong>Web Beacons</strong> — электронные файлы для подсчета посетителей и статистики.</li>
                </ul>
                <p className={p}>Мы используем следующие типы Cookies:</p>
                <ul className={ul}>
                  <li className={li}><strong>Необходимые</strong> (Сессионные) — для предоставления услуг и аутентификации.</li>
                  <li className={li}><strong>Cookies Принятия</strong> (Постоянные) — фиксируют согласие пользователя на cookies.</li>
                  <li className={li}><strong>Функциональные</strong> (Постоянные) — запоминают языковые предпочтения и настройки.</li>
                </ul>
              </Section>

              {/* Data Usage */}
              <Section id="data-usage">
                <h2 className={h2}>Использование Ваших Персональных Данных</h2>
                <p className={p}>Компания может использовать Персональные Данные для:</p>
                <ul className={ul}>
                  <li className={li}>Предоставления и поддержания Сайта</li>
                  <li className={li}>Управления Вашим Аккаунтом</li>
                  <li className={li}>Выполнения контрактных обязательств</li>
                  <li className={li}>Связи с Вами по email, телефону или иным каналам</li>
                  <li className={li}>Предоставления новостей и информации о событиях</li>
                  <li className={li}>Управления Вашими запросами</li>
                  <li className={li}>Анализа данных и улучшения Сайта</li>
                </ul>
                <p className={p}>Мы можем делиться информацией:</p>
                <ul className={ul}>
                  <li className={li}><strong>С Поставщиками Услуг:</strong> Google Analytics, Meta Pixel, Yandex Metrika, Sendpulse, Google Ads, Meta Ads.</li>
                  <li className={li}><strong>При бизнес-трансферах:</strong> слияние, продажа активов, приобретение.</li>
                  <li className={li}><strong>С Аффилиатами:</strong> с обязательством соблюдать эту Политику.</li>
                  <li className={li}><strong>С бизнес-партнерами:</strong> для предложения услуг.</li>
                  <li className={li}><strong>С Вашим согласием:</strong> для любой другой цели.</li>
                </ul>
                <p className={cn(p, "font-medium text-white/70")}>
                  Мы не продаем Вашу личную информацию третьим сторонам.
                </p>
              </Section>

              {/* Data Retention */}
              <Section id="data-retention">
                <h2 className={h2}>Хранение Ваших Персональных Данных</h2>
                <p className={p}>
                  Компания хранит Ваши данные только столько, сколько необходимо для целей данной Политики, соблюдения юридических обязательств, разрешения споров и исполнения соглашений.
                </p>
                <p className={p}>
                  Данные Использования обычно хранятся короче, за исключением случаев усиления безопасности или юридических обязательств.
                </p>
              </Section>

              {/* Data Transfer */}
              <Section id="data-transfer">
                <h2 className={h2}>Передача Ваших Персональных Данных</h2>
                <p className={p}>
                  Информация обрабатывается в офисах Компании и в местах расположения обрабатывающих сторон. Данные могут передаваться и храниться за пределами Вашей юрисдикции, где законы о защите данных могут отличаться.
                </p>
                <p className={p}>
                  Компания предпримет все разумные шаги для обеспечения безопасной обработки данных. Никакая передача не будет осуществлена без установления адекватных мер контроля.
                </p>
              </Section>

              {/* Data Deletion */}
              <Section id="data-deletion">
                <h2 className={h2}>Удаление Ваших Персональных Данных</h2>
                <p className={p}>
                  У Вас есть право удалить или запросить помощь в удалении Персональных Данных. Вы можете обновить, изменить или удалить информацию, связавшись с Нами.
                </p>
                <p className={p}>
                  Мы можем сохранять определенную информацию при наличии юридического обязательства или законной основы.
                </p>
              </Section>

              {/* Disclosure */}
              <Section id="disclosure">
                <h2 className={h2}>Раскрытие Ваших Персональных Данных</h2>
                <h3 className={h3}>Бизнес-Транзакции</h3>
                <p className={p}>
                  При участии Компании в слиянии, приобретении или продаже активов данные могут быть переданы. Мы уведомим Вас до передачи.
                </p>
                <h3 className={h3}>Правоохранительные Органы</h3>
                <p className={p}>
                  Компания может раскрыть данные по требованию закона или в ответ на запросы государственных органов.
                </p>
                <h3 className={h3}>Другие Юридические Требования</h3>
                <ul className={ul}>
                  <li className={li}>Соблюдение юридического обязательства</li>
                  <li className={li}>Защита прав или имущества Компании</li>
                  <li className={li}>Предотвращение или расследование нарушений</li>
                  <li className={li}>Защита безопасности пользователей и общественности</li>
                  <li className={li}>Защита от юридической ответственности</li>
                </ul>
              </Section>

              {/* Security */}
              <Section id="security">
                <h2 className={h2}>Безопасность Ваших Персональных Данных</h2>
                <p className={p}>
                  Мы стремимся использовать коммерчески приемлемые средства защиты, но ни один метод передачи через Интернет не является абсолютно безопасным.
                </p>
                <h3 className={h3}>Сторонние Поставщики</h3>
                <ul className={ul}>
                  <li className={li}>Google Analytics — аналитика</li>
                  <li className={li}>Meta Pixel — аналитика и реклама</li>
                  <li className={li}>Yandex Metrika — аналитика</li>
                  <li className={li}>Sendpulse — email-рассылки</li>
                  <li className={li}>Google Ads — реклама</li>
                  <li className={li}>Meta Ads — реклама</li>
                </ul>
              </Section>

              {/* Children */}
              <Section id="children">
                <h2 className={h2}>Конфиденциальность Детей</h2>
                <p className={p}>
                  Сайт может собирать информацию от детей младше 13 лет только с верифицированного согласия родителей (COPPA). Мы не раскрываем эту информацию третьим сторонам, кроме необходимого для работы Сайта.
                </p>
                <p className={p}>
                  Родители могут предоставить согласие, связавшись по адресу{" "}
                  <a href="mailto:info@mediashowgrup.com" className={accent}>info@mediashowgrup.com</a>.
                  Родители имеют право просматривать, изменять или удалять информацию ребенка и отказать в дальнейшем сборе.
                </p>
              </Section>

              {/* CCPA */}
              <Section id="ccpa">
                <h2 className={h2}>Специфические Права (CCPA / CPRA)</h2>
                <p className={p}>
                  Жители Калифорнии имеют права в соответствии с CCPA, CPRA и CalOPPA.
                </p>
                <h3 className={h3}>Категории собираемой информации</h3>
                <p className={p}>
                  Идентификаторы (имя, email, IP), характеристики защищенных классификаций (возраст), интернет-активность (просмотры), геолокация (приблизительная).
                </p>
                <h3 className={h3}>Ваши права</h3>
                <ul className={ul}>
                  <li className={li}><strong>Право знать</strong> — какую информацию мы собираем и раскрываем</li>
                  <li className={li}><strong>Право на удаление</strong> — запросить удаление информации</li>
                  <li className={li}><strong>Право на opt-out</strong> — отказ от продажи/обмена информации</li>
                  <li className={li}><strong>Право на ограничение</strong> — использования чувствительной информации</li>
                  <li className={li}><strong>Право на недискриминацию</strong> — за реализацию своих прав</li>
                  <li className={li}><strong>Право на исправление</strong> — неточной информации</li>
                </ul>
                <p className={p}>
                  Для подачи запроса:{" "}
                  <a href="mailto:info@mediashowgrup.com" className={accent}>info@mediashowgrup.com</a>.
                  Срок ответа — 45 дней.
                </p>
              </Section>

              {/* Third-party */}
              <Section id="third-party">
                <h2 className={h2}>Ссылки на Другие Веб-сайты</h2>
                <p className={p}>
                  Сайт может содержать ссылки на сторонние ресурсы. Мы рекомендуем ознакомиться с их Политиками конфиденциальности.
                </p>
                <p className={p}>
                  Мы не контролируем и не несем ответственности за содержание, политики или практики сторонних сайтов.
                </p>
              </Section>

              {/* Changes */}
              <Section id="changes">
                <h2 className={h2}>Изменения в Политике конфиденциальности</h2>
                <p className={p}>
                  Мы можем обновлять Политику. Уведомление будет размещено на этой странице, а также отправлено по email до вступления изменений в силу.
                </p>
              </Section>

              {/* Contact */}
              <Section id="contact">
                <h2 className={h2}>Свяжитесь с Нами</h2>
                <p className={p}>
                  Если у Вас есть вопросы по этой Политике:
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
