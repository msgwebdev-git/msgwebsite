import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import { BreadcrumbJsonLd } from "@/components/json-ld/BreadcrumbJsonLd";
import { JsonLdScript } from "@/components/json-ld/JsonLdScript";
import { ContactPageClient } from "./ContactPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return buildPageMetadata({
    locale,
    path: "/contacts",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "jsonLd" });

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${t("contacts")} — Media Show Grup`,
    url: "https://mediashowgrup.com/contacts",
    mainEntity: {
      "@type": "Organization",
      name: "Media Show Grup",
      url: "https://mediashowgrup.com",
      telephone: "+37322838539",
      email: "info@mediashowgrup.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+37322838539",
          email: "info@mediashowgrup.com",
          availableLanguage: ["Romanian", "English", "Russian"],
        },
      ],
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: t("contacts"), path: "/contacts" }]}
      />
      <JsonLdScript data={contactPageSchema} />
      <ContactPageClient />
    </>
  );
}
