import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://linkedinprofileprofiler.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/test",
          "/results",
          "/improvement",
          "/pricing",
          "/dashboard",
        ],
        disallow: [
          "/api/",
          "/payment/",
          "/dashboard/settings",
          "/dashboard/billing",
          "/_next/",
          "/admin/",
          "*.json",
          "*.xml",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/test",
          "/results",
          "/improvement",
          "/pricing",
          "/dashboard",
        ],
        disallow: [
          "/api/",
          "/payment/",
          "/dashboard/settings",
          "/dashboard/billing",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
