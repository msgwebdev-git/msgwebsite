import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import { TermsPageClient } from "./TermsPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    path: "/terms",
    title: "Условия использования — Media Show Grup",
    description:
      "Условия использования сайта Media Show Grup. Ознакомьтесь с правилами использования нашего сайта и услуг.",
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsPageClient />;
}
