import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers";
import { AnimatedNoise } from "@/components/AnimatedNoise";
import { CookieConsentBanner } from "@/components/CookieConsent";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "vanilla-cookieconsent/dist/cookieconsent.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <ThemeProvider>
      <NextIntlClientProvider messages={messages}>
        <AnimatedNoise opacity={0.03} />
        {children}
        <CookieConsentBanner />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
