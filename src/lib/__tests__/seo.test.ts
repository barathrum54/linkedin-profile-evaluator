import {
  generateMetadata,
  generateStructuredData,
  generateOrganizationStructuredData,
  generateWebsiteStructuredData,
  generateServiceStructuredData,
  generateBreadcrumbStructuredData,
  siteConfig,
} from "../seo";

describe("SEO Utilities", () => {
  describe("generateMetadata", () => {
    it("should generate basic metadata with default values", () => {
      const metadata = generateMetadata();

      expect(metadata.title).toBe("LinkedIn Profil Değerlendirici");
      expect(metadata.description).toBe(
        "LinkedIn profilinizi AI destekli analiz ile optimize edin. Ücretsiz profil değerlendirmesi, detaylı rapor ve profesyonel gelişim önerileri."
      );
      expect(metadata.keywords).toContain("LinkedIn profil analizi");
    });

    it("should generate metadata with custom title", () => {
      const metadata = generateMetadata({
        title: "Test Page",
      });

      expect(metadata.title).toBe("Test Page | LinkedIn Profil Değerlendirici");
    });

    it("should generate metadata with custom description", () => {
      const customDescription = "Custom description for testing";
      const metadata = generateMetadata({
        description: customDescription,
      });

      expect(metadata.description).toBe(customDescription);
    });

    it("should generate metadata with custom keywords", () => {
      const customKeywords = ["test", "keywords", "custom"];
      const metadata = generateMetadata({
        keywords: customKeywords,
      });

      expect(metadata.keywords).toBe("test, keywords, custom");
    });

    it("should handle custom URL correctly", () => {
      const metadata = generateMetadata({
        url: "/custom-page",
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://linkedinprofileprofiler.com/custom-page"
      );
    });

    it("should handle absolute URL correctly", () => {
      const metadata = generateMetadata({
        url: "https://example.com/page",
      });

      expect(metadata.alternates?.canonical).toBe("https://example.com/page");
    });

    it("should generate OpenGraph metadata correctly", () => {
      const metadata = generateMetadata({
        title: "Test Page",
        description: "Test description",
      });

      expect(metadata.openGraph?.title).toBe(
        "Test Page | LinkedIn Profil Değerlendirici"
      );
      expect(metadata.openGraph?.description).toBe("Test description");
      expect(metadata.openGraph?.locale).toBe("tr_TR");
    });

    it("should generate Twitter metadata correctly", () => {
      const metadata = generateMetadata({
        title: "Test Page",
        description: "Test description",
      });

      expect(metadata.twitter?.title).toBe(
        "Test Page | LinkedIn Profil Değerlendirici"
      );
      expect(metadata.twitter?.description).toBe("Test description");
    });

    it("should handle article type with published time", () => {
      const publishedTime = "2024-01-01T00:00:00Z";
      const metadata = generateMetadata({
        type: "article",
        publishedTime,
      });

      expect(metadata.openGraph).toBeDefined();
    });

    it("should handle custom authors", () => {
      const authors = ["John Doe", "Jane Smith"];
      const metadata = generateMetadata({
        authors,
      });

      expect(metadata.authors).toEqual([
        { name: "John Doe" },
        { name: "Jane Smith" },
      ]);
    });

    it("should handle custom image", () => {
      const customImage = "/custom-image.jpg";
      const metadata = generateMetadata({
        image: customImage,
      });

      expect(metadata.openGraph?.images).toBeDefined();
    });

    it("should generate robots metadata correctly", () => {
      const metadata = generateMetadata();

      expect(metadata.robots).toBeDefined();
    });

    it("should handle modified time", () => {
      const modifiedTime = "2024-01-02T00:00:00Z";
      const metadata = generateMetadata({
        modifiedTime,
      });

      expect(metadata.openGraph).toBeDefined();
    });
  });

  describe("generateStructuredData", () => {
    it("should generate basic structured data", () => {
      const data = { name: "Test", description: "Test description" };
      const result = generateStructuredData("Organization", data);
      const parsed = JSON.parse(result);

      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBe("Organization");
      expect(parsed.name).toBe("Test");
      expect(parsed.description).toBe("Test description");
    });

    it("should handle complex nested data", () => {
      const data = {
        name: "Test",
        address: {
          street: "123 Test St",
          city: "Test City",
        },
        contact: ["email@test.com", "phone"],
      };
      const result = generateStructuredData("Organization", data);
      const parsed = JSON.parse(result);

      expect(parsed.address.street).toBe("123 Test St");
      expect(parsed.contact).toEqual(["email@test.com", "phone"]);
    });

    it("should handle empty data object", () => {
      const result = generateStructuredData("Thing", {});
      const parsed = JSON.parse(result);

      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBe("Thing");
      expect(Object.keys(parsed)).toHaveLength(2);
    });

    it("should preserve special characters in data", () => {
      const data = { name: "Test & Company", description: "Café résumé" };
      const result = generateStructuredData("Organization", data);
      const parsed = JSON.parse(result);

      expect(parsed.name).toBe("Test & Company");
      expect(parsed.description).toBe("Café résumé");
    });
  });

  describe("generateOrganizationStructuredData", () => {
    it("should generate organization structured data", () => {
      const result = generateOrganizationStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed["@type"]).toBe("Organization");
      expect(parsed.name).toBe("LinkedIn Profil Değerlendirici");
      expect(parsed.url).toBe("https://linkedinprofileprofiler.com");
      expect(parsed.description).toContain("LinkedIn profilinizi");
    });

    it("should include contact information", () => {
      const result = generateOrganizationStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.contactPoint).toHaveProperty("@type", "ContactPoint");
      expect(parsed.contactPoint).toHaveProperty(
        "contactType",
        "customer service"
      );
      expect(parsed.contactPoint.availableLanguage).toContain("Turkish");
    });

    it("should include address information", () => {
      const result = generateOrganizationStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.address).toHaveProperty("@type", "PostalAddress");
      expect(parsed.address).toHaveProperty("addressCountry", "TR");
    });

    it("should include founder information", () => {
      const result = generateOrganizationStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.founders).toHaveLength(1);
      expect(parsed.founders[0]).toHaveProperty("@type", "Person");
    });

    it("should include social media links", () => {
      const result = generateOrganizationStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.sameAs).toContain("https://twitter.com/linkedinprofiler");
      expect(parsed.sameAs).toContain(
        "https://linkedin.com/company/linkedinprofiler"
      );
    });
  });

  describe("generateWebsiteStructuredData", () => {
    it("should generate website structured data", () => {
      const result = generateWebsiteStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed["@type"]).toBe("WebSite");
      expect(parsed.name).toBe("LinkedIn Profil Değerlendirici");
      expect(parsed.url).toBe("https://linkedinprofileprofiler.com");
    });

    it("should include search action", () => {
      const result = generateWebsiteStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.potentialAction).toHaveProperty("@type", "SearchAction");
      expect(parsed.potentialAction.target).toContain("search?q=");
    });

    it("should include publisher information", () => {
      const result = generateWebsiteStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.publisher).toHaveProperty("@type", "Organization");
      expect(parsed.publisher).toHaveProperty(
        "name",
        "LinkedIn Profil Değerlendirici"
      );
      expect(parsed.publisher.logo).toHaveProperty("@type", "ImageObject");
    });
  });

  describe("generateServiceStructuredData", () => {
    it("should generate service structured data", () => {
      const result = generateServiceStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed["@type"]).toBe("Service");
      expect(parsed.name).toBe("LinkedIn Profil Analizi Hizmeti");
      expect(parsed.description).toContain("Profesyonel LinkedIn");
    });

    it("should include provider information", () => {
      const result = generateServiceStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.provider).toHaveProperty("@type", "Organization");
      expect(parsed.provider).toHaveProperty(
        "name",
        "LinkedIn Profil Değerlendirici"
      );
    });

    it("should include area served", () => {
      const result = generateServiceStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.areaServed).toHaveProperty("@type", "Country");
      expect(parsed.areaServed).toHaveProperty("name", "Turkey");
    });

    it("should include offer catalog", () => {
      const result = generateServiceStructuredData();
      const parsed = JSON.parse(result);

      expect(parsed.hasOfferCatalog).toHaveProperty("@type", "OfferCatalog");
      expect(parsed.hasOfferCatalog.itemListElement).toHaveLength(2);
    });

    it("should include free and premium offers", () => {
      const result = generateServiceStructuredData();
      const parsed = JSON.parse(result);

      const offers = parsed.hasOfferCatalog.itemListElement;
      const freeOffer = offers.find(
        (offer: { price: string }) => offer.price === "0"
      );
      const premiumOffer = offers.find(
        (offer: { price: string }) => offer.price !== "0"
      );

      expect(freeOffer).toBeDefined();
      expect(freeOffer?.itemOffered?.name).toContain("Ücretsiz");
      expect(premiumOffer).toBeDefined();
    });

    it("should include proper pricing for offers", () => {
      const result = generateServiceStructuredData();
      const parsed = JSON.parse(result);

      const offers = parsed.hasOfferCatalog.itemListElement;
      offers.forEach((offer: { price: string; priceCurrency: string }) => {
        expect(offer.priceCurrency).toBe("USD");
        expect(typeof offer.price).toBe("string");
      });
    });
  });

  describe("generateBreadcrumbStructuredData", () => {
    it("should generate breadcrumb structured data for simple path", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ];
      const result = generateBreadcrumbStructuredData(items);
      const parsed = JSON.parse(result);

      expect(parsed["@type"]).toBe("BreadcrumbList");
      expect(parsed.itemListElement).toHaveLength(2);
    });

    it("should handle relative URLs correctly", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Profile", url: "/profile" },
        { name: "Settings", url: "/profile/settings" },
      ];
      const result = generateBreadcrumbStructuredData(items);
      const parsed = JSON.parse(result);

      const firstItem = parsed.itemListElement[0];
      const secondItem = parsed.itemListElement[1];
      const thirdItem = parsed.itemListElement[2];

      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe("Home");
      expect(firstItem.item).toBe("https://linkedinprofileprofiler.com/");

      expect(secondItem.position).toBe(2);
      expect(secondItem.name).toBe("Profile");
      expect(secondItem.item).toBe(
        "https://linkedinprofileprofiler.com/profile"
      );

      expect(thirdItem.position).toBe(3);
      expect(thirdItem.name).toBe("Settings");
      expect(thirdItem.item).toBe(
        "https://linkedinprofileprofiler.com/profile/settings"
      );
    });

    it("should handle absolute URLs correctly", () => {
      const items = [
        { name: "External", url: "https://example.com/page" },
        { name: "Another", url: "https://another.com/path" },
      ];
      const result = generateBreadcrumbStructuredData(items);
      const parsed = JSON.parse(result);

      expect(parsed.itemListElement[0].item).toBe("https://example.com/page");
      expect(parsed.itemListElement[1].item).toBe("https://another.com/path");
    });

    it("should handle empty breadcrumb array", () => {
      const result = generateBreadcrumbStructuredData([]);
      const parsed = JSON.parse(result);

      expect(parsed["@type"]).toBe("BreadcrumbList");
      expect(parsed.itemListElement).toHaveLength(0);
    });

    it("should preserve special characters in breadcrumb names", () => {
      const items = [
        { name: "Profil & Analiz", url: "/profile" },
        { name: "Résumé Details", url: "/resume" },
      ];
      const result = generateBreadcrumbStructuredData(items);
      const parsed = JSON.parse(result);

      expect(parsed.itemListElement[0].name).toBe("Profil & Analiz");
      expect(parsed.itemListElement[1].name).toBe("Résumé Details");
    });

    it("should maintain correct position indexing", () => {
      const items = Array.from({ length: 5 }, (_, i) => ({
        name: `Level ${i + 1}`,
        url: `/level-${i + 1}`,
      }));
      const result = generateBreadcrumbStructuredData(items);
      const parsed = JSON.parse(result);

      parsed.itemListElement.forEach(
        (item: { position: number }, index: number) => {
          expect(item.position).toBe(index + 1);
        }
      );
    });

    it("should handle complex nested paths", () => {
      const items = [
        { name: "Dashboard", url: "/dashboard" },
        { name: "Analytics", url: "/dashboard/analytics" },
        { name: "Reports", url: "/dashboard/analytics/reports" },
        { name: "Monthly", url: "/dashboard/analytics/reports/monthly" },
      ];
      const result = generateBreadcrumbStructuredData(items);
      const parsed = JSON.parse(result);

      expect(parsed.itemListElement).toHaveLength(4);
      expect(parsed.itemListElement[3].name).toBe("Monthly");
      expect(parsed.itemListElement[3].item).toBe(
        "https://linkedinprofileprofiler.com/dashboard/analytics/reports/monthly"
      );
    });
  });

  describe("siteConfig", () => {
    it("should export site configuration", () => {
      expect(siteConfig).toBeDefined();
      expect(siteConfig.name).toBe("LinkedIn Profil Değerlendirici");
      expect(siteConfig.url).toBe("https://linkedinprofileprofiler.com");
    });

    it("should have all required configuration properties", () => {
      expect(siteConfig).toHaveProperty("name");
      expect(siteConfig).toHaveProperty("description");
      expect(siteConfig).toHaveProperty("url");
      expect(siteConfig).toHaveProperty("ogImage");
      expect(siteConfig).toHaveProperty("twitterImage");
      expect(siteConfig).toHaveProperty("creator");
      expect(siteConfig).toHaveProperty("keywords");
    });

    it("should have valid keywords array", () => {
      expect(Array.isArray(siteConfig.keywords)).toBe(true);
      expect(siteConfig.keywords.length).toBeGreaterThan(0);
      expect(siteConfig.keywords).toContain("LinkedIn profil analizi");
    });

    it("should have proper URL format", () => {
      expect(siteConfig.url).toMatch(/^https?:\/\//);
      expect(siteConfig.url.endsWith("/")).toBe(false);
    });
  });
});
