import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import { BreadcrumbJsonLd } from "@/components/json-ld/BreadcrumbJsonLd";
import ProjectsClient from "./ProjectsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    locale,
    path: "/projects",
    title: t("projects.title"),
    description: t("projects.description"),
    keywords: t("projects.keywords").split(", "),
  });
}

export default async function ProjectsPage({
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
        items={[{ name: t("projects"), path: "/projects" }]}
      />
      <ProjectsClient />
    </>
  );
}
