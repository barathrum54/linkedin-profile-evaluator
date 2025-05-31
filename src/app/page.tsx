"use client";

import Intro from "@/components/Intro";

export default function Home() {
  return (
    <>
      <Intro />

      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "LinkedIn Profil Değerlendirici",
            description:
              "LinkedIn profilinizi AI destekli analiz ile optimize edin. Ücretsiz profil değerlendirmesi, detaylı rapor ve profesyonel gelişim önerileri.",
            url: "https://linkedinprofileprofiler.com",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Ücretsiz LinkedIn profil analizi",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "1250",
              bestRating: "5",
              worstRating: "1",
            },
            publisher: {
              "@type": "Organization",
              name: "LinkedIn Profil Değerlendirici",
              url: "https://linkedinprofileprofiler.com",
            },
            featureList: [
              "AI destekli profil analizi",
              "Detaylı skor raporu",
              "Profesyonel gelişim önerileri",
              "Ücretsiz değerlendirme",
              "Premium optimizasyon planları",
            ],
          }),
        }}
      />
    </>
  );
}
