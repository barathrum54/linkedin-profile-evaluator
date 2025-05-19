import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkedIn Profile Profiler",
  description: "LinkedIn profiliniz gerçekten ne kadar iyi? Bu aracı kullanarak LinkedIn profilinizi analiz edebilirsiniz.",
  keywords: "LinkedIn, Profile, Profiler, LinkedIn Profile Profiler, LinkedIn Profile Profiler",
  authors: [{ name: "LinkedIn Profile Profiler" }],
  openGraph: {
    title: "LinkedIn Profile Profiler",
    description: "LinkedIn Profile Profiler",
    images: ["/og-image.png"],
    url: "https://linkedinprofileprofiler.com",
    type: "website",
    siteName: "LinkedIn Profile Profiler",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
