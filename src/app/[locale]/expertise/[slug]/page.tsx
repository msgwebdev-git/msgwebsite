import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ExpertisePage as ExpertisePageComponent } from "@/components/expertise/ExpertisePage";

const expertiseConfigs: Record<string, { category: string; image: string }> = {
  festivals: { category: "festivals", image: "/expertise/festivals.jpg" },
  concerts: { category: "concerts", image: "/expertise/concerts.jpg" },
  "concept-projects": { category: "conceptProjects", image: "/expertise/concept-projects.jpg" },
  conferences: { category: "conferences", image: "/expertise/conferences.jpg" },
  "brand-launches": { category: "brandLaunches", image: "/expertise/brand-launches.jpg" },
  sports: { category: "sports", image: "/expertise/sports.jpg" },
  corporate: { category: "corporate", image: "/expertise/corporate.jpg" },
  custom: { category: "custom", image: "/expertise/custom.jpg" },
};

const expertiseSlugs = Object.keys(expertiseConfigs);

export function generateStaticParams() {
  return expertiseSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const config = expertiseConfigs[slug];
  if (!config) return {};

  const t = await getTranslations({ locale, namespace: "expertise" });

  const title = `${t(`${config.category}.title`)} | Media Show Grup`;
  const description = t(`${config.category}.description`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Media Show Grup",
    },
    alternates: {
      canonical: `/${locale}/expertise/${slug}`,
      languages: {
        ru: `/ru/expertise/${slug}`,
        ro: `/ro/expertise/${slug}`,
        en: `/en/expertise/${slug}`,
      },
    },
  };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const config = expertiseConfigs[slug];

  if (!config) {
    notFound();
  }

  return <ExpertisePageComponent category={config.category} image={config.image} />;
}
