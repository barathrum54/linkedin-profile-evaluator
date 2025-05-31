import {
  addNumbers,
  formatEmail,
  validatePassword,
  generateSlug,
  truncateText,
  capitalizeWords,
} from "../utils";

describe("Utils Functions", () => {
  describe("addNumbers", () => {
    it("should add two positive numbers", () => {
      expect(addNumbers(2, 3)).toBe(5);
      expect(addNumbers(10, 15)).toBe(25);
    });

    it("should add negative numbers", () => {
      expect(addNumbers(-2, -3)).toBe(-5);
      expect(addNumbers(-10, 5)).toBe(-5);
    });

    it("should handle zero", () => {
      expect(addNumbers(0, 5)).toBe(5);
      expect(addNumbers(5, 0)).toBe(5);
      expect(addNumbers(0, 0)).toBe(0);
    });

    it("should handle decimal numbers", () => {
      expect(addNumbers(1.5, 2.5)).toBe(4);
      expect(addNumbers(0.1, 0.2)).toBeCloseTo(0.3);
    });

    it("should handle very large numbers", () => {
      expect(addNumbers(Number.MAX_SAFE_INTEGER, 1)).toBe(
        Number.MAX_SAFE_INTEGER + 1
      );
    });
  });

  describe("formatEmail", () => {
    it("should convert email to lowercase and trim", () => {
      expect(formatEmail("Test@Example.Com")).toBe("test@example.com");
      expect(formatEmail("  USER@DOMAIN.ORG  ")).toBe("user@domain.org");
    });

    it("should handle already formatted emails", () => {
      expect(formatEmail("user@example.com")).toBe("user@example.com");
    });

    it("should handle emails with special characters", () => {
      expect(formatEmail("User+Tag@Example.Com")).toBe("user+tag@example.com");
      expect(formatEmail("test.email@sub-domain.co.uk")).toBe(
        "test.email@sub-domain.co.uk"
      );
    });

    it("should handle empty and whitespace strings", () => {
      expect(formatEmail("")).toBe("");
      expect(formatEmail("   ")).toBe("");
      expect(formatEmail("\t\n")).toBe("");
    });

    it("should handle unicode characters", () => {
      expect(formatEmail("Tëst@Ëxample.com")).toBe("tëst@ëxample.com");
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      expect(validatePassword("Password123!")).toBe(true);
      expect(validatePassword("MyP@ssw0rd")).toBe(true);
      expect(validatePassword("Test1234!")).toBe(true);
      expect(validatePassword("Str0ng!Pass")).toBe(true);
      expect(validatePassword("Complex1#")).toBe(true);
    });

    it("should reject weak passwords", () => {
      expect(validatePassword("password")).toBe(false); // no uppercase, digits, special chars
      expect(validatePassword("PASSWORD")).toBe(false); // no lowercase, digits, special chars
      expect(validatePassword("Password")).toBe(false); // no digits, special chars
      expect(validatePassword("Password123")).toBe(false); // no special chars
      expect(validatePassword("Pass12!")).toBe(false); // too short (7 chars)
      expect(validatePassword("")).toBe(false); // empty
    });

    it("should handle minimum length requirement", () => {
      expect(validatePassword("Aa1!")).toBe(false); // 4 chars - too short
      expect(validatePassword("Aa1!bcde")).toBe(true); // 8 chars - minimum
      expect(validatePassword("A1!")).toBe(false); // 3 chars - too short
    });

    it("should require all character types", () => {
      expect(validatePassword("abcdefgh")).toBe(false); // no uppercase, digits, special
      expect(validatePassword("ABCDEFGH")).toBe(false); // no lowercase, digits, special
      expect(validatePassword("12345678")).toBe(false); // no letters, special
      expect(validatePassword("!@#$%^&*")).toBe(false); // no letters, digits
    });

    it("should handle various special characters", () => {
      expect(validatePassword("Password1@")).toBe(true);
      expect(validatePassword("Password1#")).toBe(true);
      expect(validatePassword("Password1$")).toBe(true);
      expect(validatePassword("Password1%")).toBe(true);
      expect(validatePassword("Password1^")).toBe(true);
      expect(validatePassword("Password1&")).toBe(true);
      expect(validatePassword("Password1*")).toBe(true);
      expect(validatePassword("Password1(")).toBe(true);
      expect(validatePassword("Password1)")).toBe(true);
      expect(validatePassword("Password1-")).toBe(true);
      expect(validatePassword("Password1_")).toBe(true);
      expect(validatePassword("Password1+")).toBe(true);
      expect(validatePassword("Password1=")).toBe(true);
    });

    it("should handle long passwords", () => {
      const longPassword = "Password123!" + "a".repeat(100);
      expect(validatePassword(longPassword)).toBe(true);
    });
  });

  describe("generateSlug", () => {
    it("should convert text to slug format", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
      expect(generateSlug("JavaScript Developer")).toBe("javascript-developer");
      expect(generateSlug("React.js Tutorial")).toBe("reactjs-tutorial");
    });

    it("should handle special characters", () => {
      expect(generateSlug("Hello, World!")).toBe("hello-world");
      expect(generateSlug("TypeScript & React")).toBe("typescript-react");
      expect(generateSlug("Node.js (Backend)")).toBe("nodejs-backend");
      expect(generateSlug("API @ Version 2.0")).toBe("api-version-20");
    });

    it("should handle multiple spaces and underscores", () => {
      expect(generateSlug("Multiple   Spaces")).toBe("multiple-spaces");
      expect(generateSlug("With_Underscores_Here")).toBe(
        "with-underscores-here"
      );
      expect(generateSlug("Mixed   _  Separators")).toBe("mixed-separators");
    });

    it("should remove leading and trailing hyphens", () => {
      expect(generateSlug("-Leading Hyphen")).toBe("leading-hyphen");
      expect(generateSlug("Trailing Hyphen-")).toBe("trailing-hyphen");
      expect(generateSlug("-Both Sides-")).toBe("both-sides");
      expect(generateSlug("---Multiple---")).toBe("multiple");
    });

    it("should handle empty and whitespace strings", () => {
      expect(generateSlug("")).toBe("");
      expect(generateSlug("   ")).toBe("");
      expect(generateSlug("---")).toBe("");
    });

    it("should handle numbers", () => {
      expect(generateSlug("Version 2.0")).toBe("version-20");
      expect(generateSlug("Year 2023")).toBe("year-2023");
      expect(generateSlug("123 Numbers")).toBe("123-numbers");
    });

    it("should handle unicode characters", () => {
      expect(generateSlug("Café & Restaurant")).toBe("caf-restaurant");
      expect(generateSlug("Résumé Template")).toBe("rsum-template");
    });

    it("should handle already slugified text", () => {
      expect(generateSlug("already-slugified")).toBe("already-slugified");
      expect(generateSlug("simple-slug")).toBe("simple-slug");
    });
  });

  describe("truncateText", () => {
    it("should truncate text longer than maxLength", () => {
      expect(truncateText("This is a long text", 10)).toBe("This is...");
      expect(truncateText("Hello World", 5)).toBe("He...");
    });

    it("should return original text if shorter than maxLength", () => {
      expect(truncateText("Short", 10)).toBe("Short");
      expect(truncateText("Hello", 5)).toBe("Hello");
      expect(truncateText("Hi", 10)).toBe("Hi");
    });

    it("should return original text if equal to maxLength", () => {
      expect(truncateText("Hello", 5)).toBe("Hello");
      expect(truncateText("Test", 4)).toBe("Test");
    });

    it("should handle edge cases", () => {
      expect(truncateText("", 5)).toBe("");
      expect(truncateText("Test", 0)).toBe("T...");
      expect(truncateText("Test", 1)).toBe("Te...");
      expect(truncateText("Test", 2)).toBe("Tes...");
      expect(truncateText("Test", 3)).toBe("...");
      expect(truncateText("Test", 4)).toBe("Test");
    });

    it("should handle very long text", () => {
      const longText = "a".repeat(1000);
      const result = truncateText(longText, 50);
      expect(result).toBe("a".repeat(47) + "...");
      expect(result.length).toBe(50);
    });

    it("should handle unicode characters", () => {
      expect(truncateText("Héllo Wörld", 8)).toBe("Héllo...");
      expect(truncateText("测试文本", 3)).toBe("...");
    });

    it("should preserve ellipsis length in calculation", () => {
      const text = "Hello World";
      const maxLength = 8;
      const result = truncateText(text, maxLength);
      expect(result.length).toBe(maxLength);
      expect(result).toBe("Hello...");
    });
  });

  describe("capitalizeWords", () => {
    it("should capitalize first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("javascript developer")).toBe(
        "Javascript Developer"
      );
      expect(capitalizeWords("react native app")).toBe("React Native App");
    });

    it("should handle mixed case input", () => {
      expect(capitalizeWords("hELLo WoRLD")).toBe("Hello World");
      expect(capitalizeWords("jAVAsCRiPt")).toBe("Javascript");
      expect(capitalizeWords("rEaCt nAtIvE")).toBe("React Native");
    });

    it("should handle single word", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
      expect(capitalizeWords("WORLD")).toBe("World");
      expect(capitalizeWords("tEsT")).toBe("Test");
    });

    it("should handle words with special characters", () => {
      expect(capitalizeWords("hello-world")).toBe("Hello-world");
      expect(capitalizeWords("node.js")).toBe("Node.js");
      expect(capitalizeWords("react/vue")).toBe("React/vue");
    });

    it("should handle multiple spaces", () => {
      expect(capitalizeWords("hello   world")).toBe("Hello   World");
      expect(capitalizeWords("  spaced  words  ")).toBe("  Spaced  Words  ");
    });

    it("should handle empty and whitespace strings", () => {
      expect(capitalizeWords("")).toBe("");
      expect(capitalizeWords("   ")).toBe("   ");
      expect(capitalizeWords("\t\n")).toBe("\t\n");
    });

    it("should handle numbers and mixed content", () => {
      expect(capitalizeWords("version 2.0")).toBe("Version 2.0");
      expect(capitalizeWords("year 2023")).toBe("Year 2023");
      expect(capitalizeWords("123 test")).toBe("123 Test");
    });

    it("should handle unicode characters", () => {
      expect(capitalizeWords("café résumé")).toBe("Café Résumé");
      expect(capitalizeWords("naïve approach")).toBe("Naïve Approach");
    });

    it("should handle apostrophes and contractions", () => {
      expect(capitalizeWords("don't stop")).toBe("Don't Stop");
      expect(capitalizeWords("it's working")).toBe("It's Working");
      expect(capitalizeWords("we're here")).toBe("We're Here");
    });

    it("should handle already capitalized text", () => {
      expect(capitalizeWords("Hello World")).toBe("Hello World");
      expect(capitalizeWords("Already Capitalized")).toBe(
        "Already Capitalized"
      );
    });
  });
});
