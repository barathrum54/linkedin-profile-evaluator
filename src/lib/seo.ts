import { Metadata } from "next";

const siteConfig = {
  name: "LinkedIn Profil Değerlendirici",
  description:
    "LinkedIn profilinizi AI destekli analiz ile optimize edin. Ücretsiz profil değerlendirmesi, detaylı rapor ve profesyonel gelişim önerileri.",
  url: "https://linkedinprofileprofiler.com",
  ogImage: "/og-image.jpg",
  twitterImage: "/twitter-image.jpg",
  creator: "@linkedinprofiler",
  keywords: [
    "LinkedIn profil analizi",
    "LinkedIn optimizasyonu",
    "profesyonel profil",
    "CV analizi",
    "kariyer gelişimi",
    "LinkedIn stratejisi",
    "profil skorlama",
    "iş arama",
    "networking",
    "kişisel marka",
  ],
};

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generateMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  keywords = siteConfig.keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullUrl = url.startsWith("http") ? url : `${siteConfig.url}${url}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: authors
      ? authors.map((name) => ({ name }))
      : [{ name: siteConfig.name }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: fullUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      siteName: siteConfig.name,
      locale: "tr_TR",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.creator,
      creator: siteConfig.creator,
      title: fullTitle,
      description,
      images: [siteConfig.twitterImage],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStructuredData(
  type: string,
  data: Record<string, unknown>
) {
  const baseStructure = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return JSON.stringify(baseStructure);
}

export function generateOrganizationStructuredData() {
  return generateStructuredData("Organization", {
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "LinkedIn Profil Değerlendirici Ekibi",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-XXX-XXX-XXXX",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    sameAs: [
      "https://twitter.com/linkedinprofiler",
      "https://linkedin.com/company/linkedinprofiler",
    ],
  });
}

export function generateWebsiteStructuredData() {
  return generateStructuredData("WebSite", {
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  });
}

export function generateServiceStructuredData() {
  return generateStructuredData("Service", {
    name: "LinkedIn Profil Analizi Hizmeti",
    description: "Profesyonel LinkedIn profil analizi ve optimizasyon hizmeti",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "LinkedIn Profil Hizmetleri",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ücretsiz Profil Analizi",
            description: "LinkedIn profilinizin temel analizi",
          },
          price: "0",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Premium Profil Optimizasyonu",
            description: "Detaylı analiz ve kişiselleştirilmiş öneriler",
          },
          price: "20",
          priceCurrency: "USD",
        },
      ],
    },
  });
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return generateStructuredData("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${item.url}`,
    })),
  });
}

export { siteConfig };
