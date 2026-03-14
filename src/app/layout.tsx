import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import "./globals.css";

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
  metadataBase: new URL("https://www.mediashowgrup.com"),
  title: {
    default: "Media Show Grup — Event Agency Moldova",
    template: "%s | Media Show Grup",
  },
  description:
    "Full-service event agency in Moldova since 2006. Turnkey events, concerts, festivals, conferences, technical support, video production.",
  keywords: [
    "event agency Moldova",
    "event agency Chisinau",
    "agenție de evenimente",
    "организация мероприятий Молдова",
    "Media Show Grup",
    "turnkey events",
    "festivals Moldova",
    "concerts Moldova",
    "corporate events",
    "video production",
  ],
  authors: [{ name: "Media Show Grup" }],
  creator: "Media Show Grup",
  publisher: "Media Show Grup",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "entertainment",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  verification: {
    // google: "GOOGLE_VERIFICATION_TOKEN",
    // yandex: "YANDEX_VERIFICATION_TOKEN",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    alternateLocale: ["en_US", "ru_RU"],
    siteName: "Media Show Grup",
    title: "Media Show Grup — Event Agency Moldova",
    description:
      "Full-service event agency in Moldova since 2006. Turnkey events, concerts, festivals, conferences.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Media Show Grup — Event Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Show Grup — Event Agency Moldova",
    description:
      "Full-service event agency in Moldova since 2006. Turnkey events, concerts, festivals, conferences.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}
      >
        <GoogleTagManager />
        {children}
      </body>
    </html>
  );
}
