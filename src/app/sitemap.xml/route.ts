const host = "https://mediashowgrup.com";
const LOCALES = ["ro", "ru", "en"] as const;
const DEFAULT_LOCALE = "ro";

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  alternates: Record<string, string>;
  images?: string[];
}

const staticPages = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contacts", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.8 },
] as const;

const serviceSlugs = [
  "turnkey",
  "logistics",
  "videoproduction",
  "technical",
  "advertising",
  "digital",
  "security",
];

const serviceImages: Record<string, string> = {
  turnkey: "/expertise/festivals.jpg",
  logistics: "/expertise/conferences.jpg",
  videoproduction: "/expertise/concept-projects.jpg",
  technical: "/expertise/concerts.jpg",
  advertising: "/expertise/brand-launches.jpg",
  digital: "/expertise/brand-launches.jpg",
  security: "/expertise/sports.jpg",
};

const expertiseSlugs = [
  "festivals",
  "concerts",
  "concept-projects",
  "conferences",
  "brand-launches",
  "sports",
  "corporate",
  "custom",
];

const caseSlugs = [
  "festivalul-lupilor",
  "ziua-vinului",
  "traditii-romanesti",
  "festivalul-padurilor",
  "soundstalgic",
  "eurovision",
  "ddt-istanbul",
  "zdob-si-zdub",
  "scriptonite",
];

const caseImages: Record<string, string[]> = {
  "festivalul-lupilor": ["/cases/fl.jpg"],
  "ziua-vinului": ["/cases/ziuavinului.jpg"],
  "traditii-romanesti": ["/cases/traditiiromanesti.jpg"],
  "festivalul-padurilor": ["/cases/padurilor.jpg"],
  soundstalgic: ["/cases/danbalan.jpg"],
  eurovision: ["/cases/euro.jpg"],
  "ddt-istanbul": ["/cases/ddt.jpg"],
  "zdob-si-zdub": ["/cases/zdob.jpg"],
  scriptonite: ["/cases/skriptonit.jpg"],
};

function getUrl(path: string, locale: string): string {
  return `${host}/${locale}${path}`;
}

function getAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = getUrl(path, locale);
  }
  languages["x-default"] = getUrl(path, DEFAULT_LOCALE);
  return languages;
}

export async function GET() {
  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString();

  // Static pages
  for (const page of staticPages) {
    const alternates = getAlternates(page.path);
    for (const locale of LOCALES) {
      entries.push({
        url: getUrl(page.path, locale),
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates,
      });
    }
  }

  // Service pages
  for (const slug of serviceSlugs) {
    const path = `/services/${slug}`;
    const alternates = getAlternates(path);
    const images = serviceImages[slug]
      ? [`${host}${serviceImages[slug]}`]
      : [];
    for (const locale of LOCALES) {
      entries.push({
        url: getUrl(path, locale),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
        alternates,
        images,
      });
    }
  }

  // Expertise pages
  for (const slug of expertiseSlugs) {
    const path = `/expertise/${slug}`;
    const alternates = getAlternates(path);
    const images = [`${host}/expertise/${slug}.jpg`];
    for (const locale of LOCALES) {
      entries.push({
        url: getUrl(path, locale),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates,
        images,
      });
    }
  }

  // Case study pages
  for (const slug of caseSlugs) {
    const path = `/cases/${slug}`;
    const alternates = getAlternates(path);
    const images = (caseImages[slug] ?? []).map((img) => `${host}${img}`);
    for (const locale of LOCALES) {
      entries.push({
        url: getUrl(path, locale),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates,
        images,
      });
    }
  }

  const xml = generateSitemapXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map((entry) => {
      const alternateLinks = Object.entries(entry.alternates)
        .map(
          ([lang, url]) =>
            `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(url)}" />`
        )
        .join("\n");

      const imageLinks = (entry.images ?? [])
        .map(
          (img) =>
            `    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n    </image:image>`
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
${alternateLinks}
${imageLinks ? `${imageLinks}\n` : ""}    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
