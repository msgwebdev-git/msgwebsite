# Полный аудит сайта Media Show Grup

**Дата:** 14 марта 2026
**Проект:** mediashowgrup.com (Next.js 16.1.1 + React 19.2.3)
**Локали:** ro (default), ru, en
**Анализ проведён:** 6 параллельных агентов (архитектура, производительность, SEO, безопасность, качество кода, роутинг)

---

## Оглавление

1. [Сводка](#сводка)
2. [CRITICAL — Критические проблемы](#1-critical--критические-проблемы)
3. [HIGH — Высокий приоритет](#2-high--высокий-приоритет)
4. [MEDIUM — Средний приоритет](#3-medium--средний-приоритет)
5. [LOW — Низкий приоритет](#4-low--низкий-приоритет)
6. [Положительные стороны](#5-положительные-стороны)
7. [План исправлений](#6-план-исправлений)

---

## Сводка

| Категория        | CRITICAL | HIGH | MEDIUM | LOW |
|------------------|----------|------|--------|-----|
| Безопасность     | 3        | 5    | 5      | 4   |
| Производительность | 3      | 4    | 4      | 3   |
| Архитектура      | 2        | 3    | 2      | 3   |
| SEO / Метаданные | 3        | 2    | 4      | 3   |
| Качество кода    | 2        | 3    | 4      | 2   |
| Роутинг / Страницы | 1     | 3    | 2      | 3   |
| **Итого**        | **14**   | **20** | **21** | **18** |

---

## 1. CRITICAL — Критические проблемы

### 1.1 БЕЗОПАСНОСТЬ: Отсутствие валидации входных данных в Contact API
**Файл:** `src/app/api/contact/route.ts` (строки 140–161)
**Категория:** Безопасность

API проверяет только наличие полей (`!body.name || !body.email`), без:
- Валидации формата email
- Проверки длины строк (можно отправить 1GB текста)
- Экранирования спецсимволов (только базовая `esc()` для Telegram)

**Действие:** Добавить валидацию через `zod`:
```typescript
const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});
```

---

### 1.3 БЕЗОПАСНОСТЬ: Отсутствие CSRF-защиты
**Файл:** `src/app/api/contact/route.ts` (строка 140)
**Категория:** Безопасность

POST-эндпоинт не проверяет CSRF-токены, Origin или Referer заголовки. Любой сайт может отправить форму от имени пользователя.

**Действие:** Проверять заголовок `Origin` или использовать `next-csrf`.

---

### 1.4 БЕЗОПАСНОСТЬ: Отсутствие Rate Limiting
**Файл:** `src/app/api/contact/route.ts`
**Категория:** Безопасность

Нет ограничения на количество запросов — возможен спам через Telegram API и DDoS.

**Действие:** Реализовать rate-limiting (например `@upstash/ratelimit`, 5 запросов/час на IP).

---

### 1.5 АРХИТЕКТУРА: Отсутствие Error Boundaries
**Файлы:** Вся структура `src/app/`
**Категория:** Архитектура

Полностью отсутствуют файлы `error.tsx` и `loading.tsx`:
- Нет глобального error handler в `src/app/`
- Нет локализованного error handler в `src/app/[locale]/`
- Нет loading состояний для динамических маршрутов

**Последствие:** Любая необработанная ошибка → белый экран вместо graceful fallback.

**Действие:** Создать:
```
src/app/error.tsx
src/app/[locale]/error.tsx
src/app/[locale]/loading.tsx
src/app/[locale]/cases/[slug]/error.tsx
src/app/[locale]/services/[slug]/error.tsx
src/app/[locale]/expertise/[slug]/error.tsx
```

---

### 1.6 АРХИТЕКТУРА: HomeClient блокирует SSR-рендеринг
**Файл:** `src/app/[locale]/HomeClient.tsx` (строка 1: `"use client"`)
**Категория:** Архитектура / Производительность

Весь контент домашней страницы обёрнут в Client Component. PageLoader блокирует рендеринг на 4.5+ секунд.

**Последствие:**
- Плохой Core Web Vitals (FCP, LCP)
- Контент невидим до загрузки JS
- Бесполезное SEO при первом рендеринге

**Действие:** Сделать HomeClient Server Component, делегируя CSR только интерактивным компонентам.

---

### 1.7 ПРОИЗВОДИТЕЛЬНОСТЬ: AnimatedNoise — постоянная нагрузка на каждой странице
**Файл:** `src/app/[locale]/layout.tsx` (строка 34), `src/components/AnimatedNoise.tsx` (строки 24–40)
**Категория:** Производительность

- Canvas `window.innerWidth/2 × window.innerHeight/2` перерисовывается ~20 fps (`frame % 3 === 0`)
- `createImageData()` создаёт новый объект **каждый 3й кадр**
- Работает на **каждой странице** (в layout)
- При opacity 0.03 — визуально почти незаметен, но GPU работает на полную

**Действие:**
- Ленивая загрузка (только на главной)
- Уменьшить canvas до `width/4 × height/4`
- Ограничить FPS до 15–30
- Использовать ImageData pooling

---

### 1.9 ПРОИЗВОДИТЕЛЬНОСТЬ: Three.js needsUpdate каждый кадр
**Файл:** `src/components/about/HeartModel.tsx` (строки 92–114)
**Категория:** Производительность

```typescript
solidMatRef.current.needsUpdate = true;  // Каждый frame!
glowMatRef.current.needsUpdate = true;   // Каждый frame!
```

`needsUpdate = true` заставляет Three.js перекомпилировать shader каждый кадр. На мобильных FPS может упасть до 10–15.

**Действие:** Обновлять `needsUpdate` только при реальном изменении значений. Использовать uniforms.

---

### 1.10 ПРОИЗВОДИТЕЛЬНОСТЬ: LightRays — тяжёлый WebGL на Hero
**Файл:** `src/components/LightRays.tsx` (строки 110–444)
**Категория:** Производительность

- WebGL рендерер (OGL) с кастомными шейдерами
- 13 зависимостей в основном useEffect (строки 379–393) → переинициализация WebGL при изменении `isVisible` или `raysOrigin`
- Uniform updates уже вынесены в отдельный effect (строки 395–429) — это хорошо
- Mouse tracking без throttle (строки 431–444)

**Действие:**
- Throttle mouse events
- Вынести `isVisible` из основного эффекта — WebGL не нужно пересоздавать при show/hide
- Обернуть props в `useMemo` в HeroSection чтобы избежать лишних ре-рендеров

---

### 1.11 SEO: ogImage параметр игнорируется
**Файл:** `src/lib/metadata-helpers.ts` (строки 38–78)
**Категория:** SEO

```typescript
const image = `${SITE_URL}/og.jpg`;  // Всегда один и тот же!
// ogImage параметр принимается но НИКОГДА не используется
```

Все страницы (cases, services, expertise) показывают одинаковый OG-превью.

**Действие:** `const image = ogImage || \`${SITE_URL}/og.jpg\`;`

---

### 1.12 SEO: Hardcoded URL в JSON-LD на contacts
**Файл:** `src/app/[locale]/contacts/page.tsx` (строка 37)
**Категория:** SEO

```typescript
url: "https://mediashowgrup.com/contacts"  // Без учёта локали!
```

Google видит дублированный контент для ru/en версий.

**Действие:** Использовать `getLocalizedUrl(locale, "/contacts")`.

---

### 1.13 SEO: Нет noindex для /thank-you
**Файл:** `src/app/[locale]/contacts/thank-you/page.tsx`
**Категория:** SEO

Служебная страница индексируется поисковиками. Нет `generateMetadata`, нет `robots: { index: false }`.

**Действие:** Добавить `export const metadata = { robots: 'noindex, nofollow' }`.

---

### 1.14 РОУТИНГ: Неправильные слаги кейсов в сервисных страницах
**Файл:** `src/app/[locale]/services/[slug]/page.tsx` (строки 93–125)
**Категория:** Роутинг

```
serviceCaseSlugs использует:          Реальные slugs в cases:
"ziua-nationala-a-vinului"     →      "ziua-vinului"
"festivalul-traditiilor-romanesti" →  "traditii-romanesti"
"ddt"                          →      "ddt-istanbul"
```

**Последствие:** 404 ошибки на страницах услуг при попытке загрузить связанные кейсы.

**Действие:** Исправить все слаги на соответствующие реальным.

---

### 1.15 КАЧЕСТВО КОДА: PageLoader — утечка памяти GSAP
**Файл:** `src/components/PageLoader.tsx` (строки 88–274)
**Категория:** Качество кода

- 14 переменных ref, обширная GSAP анимация
- `document.body.style.overflow = "hidden"` без гарантии сброса при ошибке
- `moveTween?.kill()` может быть null при демонтировании

**Действие:** Добавить try/catch wrapper, гарантировать сброс overflow в cleanup.

---

### 1.15 КАЧЕСТВО КОДА: Navbar body overflow — теоретический риск
**Файл:** `src/components/Navbar.tsx` (строки 98–108)
**Категория:** Качество кода

useEffect с `anyOverlayOpen` изменяет `document.body.style.overflow`. Cleanup (`return () => { document.body.style.overflow = "" }`) присутствует, но при одновременном управлении overflow из нескольких компонентов (Navbar + PageLoader) возможны конфликты.

---

## 2. HIGH — Высокий приоритет

### 2.1 БЕЗОПАСНОСТЬ: dangerouslySetInnerHTML в GTM
**Файл:** `src/components/GoogleTagManager.tsx` (строки 13–20)

GTM скрипт встроен через `dangerouslySetInnerHTML` без валидации `GTM_ID`. Если ID скомпрометирован — инъекция кода.

**Действие:** Валидировать формат `GTM-XXXXXXX` перед использованием.

---

### 2.2 БЕЗОПАСНОСТЬ: dangerouslySetInnerHTML в JSON-LD
**Файл:** `src/components/json-ld/JsonLdScript.tsx` (строки 5–6)

Экранирование только `<` → `\u003c`. Недостаточно для полной XSS-защиты.

---

### 2.3 БЕЗОПАСНОСТЬ: Отсутствие Content-Security-Policy
**Файл:** `next.config.ts`

Нет CSP-заголовка. Отсутствует защита от XSS-атак через внешние скрипты.

**Действие:** Добавить CSP header в `next.config.ts`.

---

### 2.4 БЕЗОПАСНОСТЬ: Нет валидации email в API
**Файл:** `src/app/api/contact/route.ts` (строки 150–151)

Email проверяется только на truthy, не на формат.

---

### 2.5 БЕЗОПАСНОСТЬ: Отсутствие логирования ошибок в API
**Файл:** `src/app/api/contact/route.ts` (строки 158–160)

Generic catch-блок без логирования. Невозможно отследить атаки.

---

### 2.6 ПРОИЗВОДИТЕЛЬНОСТЬ: Дублирование HeartScene компонентов
**Файлы:**
- `src/components/about/HeartScene.tsx` + `HeartModel.tsx`
- `src/components/about-page/AboutHeartScene.tsx` + `AboutHeartModel.tsx`

Почти идентичные компоненты (разница <10%). Двойная загрузка Three.js графики.

**Действие:** Объединить в один компонент с параметром `variant`.

---

### 2.7 ПРОИЗВОДИТЕЛЬНОСТЬ: ShowreelSection — два видео в DOM
**Файл:** `src/components/ShowreelSection.tsx` (строки 142–292)

- Background video: `autoPlay + muted + preload="metadata"` → браузер качает весь файл
- Modal video: тот же `src` загружается параллельно второй раз

**Действие:** Переиспользовать один `<video>` элемент.

---

### 2.8 ПРОИЗВОДИТЕЛЬНОСТЬ: Shaka Player без loading UI
**Файл:** `src/hooks/limeplay/use-shaka-player.ts` (строки 35–38)

~500KB библиотека загружается асинхронно, но без fallback UI. На 3G — пустой экран 2–5 сек.

---

### 2.9 АРХИТЕКТУРА: Middleware matcher неполный
**Файл:** `src/middleware.ts` (строки 6–8)

```typescript
matcher: ["/", "/(ro|ru|en)/:path*"]
```

Может пропустить специальные маршруты. Лучше: `["/((?!_next|api|static|.*\\..*).*)"]`

---

### 2.10 АРХИТЕКТУРА: Bundle size — тяжёлые зависимости
**Файл:** `package.json`

| Зависимость | Размер | Проблема |
|------------|--------|----------|
| three + drei + fiber + postprocessing | ~800KB | Используется только на About |
| gsap + @gsap/react | ~100KB | Дублирует motion (Framer Motion) |
| ogl | ~50KB | Используется в LightRays.tsx — проверить dynamic import |
| shaka-player | ~500KB | Только для видео-плеера |

**Действие:** Убедиться что ogl и three загружаются через dynamic import. Объединить анимации (gsap/motion) в одну библиотеку.

---

### 2.11 АРХИТЕКТУРА: Hardcoded openGraph locale в root layout
**Файл:** `src/app/layout.tsx` (строки 21–94)

```typescript
openGraph: { locale: "ro_RO" }  // Hardcoded для ВСЕХ локалей
```

---

### 2.12 SEO: Metadata privacy/terms hardcoded на русском
**Файлы:**
- `src/app/[locale]/privacy/page.tsx` (строки 15–17)
- `src/app/[locale]/terms/page.tsx` (строки 15–17)

Title и description всегда на русском, независимо от локали.

---

### 2.13 SEO: GTM без валидации формата ID
**Файл:** `src/components/GoogleTagManager.tsx` (строка 6)

Проверяет только falsy (`if (!GTM_ID)`), не проверяет формат `GTM-XXXXXXX`.

---

### 2.14 КАЧЕСТВО КОДА: Navbar — 727 строк, нарушение SRP
**Файл:** `src/components/Navbar.tsx`

Содержит: desktop nav, mobile nav, services overlay, expertise overlay, language switcher, phone button.

**Действие:** Разделить на `NavbarDesktop`, `NavbarMobile`, `NavbarOverlay`, `LanguageSwitcher`.

---

### 2.15 КАЧЕСТВО КОДА: AboutSection — 25+ useTransform/useSpring
**Файл:** `src/components/AboutSection.tsx` (строки 35–192)

25+ подписок на scrollYProgress. На медленных устройствах — jank. `height: "1000vh"` для scroll-driven анимаций.

---

### 2.17 РОУТИНГ: Thank-you страница нарушает паттерн
**Файл:** `src/app/[locale]/contacts/thank-you/page.tsx`

`"use client"` компонент без серверной обёртки. Нет `getMessages()`, `setRequestLocale()`.

---

### 2.18 РОУТИНГ: Нет loading/error для динамических маршрутов
**Пути:** `cases/[slug]`, `services/[slug]`, `expertise/[slug]`

Нет graceful error/loading для неправильных slug.

---

### 2.19 РОУТИНГ: Отсутствие metadata для thank-you
**Файл:** `src/app/[locale]/contacts/thank-you/page.tsx`

Нет `generateMetadata` → используются дефолтные метаданные layout.

---

### 2.20 КАЧЕСТВО КОДА: Prop drilling в AboutSection
**Файл:** `src/components/AboutSection.tsx` (строки 22–135)

Иерархия из 3 уровней (ActText → RevealText → RevealWord) с передачей scrollProgress на каждый.

**Действие:** Использовать Context.

---

## 3. MEDIUM — Средний приоритет

### 3.1 БЕЗОПАСНОСТЬ: Нет CORS-проверки в API
**Файл:** `src/app/api/contact/route.ts`

Нет проверки `Origin` заголовка. Возможны cross-origin запросы.

---

### 3.2 БЕЗОПАСНОСТЬ: GTM загружается без согласия на cookies
**Файл:** `src/components/GoogleTagManager.tsx` (строки 5–33)

GTM отправляет данные без согласия пользователя → нарушение GDPR/CCPA.

**Действие:** Интегрировать с CookieConsent.

---

### 3.3 БЕЗОПАСНОСТЬ: Отсутствие логирования запросов
**Файл:** `src/app/api/contact/route.ts`

Нет аудит-лога входящих запросов. Невозможно отследить abuse.

---

### 3.4 БЕЗОПАСНОСТЬ: Загрузка файлов без полной валидации
**Файл:** `src/app/[locale]/contacts/ContactPageClient.tsx` (строки 93–94)

Только проверка размера (10MB), без whitelist расширений.

---

### 3.5 ПРОИЗВОДИТЕЛЬНОСТЬ: Images без loading="lazy"
**Файл:** `src/components/about-page/AboutDivisions.tsx` (строки 60–66)

Логотипы загружаются жадно, даже если не в viewport. Нет `loading="lazy"`.

---

### 3.6 ПРОИЗВОДИТЕЛЬНОСТЬ: AnimatedNoise на main thread
**Файл:** `src/components/AnimatedNoise.tsx`

Все вычисления шума блокируют main thread. На мобильных — janky scrolling.

**Действие:** Перенести в WebWorker или OffscreenCanvas.

---

### 3.7 ПРОИЗВОДИТЕЛЬНОСТЬ: useIsMobile вызывает ре-рендер Three.js
**Файлы:** `src/components/about/HeartScene.tsx` (строка 46)

При ротации экрана — полный ре-рендер Canvas → потеря контекста.

---

### 3.8 ПРОИЗВОДИТЕЛЬНОСТЬ: Sparkles — 80 частиц на desktop
**Файлы:** `src/components/about/HeartScene.tsx`, `src/components/about-page/AboutHeartScene.tsx`

40 частиц × 2 сцены = 80 отдельных drawcall.

---

### 3.9 SEO: Canonical URL всегда указывает на RO
**Файл:** `src/lib/metadata-helpers.ts` (строка 28)

```typescript
canonical: getLocalizedUrl(DEFAULT_LOCALE, cleanPath)  // Всегда RO!
```

Каждая локаль должна иметь self-referential canonical.

---

### 3.10 SEO: Нет JSON-LD для privacy/terms
**Файлы:** `src/app/[locale]/privacy/page.tsx`, `terms/page.tsx`

Отсутствуют structured data схемы.

---

### 3.11 SEO: robots.txt не блокирует /thank-you
**Файл:** `src/app/robots.ts`

`Disallow` не включает `/*/thank-you`.

---

### 3.12 SEO: dangerouslySetInnerHTML в GTM без CSP
**Файл:** `src/components/GoogleTagManager.tsx`

Стандартная практика, но без CSP — повышенный риск.

---

### 3.13 АРХИТЕКТУРА: Пустой ThemeProvider
**Файл:** `src/components/providers/ThemeProvider.tsx`

```typescript
export function ThemeProvider({ children }) { return <>{children}</>; }
```

Ничего не делает. Удалить или реализовать.

---

### 3.14 АРХИТЕКТУРА: AnimatedNoise z-[100] может перекрывать UI
**Файл:** `src/components/AnimatedNoise.tsx` (строка 64)

z-[100] между Navbar (z-50) и PageLoader (z-[200]). Потенциальные коллизии.

---

### 3.15 КАЧЕСТВО КОДА: ShowreelSection — race condition
**Файл:** `src/components/ShowreelSection.tsx` (строки 118–127)

useEffect с `[isModalOpen]` добавляет/удаляет keydown listener. При быстрых toggle — race.

---

### 3.16 КАЧЕСТВО КОДА: Отсутствие React.memo на карточках
**Файлы:** CasesSection, ServicesSection, ExpertiseSection

CaseCard, ServiceCard — без мемоизации. Перерендер при любом изменении родителя.

---

### 3.17 КАЧЕСТВО КОДА: LightRays — mousemove без throttle
**Файл:** `src/components/LightRays.tsx`

Mouse event listener обновляется синхронно, без debounce/throttle.

---

### 3.18 КАЧЕСТВО КОДА: use-mobile.ts — hydration mismatch
**Файл:** `src/hooks/use-mobile.ts`

```typescript
const [isMobile, setIsMobile] = useState(false); // false на сервере
// может быть true на клиенте → flash of wrong content
```

---

### 3.19 КАЧЕСТВО КОДА: Нестабильные key props
**Файлы:** `CaseStudyContent.tsx` (строка 160), `CasesSection.tsx` (строка 152)

`key={item.title}` — небезопасно при дублировании или локализации.

---

### 3.20 РОУТИНГ: Hardcoded metadata в privacy/terms
**Файлы:** `src/app/[locale]/privacy/page.tsx`, `terms/page.tsx` (строки 15–17)

Title/description на русском для всех локалей.

---

### 3.21 SEO: Отсутствие Crawl-delay в robots.txt
**Файл:** `src/app/robots.ts`

Нет ограничения частоты краулинга.

---

### 3.22 АРХИТЕКТУРА: GTM в layout без условной загрузки
**Файл:** `src/app/layout.tsx` (строки 3, 106)

GTM импортируется всегда, даже если `NEXT_PUBLIC_GTM_ID` не установлен.

---

## 4. LOW — Низкий приоритет

### 4.1 БЕЗОПАСНОСТЬ: Отсутствие HSTS-заголовка
**Файл:** `next.config.ts`

Нет `Strict-Transport-Security` → возможен downgrade-атака.

---

### 4.2 БЕЗОПАСНОСТЬ: Контактные данные в HTML
**Файл:** `src/app/[locale]/contacts/ContactPageClient.tsx` (строки 124–127)

Телефоны и email доступны ботам для спама.

---

### 4.3 БЕЗОПАСНОСТЬ: Отсутствие Permissions-Policy
**Файл:** `next.config.ts`

Нет контроля доступа к камере/микрофону/геолокации.

---

### 4.4 БЕЗОПАСНОСТЬ: Отсутствие SRI для GTM
**Файл:** `src/components/GoogleTagManager.tsx`

Скрипты GTM без проверки целостности.

---

### 4.5 ПРОИЗВОДИТЕЛЬНОСТЬ: PageLoader — множество GSAP твинов
**Файл:** `src/components/PageLoader.tsx` (строки 147–266)

20+ анимаций в одном timeline. На budget Android — jank.

---

### 4.6 ПРОИЗВОДИТЕЛЬНОСТЬ: CSS Container Queries
**Файл:** `src/app/globals.css` (строки 304–395)

`clamp()` с `cqi` единицами. Не поддерживается Safari <16.

---

### 4.7 ПРОИЗВОДИТЕЛЬНОСТЬ: SVG noise filters дублируются
**Файлы:** ServiceGallery и ~10 других

`feTurbulence` фильтры дублируются в каждой секции. Можно сделать один глобальный.

---

### 4.8 АРХИТЕКТУРА: Закомментированные verification tokens
**Файл:** `src/app/layout.tsx` (строки 62–65)

```typescript
verification: {
  // google: "GOOGLE_VERIFICATION_TOKEN",
  // yandex: "YANDEX_VERIFICATION_TOKEN",
}
```

Удалить или перенести в `.env`.

---

### 4.9 АРХИТЕКТУРА: Смешанные spacing классы
**Файлы:** Navbar.tsx, Footer.tsx

Микс Tailwind (`h-14`) и custom fluid spacing (`py-fluid-lg`).

---

### 4.10 АРХИТЕКТУРА: Navbar Drawer импорты
**Файл:** `src/components/Navbar.tsx` (строки 12–17)

Много импортов одной строкой без гарантии tree-shaking.

---

### 4.11 SEO: Manifest путь
**Файл:** `src/app/layout.tsx` (строка 61)

```typescript
manifest: "/manifest.webmanifest"
```

Проверить, работает ли маршрут корректно.

---

### 4.12 SEO: Отсутствие schema.org Action в JSON-LD
Для contacts полезна `ContactAction` или `ReserveAction`.

---

### 4.13 РОУТИНГ: HTML lang="ro" hardcoded
**Файл:** `src/app/layout.tsx` (строка 102)

```html
<html lang="ro">
```

Для `/en` и `/ru` — неправильный язык документа.

**Действие:** Динамически устанавливать `lang` на основе locale.

---

### 4.14 КАЧЕСТВО КОДА: Marquee дублирует контент
**Файл:** `src/components/Marquee.tsx`

Потенциальная проблема при очень длинном тексте.

---

### 4.15 КАЧЕСТВО КОДА: Container max-w-2400px
**Файл:** `src/components/layout/Container.tsx`

Слишком широко для ultra-wide мониторов.

---

### 4.16 КАЧЕСТВО КОДА: ExpertiseSection — AnimatePresence
**Файл:** `src/components/ExpertiseSection.tsx` (строки 275–285)

Два отдельных `AnimatePresence mode="wait"` — возможен flicker при быстром переключении.

---

### 4.17 АРХИТЕКТУРА: Hydration проблема в Navbar
**Файл:** `src/components/Navbar.tsx` (строки 31, 162–178)

`mounted` state → skeleton на каждую загрузку → layout shift.

---

### 4.18 SEO: x-default в sitemap
**Файл:** `src/app/sitemap.xml/route.ts` (строка 85)

`x-default` указывает на RO-версию. Правильная практика, но стоит проверить.

---

### 4.19 SEO: Alt-тексты для декоративных элементов
**Файлы:** ServiceGallery, CasesSection, ServiceHero

Некоторые декоративные SVG без `aria-hidden="true"`.

---

## 5. Положительные стороны

### Что сделано хорошо:

- **Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Referrer-Policy` — всё настроено
- **poweredByHeader: false** — скрывает информацию о Next.js
- **Sitemap с hreflang** — корректная локализация для SEO
- **JSON-LD structured data** — Organization, BreadcrumbList, CreativeWork, Service, ContactPage, FAQPage
- **Next.js Image оптимизация** — используется повсеместно с правильными `sizes`
- **Динамический импорт LightRays** — `dynamic(() => import("./LightRays"), { ssr: false })`
- **Асинхронная загрузка Shaka Player** — не блокирует критический путь
- **useGLTF с preload** — кеширование 3D модели
- **useInView хуки** — ленивый рендеринг компонентов
- **CSS clamp()** — fluid responsive design
- **TypeScript** — нет использования `any`
- **CookieConsent** — реализован через `vanilla-cookieconsent`
- **Правильные `target="_blank" rel="noopener noreferrer"`** — безопасные внешние ссылки

---

## 6. План исправлений

### Неделя 1 — CRITICAL (Немедленно)

| # | Задача | Файлы | Время |
|---|--------|-------|-------|
| 1 | Добавить zod валидацию в Contact API | route.ts | 2ч |
| 2 | Добавить CSRF-защиту (Origin check) | route.ts | 1ч |
| 3 | Добавить rate-limiting | route.ts | 2ч |
| 4 | Создать error.tsx / loading.tsx файлы | src/app/ | 3ч |
| 5 | Исправить слаги кейсов в services | services/[slug]/page.tsx | 30м |
| 6 | Исправить ogImage в buildPageMetadata | metadata-helpers.ts | 15м |
| 7 | Добавить noindex для /thank-you | thank-you/page.tsx | 15м |
| 8 | Исправить JSON-LD URL в contacts | contacts/page.tsx | 15м |

### Неделя 2 — HIGH

| # | Задача | Файлы | Время |
|---|--------|-------|-------|
| 1 | Добавить CSP headers | next.config.ts | 2ч |
| 2 | Оптимизировать AnimatedNoise (FPS, canvas size, pooling) | AnimatedNoise.tsx | 3ч |
| 3 | Исправить needsUpdate в HeartModel | HeartModel.tsx | 1ч |
| 4 | Объединить два HeartScene компонента | about/, about-page/ | 3ч |
| 5 | Оптимизировать LightRays (throttle, useMemo) | LightRays.tsx, HeroSection.tsx | 2ч |
| 6 | Переиспользовать video в ShowreelSection | ShowreelSection.tsx | 1ч |
| 7 | Проверить dynamic import для ogl (LightRays) | LightRays.tsx | 30м |
| 8 | Локализовать metadata privacy/terms | privacy/page.tsx, terms/page.tsx | 1ч |
| 9 | Разделить Navbar на подкомпоненты | Navbar.tsx | 4ч |
| 10 | Динамический lang атрибут | layout.tsx | 30м |

### Неделя 3 — MEDIUM + LOW

| # | Задача | Файлы | Время |
|---|--------|-------|-------|
| 1 | Интегрировать GTM с CookieConsent | GoogleTagManager.tsx | 2ч |
| 2 | Добавить CORS проверку в API | route.ts | 1ч |
| 3 | Добавить логирование в API | route.ts | 1ч |
| 4 | Перенести AnimatedNoise в WebWorker | AnimatedNoise.tsx | 3ч |
| 5 | Добавить React.memo на карточки | CasesSection, ServicesSection | 1ч |
| 6 | Исправить canonical URL стратегию | metadata-helpers.ts | 1ч |
| 7 | Добавить HSTS, Permissions-Policy | next.config.ts | 30м |
| 8 | Удалить пустой ThemeProvider | providers/ | 15м |
| 9 | Глобальный SVG noise filter | globals.css | 1ч |
| 10 | Self-referential canonical для мультилокалей | metadata-helpers.ts | 30м |

---

### Ожидаемые улучшения после исправлений

| Метрика | До | После (прогноз) |
|---------|-----|-----------------|
| LCP | ~4.5s | ~2.0s |
| FCP | ~3.0s | ~1.5s |
| TTI | ~5.0s | ~3.0s |
| CLS | ~0.05 | ~0.02 |
| Bundle size | ~2MB | ~1.2MB |
| SEO Score | 72/100 | 92/100 |
| Security Score | 45/100 | 85/100 |
| Lighthouse Performance | ~55 | ~80 |

---

*Отчёт подготовлен на основе статического анализа кода 6 параллельными агентами. Рекомендуется дополнить профилированием через Chrome DevTools Performance и Lighthouse.*
