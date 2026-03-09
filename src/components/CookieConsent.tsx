"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { useLocale } from "next-intl";

export function CookieConsentBanner() {
  const locale = useLocale();

  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "box inline",
          position: "bottom left",
        },
        preferencesModal: {
          layout: "box",
        },
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: "_gid" }],
          },
        },
        marketing: {
          autoClear: {
            cookies: [{ name: /^_fb/ }, { name: "_gcl_au" }],
          },
        },
      },

      language: {
        default: locale,
        translations: {
          ro: {
            consentModal: {
              title: "Folosim cookie-uri",
              description:
                "Acest site folosește cookie-uri pentru a asigura funcționarea corectă și pentru a îmbunătăți experiența dumneavoastră. Puteți gestiona preferințele din setări.",
              acceptAllBtn: "Acceptă toate",
              acceptNecessaryBtn: "Doar necesare",
              showPreferencesBtn: "Setări cookie",
            },
            preferencesModal: {
              title: "Preferințe cookie",
              acceptAllBtn: "Acceptă toate",
              acceptNecessaryBtn: "Doar necesare",
              savePreferencesBtn: "Salvează preferințele",
              closeIconLabel: "Închide",
              sections: [
                {
                  title: "Utilizarea cookie-urilor",
                  description:
                    "Folosim cookie-uri pentru a asigura funcționalitățile de bază ale site-ului și pentru a vă îmbunătăți experiența online.",
                },
                {
                  title: "Cookie-uri strict necesare",
                  description:
                    "Aceste cookie-uri sunt esențiale pentru funcționarea corectă a site-ului.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Cookie-uri de analiză și performanță",
                  description:
                    "Aceste cookie-uri ne ajută să înțelegem cum interacționați cu site-ul nostru. Toate datele sunt anonimizate.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Cookie-uri de marketing",
                  description:
                    "Aceste cookie-uri sunt folosite pentru a vă afișa reclame relevante pe baza intereselor dumneavoastră.",
                  linkedCategory: "marketing",
                },
              ],
            },
          },
          en: {
            consentModal: {
              title: "We use cookies",
              description:
                "This website uses cookies to ensure proper functionality and to improve your experience. You can manage your preferences in settings.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Necessary only",
              showPreferencesBtn: "Cookie settings",
            },
            preferencesModal: {
              title: "Cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Necessary only",
              savePreferencesBtn: "Save preferences",
              closeIconLabel: "Close",
              sections: [
                {
                  title: "Cookie usage",
                  description:
                    "We use cookies to ensure the basic functionalities of the website and to enhance your online experience.",
                },
                {
                  title: "Strictly necessary cookies",
                  description:
                    "These cookies are essential for the proper functioning of the website.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics & performance cookies",
                  description:
                    "These cookies help us understand how visitors interact with our website. All data is anonymized.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Marketing cookies",
                  description:
                    "These cookies are used to display relevant ads based on your interests.",
                  linkedCategory: "marketing",
                },
              ],
            },
          },
          ru: {
            consentModal: {
              title: "Мы используем cookies",
              description:
                "Этот сайт использует файлы cookie для обеспечения корректной работы и улучшения вашего опыта. Вы можете управлять настройками в параметрах.",
              acceptAllBtn: "Принять все",
              acceptNecessaryBtn: "Только необходимые",
              showPreferencesBtn: "Настройки cookie",
            },
            preferencesModal: {
              title: "Настройки cookie",
              acceptAllBtn: "Принять все",
              acceptNecessaryBtn: "Только необходимые",
              savePreferencesBtn: "Сохранить настройки",
              closeIconLabel: "Закрыть",
              sections: [
                {
                  title: "Использование cookie",
                  description:
                    "Мы используем cookie для обеспечения базовой функциональности сайта и улучшения вашего опыта.",
                },
                {
                  title: "Строго необходимые cookie",
                  description:
                    "Эти файлы cookie необходимы для корректной работы сайта.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Аналитические cookie",
                  description:
                    "Эти cookie помогают нам понять, как посетители взаимодействуют с сайтом. Все данные анонимизированы.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Маркетинговые cookie",
                  description:
                    "Эти cookie используются для показа релевантной рекламы на основе ваших интересов.",
                  linkedCategory: "marketing",
                },
              ],
            },
          },
        },
      },
    });
  }, [locale]);

  return null;
}
