import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import { PrivacyPageClient } from "./PrivacyPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    path: "/privacy",
    title: "Политика конфиденциальности — Media Show Grup",
    description:
      "Политика конфиденциальности сайта Media Show Grup. Узнайте, как мы собираем, используем и защищаем ваши персональные данные.",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyPageClient />;
}
