import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://linkedinprofileprofiler.com"),
  title: {
    default: "LinkedIn Profil Değerlendirici | Profesyonel Profil Analizi",
    template: "%s | LinkedIn Profil Değerlendirici",
  },
  description:
    "LinkedIn profilinizi AI destekli analiz ile optimize edin. Ücretsiz profil değerlendirmesi, detaylı rapor ve profesyonel gelişim önerileri.",
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
  authors: [
    {
      name: "LinkedIn Profil Değerlendirici",
      url: "https://linkedinprofileprofiler.com",
    },
  ],
  creator: "LinkedIn Profil Değerlendirici",
  publisher: "LinkedIn Profil Değerlendirici",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "technology",
  classification: "Business",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://linkedinprofileprofiler.com",
    siteName: "LinkedIn Profil Değerlendirici",
    title: "LinkedIn Profil Değerlendirici | Profesyonel Profil Analizi",
    description:
      "LinkedIn profilinizi AI destekli analiz ile optimize edin. Ücretsiz profil değerlendirmesi, detaylı rapor ve profesyonel gelişim önerileri.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LinkedIn Profil Değerlendirici - Profesyonel Profil Analizi",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@linkedinprofiler",
    creator: "@linkedinprofiler",
    title: "LinkedIn Profil Değerlendirici | Profesyonel Profil Analizi",
    description:
      "LinkedIn profilinizi AI destekli analiz ile optimize edin. Ücretsiz profil değerlendirmesi ve detaylı rapor.",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0066CC" },
    ],
  },
  manifest: "/site.webmanifest",
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
  alternates: {
    canonical: "https://linkedinprofileprofiler.com",
    languages: {
      "tr-TR": "https://linkedinprofileprofiler.com",
      "en-US": "https://linkedinprofileprofiler.com/en",
    },
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "msapplication-TileColor": "#0066CC",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "LinkedIn Profil Değerlendirici",
              description:
                "LinkedIn profilinizi AI destekli analiz ile optimize edin. Ücretsiz profil değerlendirmesi, detaylı rapor ve profesyonel gelişim önerileri.",
              url: "https://linkedinprofileprofiler.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://linkedinprofileprofiler.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "LinkedIn Profil Değerlendirici",
                url: "https://linkedinprofileprofiler.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://linkedinprofileprofiler.com/logo.png",
                },
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
