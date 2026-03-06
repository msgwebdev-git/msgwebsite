import { getTranslations } from "next-intl/server";

interface TurnkeyJsonLdProps {
  locale: string;
}

export async function TurnkeyJsonLd({ locale }: TurnkeyJsonLdProps) {
  const t = await getTranslations({ locale, namespace: "serviceTurnkey" });
  const faqItems = JSON.parse(JSON.stringify(t.raw("faq.items"))) as Array<{
    question: string;
    answer: string;
  }>;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("meta.title"),
    description: t("meta.description"),
    provider: {
      "@type": "LocalBusiness",
      name: "Media Show Grup",
      telephone: "+37322838539",
      email: "info@mediashowgrup.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chișinău",
        addressCountry: "MD",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Moldova",
    },
    serviceType: "Event Management",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
