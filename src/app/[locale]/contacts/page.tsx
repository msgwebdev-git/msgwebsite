import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactPageClient } from "./ContactPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

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
      canonical: `/${locale}/contacts`,
      languages: {
        ru: "/ru/contacts",
        ro: "/ro/contacts",
        en: "/en/contacts",
      },
    },
  };
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageClient />;
}
