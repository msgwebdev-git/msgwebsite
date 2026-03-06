import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers";
import { AnimatedNoise } from "@/components/AnimatedNoise";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Media Show Grup | Event Agency",
  description: "Full-service event agency in Moldova since 2006",
};

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

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AnimatedNoise opacity={0.03} />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
