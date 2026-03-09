import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import { BreadcrumbJsonLd } from "@/components/json-ld/BreadcrumbJsonLd";
import { JsonLdScript } from "@/components/json-ld/JsonLdScript";
import { getLocalizedUrl } from "@/lib/metadata-helpers";
import { ExpertisePage as ExpertisePageComponent } from "@/components/expertise/ExpertisePage";

const HOST = "https://mediashowgrup.com";

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

  return buildPageMetadata({
    locale,
    path: `/expertise/${slug}`,
    title: t(`${config.category}.title`),
    description: t(`${config.category}.description`),
    ogImage: `${HOST}${config.image}`,
  });
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const config = expertiseConfigs[slug];

  if (!config) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "expertise" });
  const jsonLdT = await getTranslations({ locale, namespace: "jsonLd" });
  const categoryTitle = t(`${config.category}.title`);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: categoryTitle,
    description: t(`${config.category}.description`),
    url: getLocalizedUrl(locale, `/expertise/${slug}`),
    provider: {
      "@type": "Organization",
      name: "Media Show Grup",
      url: HOST,
    },
    serviceType: categoryTitle,
    areaServed: ["MD", "RO", "EU"],
  };

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: jsonLdT("expertise") },
          { name: categoryTitle, path: `/expertise/${slug}` },
        ]}
      />
      <JsonLdScript data={serviceSchema} />
      <ExpertisePageComponent category={config.category} image={config.image} />
    </>
  );
}
