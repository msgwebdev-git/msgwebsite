import { getTranslations } from "next-intl/server";
import { getLocalizedUrl } from "@/lib/metadata-helpers";
import { JsonLdScript } from "./JsonLdScript";
import { BreadcrumbJsonLd } from "./BreadcrumbJsonLd";

const HOST = "https://www.mediashowgrup.com";

const caseImages: Record<string, string> = {
  "festivalul-lupilor": "/cases/fl.jpg",
  "ziua-vinului": "/cases/ziuavinului.jpg",
  "traditii-romanesti": "/cases/traditiiromanesti.jpg",
  "festivalul-padurilor": "/cases/padurilor.jpg",
  soundstalgic: "/cases/danbalan.jpg",
  eurovision: "/cases/euro.jpg",
  "ddt-istanbul": "/cases/ddt.jpg",
  "zdob-si-zdub": "/cases/zdob.jpg",
  scriptonite: "/cases/skriptonit.jpg",
};

export async function CaseStudyJsonLd({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const t = await getTranslations({ locale, namespace: "caseStudies" });
  const jsonLdT = await getTranslations({ locale, namespace: "jsonLd" });

  let title: string;
  let description: string;
  try {
    title = t(`${slug}.about`).slice(0, 100).replace(/\s+\S*$/, "");
    description = t(`${slug}.about`).slice(0, 200).replace(/\s+\S*$/, "…");
  } catch {
    return null;
  }

  // Get the case title from projects translations
  const projectsT = await getTranslations({ locale, namespace: "projects" });
  let caseName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  try {
    const items = projectsT.raw("items") as Array<{ slug: string; title: string }>;
    const found = items.find((item) => item.slug === slug);
    if (found) caseName = found.title;
  } catch {
    // fallback to formatted slug
  }

  const caseUrl = getLocalizedUrl(locale, `/cases/${slug}`);
  const image = caseImages[slug] ? `${HOST}${caseImages[slug]}` : undefined;

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: caseName,
    description,
    url: caseUrl,
    ...(image ? { image } : {}),
    creator: {
      "@type": "Organization",
      name: "Media Show Grup",
      url: HOST,
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: jsonLdT("projects"), path: "/projects" },
          { name: caseName, path: `/cases/${slug}` },
        ]}
      />
      <JsonLdScript data={creativeWork} />
    </>
  );
}
