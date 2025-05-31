describe("robots.ts", () => {
  let robots: () => unknown;

  beforeEach(() => {
    // Import the robots function
    const robotsModule = jest.requireActual("../robots");
    robots = robotsModule.default;
  });

  describe("Robot configuration", () => {
    it("should return a robots configuration", () => {
      const result = robots();
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("should contain rules property", () => {
      const result = robots() as Record<string, unknown>;
      expect(result.rules).toBeDefined();
    });

    it("should contain sitemap property", () => {
      const result = robots() as Record<string, unknown>;
      expect(result.sitemap).toBeDefined();
    });
  });

  describe("Basic structure validation", () => {
    it("should have properties rules and sitemap", () => {
      const result = robots() as Record<string, unknown>;

      expect(result).toHaveProperty("rules");
      expect(result).toHaveProperty("sitemap");
    });

    it("should have sitemap as string", () => {
      const result = robots() as Record<string, unknown>;
      expect(typeof result.sitemap).toBe("string");
    });

    it("should return an object with expected structure", () => {
      const result = robots();

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      expect(result).not.toBeNull();
    });
  });

  describe("Function execution", () => {
    it("should execute without throwing", () => {
      expect(() => robots()).not.toThrow();
    });

    it("should return consistent results", () => {
      const result1 = robots();
      const result2 = robots();

      expect(result1).toEqual(result2);
    });

    it("should be callable multiple times", () => {
      expect(() => {
        robots();
        robots();
        robots();
      }).not.toThrow();
    });
  });
});
