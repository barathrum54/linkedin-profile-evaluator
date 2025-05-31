import {
  addNumbers,
  formatEmail,
  validatePassword,
  generateSlug,
  truncateText,
  capitalizeWords,
} from "../utils";

describe("Utility Functions", () => {
  describe("addNumbers", () => {
    it("should add two positive numbers", () => {
      expect(addNumbers(2, 3)).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(addNumbers(-2, 3)).toBe(1);
    });

    it("should handle zero", () => {
      expect(addNumbers(0, 5)).toBe(5);
    });

    it("should handle decimal numbers", () => {
      expect(addNumbers(1.5, 2.3)).toBeCloseTo(3.8);
    });
  });

  describe("formatEmail", () => {
    it("should convert email to lowercase", () => {
      expect(formatEmail("TEST@EXAMPLE.COM")).toBe("test@example.com");
    });

    it("should trim whitespace", () => {
      expect(formatEmail("  test@example.com  ")).toBe("test@example.com");
    });

    it("should handle already formatted email", () => {
      expect(formatEmail("test@example.com")).toBe("test@example.com");
    });

    it("should handle mixed case with whitespace", () => {
      expect(formatEmail("  TeSt@ExAmPlE.CoM  ")).toBe("test@example.com");
    });
  });

  describe("validatePassword", () => {
    it("should return true for strong password", () => {
      expect(validatePassword("Password123!")).toBe(true);
    });

    it("should return false for short password", () => {
      expect(validatePassword("Pass1!")).toBe(false);
    });

    it("should return false for password without uppercase", () => {
      expect(validatePassword("password123!")).toBe(false);
    });

    it("should return false for password without lowercase", () => {
      expect(validatePassword("PASSWORD123!")).toBe(false);
    });

    it("should return false for password without numbers", () => {
      expect(validatePassword("Password!")).toBe(false);
    });

    it("should return false for password without special characters", () => {
      expect(validatePassword("Password123")).toBe(false);
    });

    it("should handle minimum length with all requirements", () => {
      expect(validatePassword("Passw0rd!")).toBe(true);
    });
  });

  describe("generateSlug", () => {
    it("should convert text to lowercase slug", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
    });

    it("should remove special characters", () => {
      expect(generateSlug("Hello, World!")).toBe("hello-world");
    });

    it("should handle multiple spaces", () => {
      expect(generateSlug("Hello    World")).toBe("hello-world");
    });

    it("should handle leading and trailing spaces", () => {
      expect(generateSlug("  Hello World  ")).toBe("hello-world");
    });

    it("should handle underscores", () => {
      expect(generateSlug("hello_world_test")).toBe("hello-world-test");
    });

    it("should handle empty string", () => {
      expect(generateSlug("")).toBe("");
    });
  });

  describe("truncateText", () => {
    it("should not truncate short text", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
    });

    it("should truncate long text with ellipsis", () => {
      expect(truncateText("Hello World", 8)).toBe("Hello...");
    });

    it("should handle exact length", () => {
      expect(truncateText("Hello", 5)).toBe("Hello");
    });

    it("should handle very short maxLength", () => {
      expect(truncateText("Hello World", 3)).toBe("...");
    });
  });

  describe("capitalizeWords", () => {
    it("should capitalize each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
    });

    it("should handle already capitalized words", () => {
      expect(capitalizeWords("Hello World")).toBe("Hello World");
    });

    it("should handle mixed case", () => {
      expect(capitalizeWords("hELLo WoRLd")).toBe("Hello World");
    });

    it("should handle single word", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(capitalizeWords("")).toBe("");
    });
  });
});
