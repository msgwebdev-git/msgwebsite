import { getTranslations } from "next-intl/server";
import { getLocalizedUrl } from "@/lib/metadata-helpers";
import { JsonLdScript } from "./JsonLdScript";
import { BreadcrumbJsonLd } from "./BreadcrumbJsonLd";

const HOST = "https://www.mediashowgrup.com";

export async function ServiceJsonLd({
  locale,
  slug,
  namespace,
}: {
  locale: string;
  slug: string;
  namespace: string;
}) {
  const t = await getTranslations({ locale, namespace });
  const jsonLdT = await getTranslations({ locale, namespace: "jsonLd" });

  const serviceName = t("meta.title");
  const serviceUrl = getLocalizedUrl(locale, `/services/${slug}`);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: t("meta.description"),
    url: serviceUrl,
    provider: {
      "@type": "Organization",
      name: "Media Show Grup",
      url: HOST,
    },
    serviceType: serviceName,
    areaServed: ["MD", "RO", "EU"],
  };

  // Try to read FAQ items if they exist
  let faqSchema = null;
  try {
    if (!t.has("faq.items")) throw new Error("no faq");
    const faqItems = JSON.parse(
      JSON.stringify(t.raw("faq.items"))
    ) as Array<{ question: string; answer: string }>;

    if (faqItems?.length) {
      faqSchema = {
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
    }
  } catch {
    // No FAQ for this service
  }

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: jsonLdT("services") },
          { name: serviceName, path: `/services/${slug}` },
        ]}
      />
      <JsonLdScript data={serviceSchema} />
      {faqSchema && <JsonLdScript data={faqSchema} />}
    </>
  );
}
