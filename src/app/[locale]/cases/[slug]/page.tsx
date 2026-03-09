import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import { CaseStudyJsonLd } from "@/components/json-ld/CaseStudyJsonLd";
import { CaseStudyContent } from "@/components/CaseStudyContent";

const projectSlugs = [
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

const projectImages: Record<string, string> = {
  "festivalul-lupilor": "/cases/fl.jpg",
  "ziua-vinului": "/cases/ziuavinului.jpg",
  "traditii-romanesti": "/cases/traditiiromanesti.jpg",
  "festivalul-padurilor": "/cases/padurilor.jpg",
  "soundstalgic": "/cases/danbalan.jpg",
  "eurovision": "/cases/euro.jpg",
  "ddt-istanbul": "/cases/ddt.jpg",
  "zdob-si-zdub": "/cases/zdob.jpg",
  "scriptonite": "/cases/skriptonit.jpg",
};

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudies" });
  const seoT = await getTranslations({ locale, namespace: "seo" });

  const about = projectSlugs.includes(slug)
    ? (t(`${slug}.about`) as string)
    : "";
  const description = about
    ? about.slice(0, 155).replace(/\s+\S*$/, "…")
    : seoT("cases.description");

  const title = `${seoT("cases.title")} — ${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;

  const ogImage = projectImages[slug]
    ? `https://mediashowgrup.com${projectImages[slug]}`
    : undefined;

  return buildPageMetadata({
    locale,
    path: `/cases/${slug}`,
    title,
    description,
    ogImage,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return (
    <>
      <CaseStudyJsonLd locale={locale} slug={slug} />
      <CaseStudyContent slug={slug} />
    </>
  );
}
