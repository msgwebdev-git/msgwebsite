import { setRequestLocale } from "next-intl/server";
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

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <CaseStudyContent slug={slug} />;
}
