import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import { BreadcrumbJsonLd } from "@/components/json-ld/BreadcrumbJsonLd";
import { AboutPageClient } from "./AboutPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "jsonLd" });

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: t("about"), path: "/about" }]}
      />
      <AboutPageClient />
    </>
  );
}
