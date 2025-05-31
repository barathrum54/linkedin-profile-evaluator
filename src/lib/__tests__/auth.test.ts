import bcrypt from "bcryptjs";

// Mock bcrypt
jest.mock("bcryptjs");
const mockedBcrypt = jest.mocked(bcrypt);

// Standalone utility functions for testing
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Additional check for consecutive dots in domain
  if (emailRegex.test(email)) {
    const [, domain] = email.split("@");
    return !domain.includes("..");
  }
  return false;
}

function validatePassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function sanitizeUserInput(input: string): string {
  return input.trim().toLowerCase();
}

function generateUserId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function createUserData(email: string, name: string, hashedPassword: string) {
  return {
    id: generateUserId(),
    email: sanitizeUserInput(email),
    name: name.trim(),
    password: hashedPassword,
    emailVerified: null,
    image: null,
    provider: "credentials",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("Auth Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should hash password using bcrypt with salt rounds 12", async () => {
      const mockHash = "hashed_password_123";
      mockedBcrypt.hash.mockResolvedValue(mockHash as never);

      const result = await hashPassword("password123");

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("password123", 12);
      expect(result).toBe(mockHash);
    });

    it("should handle bcrypt hash errors", async () => {
      const error = new Error("Hashing failed");
      mockedBcrypt.hash.mockRejectedValue(error as never);

      await expect(hashPassword("password123")).rejects.toThrow(
        "Hashing failed"
      );
    });

    it("should handle empty password", async () => {
      const mockHash = "hashed_empty";
      mockedBcrypt.hash.mockResolvedValue(mockHash as never);

      const result = await hashPassword("");

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("", 12);
      expect(result).toBe(mockHash);
    });

    it("should handle special characters in password", async () => {
      const mockHash = "hashed_special";
      mockedBcrypt.hash.mockResolvedValue(mockHash as never);

      const result = await hashPassword("P@ssw0rd!@#$%^&*");

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("P@ssw0rd!@#$%^&*", 12);
      expect(result).toBe(mockHash);
    });

    it("should handle long passwords", async () => {
      const longPassword = "a".repeat(100);
      const mockHash = "hashed_long";
      mockedBcrypt.hash.mockResolvedValue(mockHash as never);

      const result = await hashPassword(longPassword);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(longPassword, 12);
      expect(result).toBe(mockHash);
    });

    it("should handle unicode characters", async () => {
      const unicodePassword = "pássw0rd123!";
      const mockHash = "hashed_unicode";
      mockedBcrypt.hash.mockResolvedValue(mockHash as never);

      const result = await hashPassword(unicodePassword);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(unicodePassword, 12);
      expect(result).toBe(mockHash);
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await verifyPassword("password123", "hashed_password");

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed_password"
      );
      expect(result).toBe(true);
    });

    it("should reject incorrect password", async () => {
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await verifyPassword("wrongpassword", "hashed_password");

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        "hashed_password"
      );
      expect(result).toBe(false);
    });

    it("should handle bcrypt compare errors", async () => {
      const error = new Error("Compare failed");
      mockedBcrypt.compare.mockRejectedValue(error as never);

      await expect(verifyPassword("password", "hash")).rejects.toThrow(
        "Compare failed"
      );
    });

    it("should handle empty password", async () => {
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await verifyPassword("", "hashed_password");

      expect(mockedBcrypt.compare).toHaveBeenCalledWith("", "hashed_password");
      expect(result).toBe(false);
    });

    it("should handle empty hash", async () => {
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await verifyPassword("password", "");

      expect(mockedBcrypt.compare).toHaveBeenCalledWith("password", "");
      expect(result).toBe(false);
    });

    it("should handle both empty inputs", async () => {
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await verifyPassword("", "");

      expect(mockedBcrypt.compare).toHaveBeenCalledWith("", "");
      expect(result).toBe(false);
    });

    it("should handle unicode characters", async () => {
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await verifyPassword("pássw0rd123!", "hashed_unicode");

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        "pássw0rd123!",
        "hashed_unicode"
      );
      expect(result).toBe(true);
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("test+tag@example.org")).toBe(true);
      expect(validateEmail("user123@test-domain.com")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("test.example.com")).toBe(false);
      expect(validateEmail("test@.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(validateEmail("a@b.co")).toBe(true);
      expect(validateEmail("test@localhost")).toBe(false);
      expect(validateEmail("test..test@example.com")).toBe(true);
      expect(validateEmail("test@example..com")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      expect(validatePassword("Password123!")).toBe(true);
      expect(validatePassword("MyP@ssw0rd")).toBe(true);
      expect(validatePassword("Test1234!")).toBe(true);
      expect(validatePassword("Str0ng!Pass")).toBe(true);
    });

    it("should reject weak passwords", () => {
      expect(validatePassword("password")).toBe(false); // no uppercase, digits, special chars
      expect(validatePassword("PASSWORD")).toBe(false); // no lowercase, digits, special chars
      expect(validatePassword("Password")).toBe(false); // no digits, special chars
      expect(validatePassword("Password123")).toBe(false); // no special chars
      expect(validatePassword("Pass12!")).toBe(false); // too short (7 chars)
      expect(validatePassword("")).toBe(false); // empty
    });

    it("should handle minimum requirements", () => {
      expect(validatePassword("Aa1!")).toBe(false); // too short (4 chars)
      expect(validatePassword("Abcd123!")).toBe(true); // exactly 8 chars
      expect(validatePassword("A1!")).toBe(false); // too short (3 chars)
    });

    it("should handle special character variations", () => {
      expect(validatePassword("Password1@")).toBe(true);
      expect(validatePassword("Password1#")).toBe(true);
      expect(validatePassword("Password1$")).toBe(true);
      expect(validatePassword("Password1%")).toBe(true);
      expect(validatePassword("Password1^")).toBe(true);
      expect(validatePassword("Password1&")).toBe(true);
      expect(validatePassword("Password1*")).toBe(true);
    });
  });

  describe("sanitizeUserInput", () => {
    it("should trim and convert to lowercase", () => {
      expect(sanitizeUserInput(" Test@Example.Com ")).toBe("test@example.com");
      expect(sanitizeUserInput("  UPPERCASE  ")).toBe("uppercase");
      expect(sanitizeUserInput("MixedCase")).toBe("mixedcase");
    });

    it("should handle empty and whitespace strings", () => {
      expect(sanitizeUserInput("")).toBe("");
      expect(sanitizeUserInput("   ")).toBe("");
      expect(sanitizeUserInput("\t\n ")).toBe("");
    });

    it("should handle special characters", () => {
      expect(sanitizeUserInput(" User+Tag@Example.Com ")).toBe(
        "user+tag@example.com"
      );
      expect(sanitizeUserInput(" Test-User123 ")).toBe("test-user123");
    });
  });

  describe("generateUserId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateUserId();
      const id2 = generateUserId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe("string");
      expect(typeof id2).toBe("string");
    });

    it("should generate IDs of consistent length", () => {
      const ids = Array.from({ length: 10 }, () => generateUserId());

      ids.forEach((id) => {
        expect(id.length).toBe(9);
        expect(/^[a-z0-9]+$/.test(id)).toBe(true);
      });
    });

    it("should generate alphanumeric IDs only", () => {
      const ids = Array.from({ length: 20 }, () => generateUserId());

      ids.forEach((id) => {
        expect(/^[a-z0-9]+$/.test(id)).toBe(true);
      });
    });
  });

  describe("createUserData", () => {
    it("should create properly formatted user data", () => {
      const userData = createUserData(
        "Test@Example.Com",
        "  John Doe  ",
        "hashed_password"
      );

      expect(userData).toMatchObject({
        email: "test@example.com",
        name: "John Doe",
        password: "hashed_password",
        emailVerified: null,
        image: null,
        provider: "credentials",
      });
      expect(userData.id).toBeDefined();
      expect(userData.createdAt).toBeInstanceOf(Date);
      expect(userData.updatedAt).toBeInstanceOf(Date);
    });

    it("should handle empty name", () => {
      const userData = createUserData(
        "test@example.com",
        "",
        "hashed_password"
      );

      expect(userData.name).toBe("");
      expect(userData.email).toBe("test@example.com");
    });

    it("should handle whitespace-only name", () => {
      const userData = createUserData(
        "test@example.com",
        "   ",
        "hashed_password"
      );

      expect(userData.name).toBe("");
      expect(userData.email).toBe("test@example.com");
    });

    it("should generate unique IDs for different users", () => {
      const user1 = createUserData("user1@example.com", "User One", "hash1");
      const user2 = createUserData("user2@example.com", "User Two", "hash2");

      expect(user1.id).not.toBe(user2.id);
    });

    it("should set timestamps within reasonable range", () => {
      const before = new Date();
      const userData = createUserData(
        "test@example.com",
        "Test User",
        "hashed"
      );
      const after = new Date();

      expect(userData.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(userData.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(userData.updatedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(userData.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
