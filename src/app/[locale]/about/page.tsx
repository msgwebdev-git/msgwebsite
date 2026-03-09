import { getTranslations } from "next-intl/server";
import { AboutPageClient } from "./AboutPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  const title = `${t("meta.title")} | Media Show Grup`;
  const description = t("meta.description");

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
      canonical: `/${locale}/about`,
      languages: {
        ru: "/ru/about",
        ro: "/ro/about",
        en: "/en/about",
      },
    },
  };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
