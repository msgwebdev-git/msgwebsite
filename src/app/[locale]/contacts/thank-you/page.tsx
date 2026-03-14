import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ThankYouClient } from "./ThankYouClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ThankYouClient />;
}
