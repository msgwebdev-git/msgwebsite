# SEO Plan — Media Show Grup (msgsite)

> Reference project: goqodedev (95/100 SEO maturity)
> Current state: ~90/100 — Phase 1–5 done. Phase 6 (OG images/icons) pending — manual design needed.

---

## PHASE 1 — Critical Infrastructure

### 1.1 `src/app/robots.ts` ✅
- User-Agent rules for `*` and `Googlebot`
- Allow: `/`
- Disallow: `/api/`, `/_next/`, `/player`
- Sitemap URL: `https://mediashowgrup.com/sitemap.xml`

### 1.2 `src/app/sitemap.xml/route.ts` ✅
- All pages × 3 locales (ro, ru, en) — each locale as separate `<url>`
- hreflang alternates on every URL (ro, en, ru, x-default)
- Change frequencies: home=weekly, services=monthly, cases=monthly
- Priorities: homepage=1.0, services=0.9, about/contacts/cases=0.8, others=0.7
- Image sitemaps for case studies, services, expertise (project images)
- `lastModified` timestamps
- XML escaping for special characters
- XSL stylesheet (`public/sitemap.xsl`) for browser rendering
- Cache headers: `max-age=3600, s-maxage=86400`

### 1.3 Root `src/app/layout.tsx` — full metadata ✅
- `metadataBase`: `https://mediashowgrup.com`
- `title` with template: `%s | Media Show Grup`
- Default description, keywords
- `authors`, `creator`, `publisher`
- `formatDetection`: disable email/address/telephone
- `category`: "entertainment"
- `robots`: googleBot with max-snippet, max-image-preview, max-video-preview
- `manifest`: link to `/manifest.webmanifest`
- `verification`: placeholders for Google/Yandex/Bing
- `openGraph`: type, locale, alternateLocale, siteName, default image (`/og.jpg`)
- `twitter`: card summary_large_image, site handle
- `icons`: favicon, apple-touch-icon

### 1.4 Metadata helpers — `src/lib/metadata-helpers.ts` ✅
- `getOgLocale(locale)`: ro→ro_RO, en→en_US, ru→ru_RU
- `getLocalizedUrl(locale, path)`: fully-qualified URL
- `getAlternates(path)`: hreflang object with canonical + languages + x-default
- `buildPageMetadata()`: unified helper for all pages (OG, Twitter, alternates)

### 1.5 `src/app/manifest.ts` ✅
- name: "Media Show Grup — Event Agency"
- short_name: "MSG"
- display: "standalone"
- background_color / theme_color: "#0a0a0a"
- Icons: favicon.ico, apple-touch-icon, icon-192, icon-512

---

## PHASE 2 — Page Metadata

### 2.1 Homepage `/src/app/[locale]/page.tsx` ✅
- Converted from "use client" to server wrapper (`page.tsx`) + client component (`HomeClient.tsx`)
- generateMetadata with `buildPageMetadata` — title, description, keywords per locale
- OG image, OG URL, OG locale, alternateLocale
- Alternates with hreflang
- Twitter card

### 2.2 Projects page `/src/app/[locale]/projects/page.tsx` ✅
- Converted from "use client" to server wrapper (`page.tsx`) + client component (`ProjectsClient.tsx`)
- generateMetadata with title, description, keywords
- Alternates with hreflang

### 2.3 Case studies `/src/app/[locale]/cases/[slug]/page.tsx` ✅
- generateMetadata per slug (title from project data, description from case text, OG image from project image)
- Alternates with hreflang per slug

### 2.4 All existing pages — enhance metadata ✅
- About, Contacts, Services, Expertise: migrated to `buildPageMetadata` with full `og:image`, `og:url`, `og:locale`
- Twitter card metadata on all pages
- Consistent hreflang via helpers

### 2.5 Translation files — add SEO namespace ✅
- Added to `messages/en.json`, `messages/ru.json`, `messages/ro.json`:
  - ✅ `seo.home.title`, `seo.home.description`, `seo.home.keywords`
  - ✅ `seo.projects.title`, `seo.projects.description`, `seo.projects.keywords`
  - ✅ `seo.cases.title`, `seo.cases.description`
  - ✅ `jsonLd.*` — breadcrumb labels, org description, service names (all 3 locales)

---

## PHASE 3 — Structured Data (JSON-LD)

### 3.1 Homepage ✅
- **Organization**: name, url, logo, description, foundingDate, areaServed, knowsLanguage, contactPoint, sameAs (social links)
- **ProfessionalService**: LocalBusiness with address (Str. Petricani 17, Chișinău), geo coordinates, priceRange, openingHours
- **WebSite**: name, url, publisher, inLanguage (3 languages)
- Component: `src/components/json-ld/HomeJsonLd.tsx`

### 3.2 All service pages (7 pages) ✅
- **Service**: name, url, description, provider (Organization), serviceType, areaServed
- **BreadcrumbList**: Home > Services > Service Name (localized)
- **FAQPage**: FAQ items auto-detected from service namespace (try/catch for services without FAQ)
- Component: `src/components/json-ld/ServiceJsonLd.tsx` — universal for all 7 services
- Replaced old `TurnkeyJsonLd` with unified component

### 3.3 Case studies ✅
- **CreativeWork**: name, description, url, image, creator (Organization)
- **BreadcrumbList**: Home > Projects > Case Name
- Component: `src/components/json-ld/CaseStudyJsonLd.tsx`

### 3.4 About page ✅
- **BreadcrumbList**: Home > About
- Via reusable `BreadcrumbJsonLd` component

### 3.5 Contacts page ✅
- **ContactPage**: name, url, mainEntity → Organization with contactPoint
- **BreadcrumbList**: Home > Contacts

### 3.6 Expertise pages ✅
- **BreadcrumbList**: Home > Expertise > Category
- **Service**: serviceType per expertise category, provider, areaServed

### 3.7 Projects page ✅
- **BreadcrumbList**: Home > Projects

### Shared components:
- `src/components/json-ld/JsonLdScript.tsx` — safe `<script type="application/ld+json">` wrapper with XSS protection
- `src/components/json-ld/BreadcrumbJsonLd.tsx` — reusable breadcrumb with localized labels from `jsonLd` namespace
- Translation namespace `jsonLd` added to all 3 locale files

---

## PHASE 4 — Security & Performance

### 4.1 Security headers in `next.config.ts` ✅
```
X-Content-Type-Options: "nosniff"
X-Frame-Options: "SAMEORIGIN"
X-XSS-Protection: "1; mode=block"
Referrer-Policy: "strict-origin-when-cross-origin"
```

### 4.2 `next.config.ts` tweaks ✅
- `poweredByHeader: false`
- Remote image patterns configured

### 4.3 noindex pages ✅
- ✅ `/player` page: `robots: { index: false, follow: false }`
- ✅ 404/not-found pages: HTTP 404 status code — search engines do not index by default
- ✅ API routes excluded via robots.ts

---

## PHASE 5 — Analytics & Verification

### 5.1 Google Tag Manager ✅
- `src/components/GoogleTagManager.tsx` — GTM script via `next/script` (afterInteractive)
- Reads `NEXT_PUBLIC_GTM_ID` from env — renders nothing if not set
- Includes `<noscript>` fallback iframe
- Connected in root `layout.tsx`
- `.env.example` created with placeholder
- GA4 property creation + event configuration: pending client setup

### 5.2 Cookie Consent ✅
- Installed `vanilla-cookieconsent` ^3.x
- `src/components/CookieConsent.tsx` — 3 categories: necessary, analytics, marketing
- Auto-clear `_ga*`, `_gid` (analytics), `_fb*`, `_gcl_au` (marketing) on rejection
- Localized in 3 languages (ro, ru, en)
- Layout: "box inline", position: "bottom left"
- CSS imported in `globals.css`
- Connected in `[locale]/layout.tsx`

### 5.3 Verification tokens ✅ (placeholders)
- Placeholders in root `layout.tsx` metadata.verification
- Uncomment and add real tokens after registering in Google Search Console + Yandex Webmaster
- Submit sitemap to both after verification

---

## PHASE 6 — OG Image & Icons

### 6.1 Default OG image
- Create `/public/og.jpg` (1200×630) — branded with MSG logo + tagline
- Use as fallback OG image across all pages

### 6.2 Per-page OG images ✅ (partial)
- ✅ Service pages: unique OG images per service (hero images)
- ✅ Case studies: project hero image as OG
- ❌ Default `/public/og.jpg` not yet created

### 6.3 Favicon & Icons
- `/public/favicon.ico` — already exists
- `/public/apple-touch-icon.png` (180×180) — CREATE
- `/public/icon-192.png` (192×192) — CREATE
- `/public/icon-512.png` (512×512) — CREATE

---

## Execution Order

| Priority | Phase | Status | Estimated Impact |
|----------|-------|--------|-----------------|
| 1 | Phase 1 (Infrastructure) | ✅ Done | Unlocks indexing, crawling, social sharing |
| 2 | Phase 2 (Page Metadata) | ✅ Done | Every page discoverable with proper titles/descriptions |
| 3 | Phase 3 (JSON-LD) | ✅ Done | Rich results in Google (breadcrumbs, FAQ, business info) |
| 4 | Phase 4 (Security) | ✅ Done | Trust signals, prevents security issues |
| 5 | Phase 6 (OG Images) | ⚠️ Partial | Social sharing appearance |
| 6 | Phase 5 (Analytics) | ✅ Done | Track performance, verify indexing |

---

## Reference Files from goqode

| Purpose | goqode File |
|---------|-------------|
| Root metadata | `/app/layout.tsx` |
| Metadata helpers | `/lib/metadata-helpers.ts` |
| Robots | `/app/robots.ts` |
| Sitemap | `/app/sitemap.xml/route.ts` |
| Manifest | `/app/manifest.ts` |
| JSON-LD patterns | `/app/[locale]/page.tsx`, `/app/[locale]/services/*/page.tsx` |
| Security headers | `/next.config.ts` |
| Cookie consent | `/components/CookieConsent.tsx` |
| SEO translations | `/messages/en.json` (Seo + JsonLd namespaces) |
