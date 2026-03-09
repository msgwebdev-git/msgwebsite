import { getTranslations } from "next-intl/server";
import { JsonLdScript } from "./JsonLdScript";

const HOST = "https://mediashowgrup.com";

export async function HomeJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "jsonLd" });

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Media Show Grup",
    url: HOST,
    logo: `${HOST}/black-logo.svg`,
    description: t("orgDescription"),
    foundingDate: "2006",
    areaServed: ["MD", "RO", "EU"],
    knowsLanguage: ["ro", "en", "ru"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+37322838539",
        email: "info@mediashowgrup.com",
        availableLanguage: ["Romanian", "English", "Russian"],
      },
    ],
    sameAs: [
      "https://www.facebook.com/mediashowgrup",
      "https://www.instagram.com/mediashowgrup",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Media Show Grup",
    url: HOST,
    inLanguage: ["ro", "en", "ru"],
    publisher: {
      "@type": "Organization",
      name: "Media Show Grup",
      url: HOST,
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Media Show Grup",
    url: HOST,
    logo: `${HOST}/black-logo.svg`,
    image: `${HOST}/black-logo.svg`,
    telephone: "+37322838539",
    email: "info@mediashowgrup.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Strada Petricani 17",
      addressLocality: "Chișinău",
      addressCountry: "MD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.0453,
      longitude: 28.8575,
    },
    areaServed: [
      { "@type": "Country", name: "Moldova" },
      { "@type": "Country", name: "Romania" },
      { "@type": "Place", name: "European Union" },
    ],
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    knowsLanguage: ["ro", "en", "ru"],
    sameAs: [
      "https://www.facebook.com/mediashowgrup",
      "https://www.instagram.com/mediashowgrup",
    ],
  };

  return (
    <>
      <JsonLdScript data={organization} />
      <JsonLdScript data={website} />
      <JsonLdScript data={localBusiness} />
    </>
  );
}
