# Анализ проекта: Media Show Grup (msgsite)

## Стек технологий

| Категория | Технологии |
|-----------|------------|
| **Фреймворк** | Next.js 16.1.1, React 19.2.3, TypeScript 5 |
| **Стилизация** | Tailwind CSS v4, кастомная Fluid Design System (clamp-based) |
| **Анимации** | GSAP, Motion (Framer Motion), WebGL/GLSL шейдеры |
| **3D графика** | Three.js, React Three Fiber, OGL |
| **UI компоненты** | Radix UI (Shadcn-подход), кастомные компоненты |
| **Стейт** | Zustand |
| **i18n** | next-intl (3 языка: RO, RU, EN) |
| **Видео** | Shaka Player, HTML5 Video API |

---

## Масштаб проекта

- **~4,950 строк кода** в 50 исходных файлах
- **2 страницы** (главная + плеер)
- **8 основных секций** на главной странице
- **3D модель** сердца (GLB) с анимацией при скролле
- **WebGL шейдер** световых лучей (LightRays — 454 строки GLSL)
- **Сложный page loader** с heartbeat-анимацией на GSAP
- **2 реализации видеоплеера** (Limeplay + Basic)
- **Полная интернационализация** (RO/RU/EN с роутингом)

---

## Структура проекта

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          — Корневой layout (шрифты, провайдеры, noise-оверлей)
│   │   └── page.tsx            — Главная страница (все секции)
│   ├── player/
│   │   └── page.tsx            — Страница видеоплеера
│   ├── favicon.ico
│   └── globals.css             — Fluid Design System, CSS-переменные, цвета
├── components/
│   ├── about/
│   │   ├── HeartModel.tsx      — 3D модель сердца (Three.js)
│   │   └── HeartScene.tsx      — Canvas-обёртка для 3D сцены
│   ├── basic-player/           — Простой видеоплеер (4 файла)
│   ├── limeplay/               — Продвинутый видеоплеер (8 файлов)
│   ├── layout/
│   │   ├── Container.tsx       — Fluid-контейнер
│   │   ├── Section.tsx         — Секция с адаптивными отступами
│   │   └── FluidGrid.tsx       — CSS Grid с fluid-гэпами
│   ├── providers/
│   │   └── ThemeProvider.tsx    — Тема приложения
│   ├── ui/                     — UI-компоненты (8 файлов: button, card, accordion, tabs...)
│   ├── AboutSection.tsx        — Scroll-driven секция с 3D сердцем (279 строк)
│   ├── AnimatedNoise.tsx       — Canvas-шум поверх страницы (74 строки)
│   ├── HeroSection.tsx         — Hero-баннер с анимациями (212 строк)
│   ├── LightRays.tsx           — WebGL световые лучи (454 строки, GLSL шейдер)
│   ├── Marquee.tsx             — Бегущая строка (47 строк)
│   ├── Navbar.tsx              — Навигация с i18n (455 строк)
│   ├── PageLoader.tsx          — Лоадер с heartbeat-анимацией (394 строки)
│   ├── ProcessSection.tsx      — Аккордеон процесса (311 строк)
│   ├── ServicesSection.tsx     — Карточки услуг (150 строк)
│   ├── ShowreelSection.tsx     — Видео-шоурил с модалкой (317 строк)
│   └── SplitText.tsx           — Посимвольная анимация текста (82 строки)
├── hooks/
│   └── limeplay/
│       ├── use-player.ts       — Хук видеоплеера (374 строки)
│       └── use-shaka-player.ts — Shaka Player хук (66 строк)
├── i18n/                       — Конфигурация интернационализации (3 файла)
├── lib/
│   ├── create-media-store.ts   — Zustand store
│   └── utils.ts                — Утилиты (cn, clsx)
└── middleware.ts               — i18n middleware
```

---

## Самые сложные компоненты

| Компонент | Строк | Сложность | Технологии |
|-----------|-------|-----------|------------|
| **LightRays.tsx** | 454 | Очень высокая | WebGL, OGL, кастомные GLSL шейдеры, mouse-tracking |
| **Navbar.tsx** | 455 | Очень высокая | React hooks, i18n, адаптив, мобильное меню |
| **PageLoader.tsx** | 394 | Очень высокая | GSAP timeline, SVG-анимации, частицы, heartbeat |
| **use-player.ts** | 374 | Высокая | Video API, Zustand, state management |
| **ShowreelSection.tsx** | 317 | Высокая | Motion, модальное окно, видео-контроли |
| **ProcessSection.tsx** | 311 | Высокая | Motion, AnimatePresence, accordion, прогресс-линия |
| **AboutSection.tsx** | 279 | Очень высокая | Motion scroll, 3D canvas, split text, 5 актов |
| **HeroSection.tsx** | 212 | Высокая | Motion, SVG, адаптивные бордеры |
| **HeartModel.tsx** | 159 | Высокая | Three.js, GLTF, scroll-синхронизация, Sparkles |

---

## Технические особенности

### WebGL шейдер (LightRays)
- Кастомный GLSL фрагментный шейдер
- Генерация световых лучей в реальном времени
- Отслеживание позиции мыши
- Noise-алгоритм для органичного движения
- GPU-ускоренный рендеринг через OGL

### 3D графика (AboutSection + HeartModel)
- React Three Fiber для рендеринга Three.js в React
- Загрузка GLB-модели сердца (useGLTF)
- Синхронизация вращения/позиции с позицией скролла
- Sparkles-эффект (частицы)
- Ambient + Directional освещение

### GSAP анимации (PageLoader)
- Многофазный timeline с последовательными анимациями
- SVG path-анимация heartbeat-линии
- Частицы, разлетающиеся от логотипа
- Staggered текстовые анимации
- Координация с появлением остального контента

### Fluid Design System
- Полностью кастомная система на CSS `clamp()`
- 10 уровней типографики (от xs до hero)
- 8 уровней отступов
- Адаптивные гэпы для grid
- Брейкпоинты от 640px до 2560px (4K)

### Scroll-Driven анимации
- AboutSection: 1000vh контейнер с 5 актами текста
- SplitText: посимвольная анимация по скроллу
- Navbar: изменение высоты и прозрачности
- HeroSection: параллакс-эффекты

### Интернационализация
- 3 языка: румынский (RO), русский (RU), английский (EN)
- Роутинг через префикс `/ro/`, `/ru/`, `/en/`
- Переключатель языков в Navbar
- next-intl с серверными и клиентскими хелперами

---

## Зависимости (package.json)

### Продакшн (24 пакета)
- `next` 16.1.1, `react` 19.2.3, `react-dom` 19.2.3
- `gsap` 3.14.2, `@gsap/react` 2.1.2
- `motion` 12.23.26
- `three` 0.182.0, `@react-three/fiber` 9.5.0, `@react-three/drei` 10.7.7, `@react-three/postprocessing` 3.0.4
- `ogl` 1.0.11
- `@radix-ui/react-accordion`, `collapsible`, `hover-card`, `tabs`, `tooltip`, `slot`, `compose-refs`
- `next-intl` 4.6.1
- `zustand` 5.0.9
- `shaka-player` 4.16.12
- `lucide-react` 0.562.0, `@phosphor-icons/react` 2.1.10
- `class-variance-authority` 0.7.1, `clsx` 2.1.1, `tailwind-merge` 3.4.0

### Dev (7 пакетов)
- `typescript` ~5, `@tailwindcss/postcss` 4, `tw-animate-css` 1.4.0
- `eslint`, `eslint-config-next`, `@types/*`

---

## Лог разработки

### День 1 (~6ч)
создал проект на некст, тайпскрипт и tailwind
дальше взяться за eslint, postcss и tsconfig
настроил eslint, postcss и tsconfig, алиас @/* работает
теперь шрифты — подключил Google Fonts: Geist Sans, Geist Mono, Oswald
дальше i18n — поставил next-intl
настроил 3 локали ro, ru, en, дефолтная ro
написал middleware для роутинга по языкам
сделал routing.ts, request.ts, navigation.ts
структура готова — app/[locale]/layout.tsx и page.tsx работают, можно двигаться дальше

### День 2 (~5ч)
перехожу к Fluid Design System
начал с globals.css — прописываю CSS-переменные
сделал fluid-типографику на clamp(), 10 уровней от xs до hero
дальше fluid-отступы — --space-xs до --space-section, тоже на clamp()
добавил fluid-гэпы --gap-xs до --gap-xl
настроил --container-padding с clamp
прописал цветовую палитру в OKLch — primary #FF4931, bg #0a0a0a, fg #f5f5f5
теперь layout-компоненты — написал Container.tsx, Section.tsx, FluidGrid.tsx
брейкпоинты от sm(640) до 4xl(2560) настроены, дизайн-система готова

### День 3 (~5ч)
берусь за UI-компоненты
поставил Radix UI — accordion, collapsible, hover-card, tabs, tooltip, slot
поставил class-variance-authority, clsx, tailwind-merge
сделал базовые компоненты в стиле Shadcn: Button, Card, Accordion, Tabs, Tooltip, HoverCard, Collapsible
написал кастомный CutoutButton с hover-эффектами под бренд
сделал ThemeProvider
утилита cn() готова в lib/utils.ts
UI-кит собран, дальше начинаю собирать страницу

### День 4–5 (~14ч)
начинаю Navbar — тут много логики, вышло 455 строк
сделал sticky-хедер, при скролле меняется высота и прозрачность
переключатель языков RO/RU/EN — на десктопе dropdown, на мобиле кнопки
мобильное меню-гамбургер с оверлеем
анимация размера логотипа при скролле
навбар готов, перехожу к PageLoader
поставил gsap и @gsap/react
делаю heartbeat-анимацию — SVG path-анимация линии пульса
добавил частицы, разлетаются от логотипа
staggered текстовые анимации
собрал многофазный timeline — лоадер плавно переходит в контент
настроил координацию: когда лоадер заканчивается, показываются Navbar и Hero
PageLoader вышел на 394 строки, но работает гладко

### День 6–7 (~14ч)
перехожу к самому сложному — WebGL-эффект световых лучей
поставил ogl для рендеринга
начал LightRays — пишу кастомный GLSL фрагментный шейдер
написал noise-алгоритм для органичного движения лучей
сделал mouse-tracking, лучи реагируют на курсор
передаю uniforms — time, resolution, mouse — в шейдер
рендеринг через OGL на GPU
LightRays вышел на 454 строки, самый тяжёлый компонент в проекте
обернул в dynamic() import с ssr: false, чтобы не ломал серверный рендер
теперь HeroSection — подключил LightRays как фон
поставил motion (framer-motion), lucide-react, @phosphor-icons/react
добавил CutoutButton, staggered-анимации на Motion
сделал адаптивные SVG-бордеры
Hero готов, выглядит мощно

### День 8–9 (~12ч)
берусь за 3D-секцию About
поставил three, @react-three/fiber, @react-three/drei, @react-three/postprocessing
подготовил GLB-модель сердца — heart.glb, 24.9KB
написал HeartModel.tsx — загрузка через useGLTF, вращение синхронизировано со скроллом
добавил Sparkles-эффект, частицы вокруг сердца
настроил освещение — ambient + directional
HeartScene.tsx — Canvas-обёртка с Suspense, обернул в dynamic() import
теперь сам AboutSection — scroll-driven театр
контейнер на 1000vh, 5 актов текста
каждый акт появляется и исчезает на своём участке скролла
useScroll + useTransform из Motion для управления
sticky viewport с 3D-канвасом, brightness и filter меняются по скроллу
ещё написал SplitText — посимвольная анимация текста по скроллу, 82 строки
секция About готова

### День 10–11 (~12ч)
перехожу к видеоплееру
поставил shaka-player для стриминга
написал use-player.ts хук — 374 строки, вся логика плеера тут
написал use-shaka-player.ts для Shaka
сделал Limeplay-плеер — 8 файлов: media-provider, playback-control, player-layout, root-container, fallback-poster
сделал basic-player как запасной вариант, 4 файла
Zustand store для media state в create-media-store.ts
теперь ShowreelSection — видео открывается в fullscreen-модалке
кастомные контролы: прогресс-бар, mute, fullscreen
закрытие по Escape
poster-заглушка showreel-poster.jpg
видео-секция работает

### День 12 (~6ч)
делаю ProcessSection — аккордеон из 5 шагов процесса работы
Motion AnimatePresence для open/close анимаций
прогресс-линия с заливкой между шагами
pulse-эффект на активном шаге
connector-линии между шагами
дальше ServicesSection — сетка из 5 карточек услуг с hover-эффектами
и Marquee — бегущая строка с тэглайном компании
секции готовы

### День 13 (~4ч)
AnimatedNoise — Canvas-оверлей с анимированным шумом поверх всей страницы, 74 строки
подключил в layout.tsx
финальная сборка page.tsx — все секции в правильном порядке:
PageLoader → Navbar → HeroSection → Marquee → ShowreelSection → AboutSection → ServicesSection
настроил координацию loaderDone state между компонентами
всё собрано, переходить к тестам

### День 14–15 (~10ч)
тестирую на разных разрешениях — mobile, tablet, desktop, 4K
проверяю все 3 языка — переключение, роутинг, тексты
кроссбраузерность — Chrome, Safari, Firefox
оптимизация — dynamic imports для LightRays и HeartScene
проверил performance, WebGL не тормозит на мобилках
поправил мелкие баги в анимациях
финальная полировка таймингов и easing
проверил accessibility — ARIA-лейблы, семантика, keyboard navigation
всё готово

---

**Итого: ~85–120 часов чистой разработки (~2–3 недели fulltime)**

---

## Git-история

| Дата | Коммит |
|------|--------|
| 2025-12-04 | единственный коммит проекта (коммит-сообщение было указано ошибочно) |

Проект залит одним коммитом, поэтому точная хронология разработки не отслеживается.
