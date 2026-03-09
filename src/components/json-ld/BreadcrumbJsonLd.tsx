import { getTranslations } from "next-intl/server";
import { getLocalizedUrl } from "@/lib/metadata-helpers";
import { JsonLdScript } from "./JsonLdScript";

interface BreadcrumbItem {
  name: string;
  path?: string;
}

export async function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: string;
  items: BreadcrumbItem[];
}) {
  const t = await getTranslations({ locale, namespace: "jsonLd" });

  const itemListElement = [
    {
      "@type": "ListItem" as const,
      position: 1,
      name: t("home"),
      item: getLocalizedUrl(locale, ""),
    },
    ...items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 2,
      name: item.name,
      ...(item.path ? { item: getLocalizedUrl(locale, item.path) } : {}),
    })),
  ];

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      }}
    />
  );
}
