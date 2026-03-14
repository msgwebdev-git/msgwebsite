import type { Metadata } from "next";

const SITE_URL = "https://mediashowgrup.com";
const SITE_NAME = "Media Show Grup";

const OG_LOCALES: Record<string, string> = {
  ro: "ro_RO",
  en: "en_US",
  ru: "ru_RU",
};

const LOCALES = ["ro", "ru", "en"] as const;
const DEFAULT_LOCALE = "ro";

export function getOgLocale(locale: string): string {
  return OG_LOCALES[locale] ?? "ro_RO";
}

export function getLocalizedUrl(locale: string, path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

export function getAlternates(path: string = "", locale?: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return {
    canonical: getLocalizedUrl(locale || DEFAULT_LOCALE, cleanPath),
    languages: {
      ro: getLocalizedUrl("ro", cleanPath),
      ru: getLocalizedUrl("ru", cleanPath),
      en: getLocalizedUrl("en", cleanPath),
      "x-default": getLocalizedUrl(DEFAULT_LOCALE, cleanPath),
    },
  };
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  ogImage,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}): Metadata {
  const url = getLocalizedUrl(locale, path);
  const image = ogImage || `${SITE_URL}/og.jpg`;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: getOgLocale(locale),
      alternateLocale: LOCALES.filter((l) => l !== locale).map(getOgLocale),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: getAlternates(path, locale),
  };
}

export { SITE_URL, SITE_NAME, LOCALES, DEFAULT_LOCALE };
