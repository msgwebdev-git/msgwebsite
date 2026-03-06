import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ServicePage as ServicePageComponent } from "@/components/services/ServicePage";
import { TurnkeyMiddle } from "@/components/services/TurnkeyMiddle";
import { ServiceFeatures } from "@/components/services/ServiceFeatures";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceGallery } from "@/components/services/ServiceGallery";
import { ServiceCases } from "@/components/services/ServiceCases";
import { TechnicalEquipment } from "@/components/services/TechnicalEquipment";
import { TechnicalStats } from "@/components/services/TechnicalStats";
import { DigitalStack } from "@/components/services/DigitalStack";
import { DigitalStats } from "@/components/services/DigitalStats";
import { SecurityApproach } from "@/components/services/SecurityApproach";
import { SecurityStats } from "@/components/services/SecurityStats";
import { LogisticsFormats } from "@/components/services/LogisticsFormats";
import { LogisticsStats } from "@/components/services/LogisticsStats";
import { VideoEquipment } from "@/components/services/VideoEquipment";
import { VideoStats } from "@/components/services/VideoStats";
import { AdvertisingMaterials } from "@/components/services/AdvertisingMaterials";
import { AdvertisingStats } from "@/components/services/AdvertisingStats";
import { TurnkeyJsonLd } from "@/components/services/TurnkeyJsonLd";

const serviceConfigs: Record<
  string,
  { namespace: string; heroImage: string; overviewImage: string }
> = {
  turnkey: {
    namespace: "serviceTurnkey",
    heroImage: "/expertise/festivals.jpg",
    overviewImage: "/expertise/concept-projects.jpg",
  },
  logistics: {
    namespace: "serviceLogistics",
    heroImage: "/expertise/conferences.jpg",
    overviewImage: "/expertise/corporate.jpg",
  },
  videoproduction: {
    namespace: "serviceVideoproduction",
    heroImage: "/expertise/concept-projects.jpg",
    overviewImage: "/expertise/concerts.jpg",
  },
  technical: {
    namespace: "serviceTechnical",
    heroImage: "/expertise/concerts.jpg",
    overviewImage: "/expertise/conferences.jpg",
  },
  advertising: {
    namespace: "serviceAdvertising",
    heroImage: "/expertise/brand-launches.jpg",
    overviewImage: "/expertise/festivals.jpg",
  },
  digital: {
    namespace: "serviceDigital",
    heroImage: "/expertise/brand-launches.jpg",
    overviewImage: "/expertise/corporate.jpg",
  },
  security: {
    namespace: "serviceSecurity",
    heroImage: "/expertise/sports.jpg",
    overviewImage: "/expertise/custom.jpg",
  },
};

const serviceSlugs = Object.keys(serviceConfigs);

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const config = serviceConfigs[slug];
  if (!config) return {};

  const t = await getTranslations({ locale, namespace: config.namespace });

  const title = `${t("meta.title")} | Media Show Grup`;
  const description = t("meta.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Media Show Grup",
    },
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: {
        ru: `/ru/services/${slug}`,
        ro: `/ro/services/${slug}`,
        en: `/en/services/${slug}`,
      },
    },
  };
}

// Case slugs relevant to each service
const serviceCaseSlugs: Record<string, string[]> = {
  logistics: [
    "festivalul-lupilor",
    "ziua-nationala-a-vinului",
    "festivalul-traditiilor-romanesti",
    "festivalul-padurilor",
    "soundstalgic",
    "eurovision",
  ],
  videoproduction: [
    "festivalul-lupilor",
    "soundstalgic",
    "zdob-si-zdub",
    "scriptonite",
    "ziua-nationala-a-vinului",
    "festivalul-padurilor",
  ],
  advertising: [
    "festivalul-lupilor",
    "ziua-nationala-a-vinului",
    "festivalul-padurilor",
    "festivalul-traditiilor-romanesti",
    "soundstalgic",
    "eurovision",
  ],
  technical: [
    "festivalul-lupilor",
    "soundstalgic",
    "zdob-si-zdub",
    "scriptonite",
    "eurovision",
    "ddt",
  ],
};

function MiddleSections({ slug, namespace }: { slug: string; namespace: string }) {
  switch (slug) {
    // Turnkey: expertise bento + cases + process (unique page)
    case "turnkey":
      return <TurnkeyMiddle namespace={namespace} />;

    // Logistics: formats + features + stats + cases + process
    case "logistics":
      return (
        <>
          <LogisticsFormats namespace={namespace} />
          <ServiceFeatures namespace={namespace} />
          <LogisticsStats namespace={namespace} />
          <ServiceCases namespace={namespace} slugs={serviceCaseSlugs.logistics} />
          <ServiceProcess namespace={namespace} />
        </>
      );

    // Video: features + stats + cases + process
    case "videoproduction":
      return (
        <>
          <ServiceFeatures namespace={namespace} />
          <VideoStats namespace={namespace} />
          <ServiceCases namespace={namespace} slugs={serviceCaseSlugs.videoproduction} />
          <ServiceProcess namespace={namespace} />
        </>
      );

    // Advertising: materials + features + stats + cases + process
    case "advertising":
      return (
        <>
          <AdvertisingMaterials namespace={namespace} />
          <ServiceFeatures namespace={namespace} />
          <AdvertisingStats namespace={namespace} />
          <ServiceCases namespace={namespace} slugs={serviceCaseSlugs.advertising} />
          <ServiceProcess namespace={namespace} />
        </>
      );

    // Technical: equipment showcase + features + stats + cases + process
    case "technical":
      return (
        <>
          <TechnicalEquipment namespace={namespace} />
          <ServiceFeatures namespace={namespace} />
          <TechnicalStats namespace={namespace} />
          <ServiceCases namespace={namespace} slugs={serviceCaseSlugs.technical} />
          <ServiceProcess namespace={namespace} />
        </>
      );

    // Digital: features + stack + stats + process
    case "digital":
      return (
        <>
          <ServiceFeatures namespace={namespace} />
          <DigitalStack namespace={namespace} />
          <DigitalStats namespace={namespace} />
          <ServiceProcess namespace={namespace} />
        </>
      );

    // Security: features + approach + stats + process
    case "security":
      return (
        <>
          <ServiceFeatures namespace={namespace} />
          <SecurityApproach namespace={namespace} />
          <SecurityStats namespace={namespace} />
          <ServiceProcess namespace={namespace} />
        </>
      );

    default:
      return <ServiceProcess namespace={namespace} />;
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const config = serviceConfigs[slug];

  if (!config) {
    notFound();
  }

  return (
    <>
      {slug === "turnkey" && <TurnkeyJsonLd locale={locale} />}
      <ServicePageComponent
        namespace={config.namespace}
        heroImage={config.heroImage}
        overviewImage={config.overviewImage}
      >
        <MiddleSections slug={slug} namespace={config.namespace} />
      </ServicePageComponent>
    </>
  );
}
