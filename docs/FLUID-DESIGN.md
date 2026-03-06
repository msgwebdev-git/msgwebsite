# Fluid Design System

Система адаптивного дизайна с плавным масштабированием от мобильных устройств до 4K мониторов.

---

## Оглавление

1. [Философия](#философия)
2. [Быстрый старт](#быстрый-старт)
3. [Компоненты Layout](#компоненты-layout)
4. [Fluid Typography](#fluid-typography)
5. [Fluid Spacing](#fluid-spacing)
6. [Fluid Grid](#fluid-grid)
7. [CSS Variables](#css-variables)
8. [Примеры](#примеры)

---

## Философия

**Проблема классического подхода:**
```tsx
// Много breakpoints, "прыгающие" размеры
<h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl">
```

**Решение — Fluid Design:**
```tsx
// Один класс, плавное масштабирование
<h1 className="text-fluid-4xl">
```

Используем CSS `clamp()` — размеры плавно растут вместе с viewport, без резких переходов на breakpoints.

---

## Быстрый старт

### Импорт компонентов
```tsx
import { Container, Section, FluidGrid } from "@/components/layout";
```

### Базовая структура страницы
```tsx
export default function Page() {
  return (
    <main>
      {/* Hero секция на весь экран */}
      <Section fullHeight>
        <Container>
          <h1 className="text-fluid-hero">Заголовок</h1>
          <p className="text-fluid-xl">Подзаголовок</p>
        </Container>
      </Section>

      {/* Обычная секция */}
      <Section>
        <Container>
          <h2 className="text-fluid-3xl">Секция</h2>
          <FluidGrid>
            {/* карточки */}
          </FluidGrid>
        </Container>
      </Section>
    </main>
  );
}
```

---

## Компоненты Layout

### Container

Контейнер с адаптивной шириной и отступами.

```tsx
import { Container } from "@/components/layout";

// Стандартный — 96% ширины, макс 2400px
<Container>
  {children}
</Container>

// Узкий — для текстового контента, макс 1200px
<Container variant="narrow">
  {children}
</Container>

// Полная ширина — 100% с боковыми отступами
<Container variant="full">
  {children}
</Container>

// Как другой HTML элемент
<Container as="header">
<Container as="footer">
<Container as="section">
```

| Prop | Значения | По умолчанию |
|------|----------|--------------|
| `variant` | `"fluid"` \| `"full"` \| `"narrow"` | `"fluid"` |
| `as` | `"div"` \| `"section"` \| `"article"` \| `"main"` \| `"header"` \| `"footer"` | `"div"` |
| `className` | string | — |

---

### Section

Секция с адаптивными вертикальными отступами.

```tsx
import { Section } from "@/components/layout";

// Стандартная секция
<Section>
  {children}
</Section>

// На весь экран (hero)
<Section fullHeight>
  {children}
</Section>

// Разные размеры отступов
<Section spacing="sm">   {/* маленькие */}
<Section spacing="md">   {/* средние */}
<Section spacing="lg">   {/* большие */}
<Section spacing="xl">   {/* очень большие */}
<Section spacing="section"> {/* стандартные для секций */}

// С id для навигации
<Section id="about">
```

| Prop | Значения | По умолчанию |
|------|----------|--------------|
| `spacing` | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"section"` | `"section"` |
| `fullHeight` | boolean | `false` |
| `id` | string | — |
| `className` | string | — |

---

### FluidGrid

Адаптивная сетка с автоматическим количеством колонок.

```tsx
import { FluidGrid } from "@/components/layout";

// Базовое использование
<FluidGrid>
  <Card />
  <Card />
  <Card />
</FluidGrid>

// Минимальная ширина элементов
<FluidGrid minItemWidth="sm">  {/* мин 250px */}
<FluidGrid minItemWidth="md">  {/* мин 320px */}
<FluidGrid minItemWidth="lg">  {/* мин 400px */}
<FluidGrid minItemWidth="xl">  {/* мин 500px */}

// Размер отступов между элементами
<FluidGrid gap="xs">
<FluidGrid gap="sm">
<FluidGrid gap="md">
<FluidGrid gap="lg">
<FluidGrid gap="xl">
```

| Prop | Значения | По умолчанию |
|------|----------|--------------|
| `minItemWidth` | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | `"md"` |
| `gap` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | `"md"` |
| `className` | string | — |

---

## Fluid Typography

### Классы

| Класс | Диапазон | Использование |
|-------|----------|---------------|
| `text-fluid-hero` | 3.5rem → 8rem | Главный заголовок landing |
| `text-fluid-5xl` | 3rem → 6rem | Большие заголовки |
| `text-fluid-4xl` | 2.25rem → 4.5rem | Заголовки секций |
| `text-fluid-3xl` | 1.875rem → 3.5rem | Подзаголовки |
| `text-fluid-2xl` | 1.5rem → 2.5rem | Крупный текст |
| `text-fluid-xl` | 1.25rem → 1.875rem | Акцентный текст |
| `text-fluid-lg` | 1.125rem → 1.5rem | Увеличенный текст |
| `text-fluid-base` | 1rem → 1.25rem | Основной текст |
| `text-fluid-sm` | 0.875rem → 1rem | Мелкий текст |
| `text-fluid-xs` | 0.75rem → 0.875rem | Очень мелкий текст |

### Примеры
```tsx
<h1 className="text-fluid-hero font-bold">Landing Title</h1>
<h2 className="text-fluid-3xl font-semibold">Section Title</h2>
<p className="text-fluid-base text-muted-foreground">Body text</p>
<span className="text-fluid-sm">Caption</span>
```

### Дополнительные утилиты для текста
```tsx
<h1 className="text-balance">  {/* Балансировка строк заголовка */}
<p className="text-pretty">    {/* Красивые переносы абзаца */}
```

---

## Fluid Spacing

### Padding секций
```tsx
<div className="py-fluid-section">  {/* 4rem → 10rem */}
<div className="py-fluid-xl">       {/* 2rem → 4rem */}
<div className="py-fluid-lg">       {/* 1.5rem → 3rem */}
<div className="py-fluid-md">       {/* 1rem → 2rem */}
```

### Gap между элементами
```tsx
<div className="flex gap-fluid-xl">   {/* 3rem → 6rem */}
<div className="flex gap-fluid-lg">   {/* 2rem → 4rem */}
<div className="flex gap-fluid-md">   {/* 1.5rem → 2.5rem */}
<div className="flex gap-fluid-sm">   {/* 1rem → 1.5rem */}
<div className="flex gap-fluid-xs">   {/* 0.5rem → 1rem */}
```

---

## Fluid Grid

### CSS классы (альтернатива компоненту)

```tsx
// Автоматическая сетка
<div className="grid-auto-fit gap-fluid-md">

// Сетки для карточек с разными размерами
<div className="grid-cards-sm">  {/* мин 250px */}
<div className="grid-cards-md">  {/* мин 320px */}
<div className="grid-cards-lg">  {/* мин 400px */}
```

---

## CSS Variables

Все переменные определены в `src/app/globals.css`:

### Typography
```css
--font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--font-size-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
--font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
--font-size-lg: clamp(1.125rem, 1rem + 0.65vw, 1.5rem);
--font-size-xl: clamp(1.25rem, 1rem + 1vw, 1.875rem);
--font-size-2xl: clamp(1.5rem, 1.1rem + 1.5vw, 2.5rem);
--font-size-3xl: clamp(1.875rem, 1.2rem + 2.5vw, 3.5rem);
--font-size-4xl: clamp(2.25rem, 1.3rem + 3.5vw, 4.5rem);
--font-size-5xl: clamp(3rem, 1.5rem + 5vw, 6rem);
--font-size-hero: clamp(3.5rem, 2rem + 6vw, 8rem);
```

### Spacing
```css
--space-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
--space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 1rem);
--space-md: clamp(1rem, 0.8rem + 1vw, 2rem);
--space-lg: clamp(1.5rem, 1rem + 2vw, 3rem);
--space-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
--space-2xl: clamp(3rem, 2rem + 4vw, 6rem);
--space-3xl: clamp(4rem, 2.5rem + 5vw, 8rem);
--space-section: clamp(4rem, 3rem + 6vw, 10rem);
```

### Gaps
```css
--gap-xs: clamp(0.5rem, 0.4rem + 0.5vw, 1rem);
--gap-sm: clamp(1rem, 0.8rem + 1vw, 1.5rem);
--gap-md: clamp(1.5rem, 1rem + 1.5vw, 2.5rem);
--gap-lg: clamp(2rem, 1.5rem + 2vw, 4rem);
--gap-xl: clamp(3rem, 2rem + 3vw, 6rem);
```

### Container
```css
--container-padding: clamp(1rem, 2vw, 3rem);
--container-max: 2400px;
--container-width: min(96%, var(--container-max));
```

### Использование в CSS
```css
.my-element {
  font-size: var(--font-size-xl);
  padding: var(--space-lg);
  gap: var(--gap-md);
}
```

---

## Примеры

### Hero секция
```tsx
<Section fullHeight className="bg-gradient-to-b from-background to-muted">
  <Container>
    <div className="flex flex-col gap-fluid-md max-w-4xl">
      <h1 className="text-fluid-hero font-bold tracking-tight text-balance">
        Заголовок сайта
      </h1>
      <p className="text-fluid-xl text-muted-foreground">
        Описание или слоган
      </p>
      <div className="flex gap-fluid-sm">
        <Button size="lg">Начать</Button>
        <Button variant="outline" size="lg">Узнать больше</Button>
      </div>
    </div>
  </Container>
</Section>
```

### Секция с карточками
```tsx
<Section className="bg-muted">
  <Container>
    <h2 className="text-fluid-3xl font-bold mb-8">Наши услуги</h2>
    <FluidGrid minItemWidth="sm" gap="lg">
      {services.map((service) => (
        <Card key={service.id} className="p-6">
          <h3 className="text-fluid-xl font-semibold mb-2">
            {service.title}
          </h3>
          <p className="text-fluid-base text-muted-foreground">
            {service.description}
          </p>
        </Card>
      ))}
    </FluidGrid>
  </Container>
</Section>
```

### Текстовый контент (статья)
```tsx
<Section>
  <Container variant="narrow">
    <article className="prose">
      <h1 className="text-fluid-4xl font-bold text-balance">
        Заголовок статьи
      </h1>
      <p className="text-fluid-lg text-muted-foreground">
        Вводный абзац
      </p>
      <div className="text-fluid-base">
        {/* контент статьи */}
      </div>
    </article>
  </Container>
</Section>
```

### Footer
```tsx
<Section as="footer" spacing="lg" className="border-t">
  <Container>
    <FluidGrid minItemWidth="sm" gap="lg">
      <div>
        <h4 className="text-fluid-lg font-semibold mb-4">Компания</h4>
        {/* ссылки */}
      </div>
      <div>
        <h4 className="text-fluid-lg font-semibold mb-4">Контакты</h4>
        {/* контакты */}
      </div>
    </FluidGrid>
    <p className="text-fluid-sm text-muted-foreground mt-8">
      © 2024 Company. All rights reserved.
    </p>
  </Container>
</Section>
```

---

## Breakpoints

Стандартные Tailwind + расширенные для больших экранов:

| Breakpoint | Ширина | Устройства |
|------------|--------|------------|
| `sm` | 640px | Телефоны горизонтально |
| `md` | 768px | Планшеты |
| `lg` | 1024px | Ноутбуки |
| `xl` | 1280px | Десктоп |
| `2xl` | 1536px | Большие мониторы |
| `3xl` | 1920px | Full HD |
| `4xl` | 2560px | 2K / 4K |

---

## Viewport Height (мобильные)

Для корректной высоты на мобильных браузерах:

```tsx
// Вместо h-screen / min-h-screen
<div className="h-screen-safe">
<div className="min-h-screen-safe">
```

Использует `dvh` (dynamic viewport height) который учитывает адресную строку браузера.

---

## Миграция со старого подхода

| Было | Стало |
|------|-------|
| `text-2xl md:text-4xl lg:text-6xl` | `text-fluid-4xl` |
| `p-4 md:p-8 lg:p-12` | `py-fluid-lg` |
| `gap-4 md:gap-6 lg:gap-8` | `gap-fluid-md` |
| `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | `<FluidGrid>` |
| `max-w-7xl mx-auto px-4` | `<Container>` |
| `h-screen` | `h-screen-safe` |


