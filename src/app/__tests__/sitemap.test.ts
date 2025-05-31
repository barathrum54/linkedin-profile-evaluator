describe("sitemap.ts", () => {
  let sitemap: () => unknown;

  beforeEach(() => {
    // Import the sitemap function
    const sitemapModule = jest.requireActual("../sitemap");
    sitemap = sitemapModule.default;
  });

  describe("Sitemap generation", () => {
    it("should return a sitemap configuration", () => {
      const result = sitemap();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return an array of URLs", () => {
      const result = sitemap() as Array<unknown>;
      expect(result.length).toBeGreaterThan(0);
    });

    it("should contain URL objects with required properties", () => {
      const result = sitemap() as Array<Record<string, unknown>>;

      result.forEach((urlEntry) => {
        expect(urlEntry).toHaveProperty("url");
        expect(urlEntry).toHaveProperty("lastModified");
      });
    });

    it("should have valid URL format", () => {
      const result = sitemap() as Array<Record<string, unknown>>;

      result.forEach((urlEntry) => {
        const url = urlEntry.url as string;
        expect(typeof url).toBe("string");
        expect(url.length).toBeGreaterThan(0);
        expect(url.startsWith("http")).toBe(true);
      });
    });

    it("should have valid lastModified dates", () => {
      const result = sitemap() as Array<Record<string, unknown>>;

      result.forEach((urlEntry) => {
        const lastModified = urlEntry.lastModified;
        expect(lastModified).toBeDefined();
        expect(lastModified instanceof Date).toBe(true);
      });
    });
  });

  describe("Function execution", () => {
    it("should execute without throwing", () => {
      expect(() => sitemap()).not.toThrow();
    });

    it("should return consistent results", () => {
      const result1 = sitemap();
      const result2 = sitemap();

      expect(result1).toEqual(result2);
    });

    it("should be callable multiple times", () => {
      expect(() => {
        sitemap();
        sitemap();
        sitemap();
      }).not.toThrow();
    });
  });

  describe("Sitemap content validation", () => {
    it("should contain home page", () => {
      const result = sitemap() as Array<Record<string, unknown>>;
      const homeUrl = result.find((entry) => {
        const url = entry.url as string;
        return (
          url.endsWith("/") || url.endsWith("/home") || !url.includes("/", 9)
        ); // After https://
      });

      expect(homeUrl).toBeDefined();
    });

    it("should not have duplicate URLs", () => {
      const result = sitemap() as Array<Record<string, unknown>>;
      const urls = result.map((entry) => entry.url);
      const uniqueUrls = [...new Set(urls)];

      expect(urls.length).toBe(uniqueUrls.length);
    });

    it("should have reasonable number of URLs", () => {
      const result = sitemap() as Array<Record<string, unknown>>;

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThan(1000); // Reasonable upper limit
    });
  });
});
