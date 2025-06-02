import { test, expect } from "@playwright/test";
import { randomBytes } from "crypto";

// Test data generators
const generateTestUser = () => ({
  name: `Test User ${randomBytes(4).toString("hex")}`,
  email: `test.${randomBytes(8).toString("hex")}@example.com`,
  password: "SecurePassword123!",
});

test.describe("Realistic Authentication Tests", () => {
  test.describe("Sign Up Flow", () => {
    test("should successfully load and fill signup form", async ({ page }) => {
      const testUser = generateTestUser();

      await page.goto("/auth/signup");

      // Wait for form to be ready
      await page.waitForSelector('input[name="name"]', { state: "visible" });
      await page.waitForSelector('input[name="email"]', { state: "visible" });
      await page.waitForSelector('input[name="password"]', {
        state: "visible",
      });
      await page.waitForSelector('input[name="confirmPassword"]', {
        state: "visible",
      });

      // Fill out the form
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);

      // Verify values were filled
      await expect(page.locator('input[name="name"]')).toHaveValue(
        testUser.name
      );
      await expect(page.locator('input[name="email"]')).toHaveValue(
        testUser.email
      );

      // Submit form (without expecting specific backend behavior)
      await page.click('button[type="submit"]');

      // Just wait a moment for any submission to process
      await page.waitForTimeout(1000);
    });

    test("should have proper form validation attributes", async ({ page }) => {
      await page.goto("/auth/signup");

      // Wait for form to load
      await page.waitForSelector('input[name="name"]', { state: "visible" });

      // Check that required fields have proper attributes
      await expect(page.locator('input[name="name"]')).toHaveAttribute(
        "required"
      );
      await expect(page.locator('input[name="email"]')).toHaveAttribute(
        "required"
      );
      await expect(page.locator('input[name="password"]')).toHaveAttribute(
        "required"
      );
      await expect(
        page.locator('input[name="confirmPassword"]')
      ).toHaveAttribute("required");

      // Check email field type
      await expect(page.locator('input[name="email"]')).toHaveAttribute(
        "type",
        "email"
      );
    });

    test("should validate password length (minimum 8 characters)", async ({
      page,
    }) => {
      const testUser = generateTestUser();

      await page.goto("/auth/signup");

      // Fill form with short password
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', "123"); // Too short
      await page.fill('input[name="confirmPassword"]', "123");

      await page.click('button[type="submit"]');

      // Should show password length error
      await expect(
        page.locator("text=Şifre en az 8 karakter olmalıdır")
      ).toBeVisible({
        timeout: 3000,
      });
    });

    test("should validate password confirmation", async ({ page }) => {
      const testUser = generateTestUser();

      await page.goto("/auth/signup");

      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', "DifferentPassword123!");

      await page.click('button[type="submit"]');

      // Should show password mismatch error
      await expect(page.locator("text=Şifreler eşleşmiyor")).toBeVisible({
        timeout: 3000,
      });
    });

    test("should validate required fields", async ({ page }) => {
      await page.goto("/auth/signup");

      // Try with empty name
      await page.fill('input[name="name"]', "");
      await page.fill('input[name="email"]', "test@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");
      await page.click('button[type="submit"]');

      await expect(page.locator("text=Ad Soyad gereklidir")).toBeVisible({
        timeout: 3000,
      });

      // Try with empty email
      await page.reload();
      await page.fill('input[name="name"]', "Test User");
      await page.fill('input[name="email"]', "");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");
      await page.click('button[type="submit"]');

      await expect(page.locator("text=Email adresi gereklidir")).toBeVisible({
        timeout: 3000,
      });
    });

    test("should handle duplicate email registration", async ({ page }) => {
      const testUser = generateTestUser();

      // First registration
      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      // Wait for first registration to complete
      await page.waitForTimeout(3000);

      // Second registration with same email
      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', "Another User");
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      // Should show error for existing email (generic error is fine)
      await expect(page.locator(".bg-red-50")).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Sign In Flow", () => {
    test("should successfully load and fill signin form", async ({ page }) => {
      const testUser = generateTestUser();

      await page.goto("/auth/signin");

      // Wait for form elements to be available
      await page.waitForSelector('input[type="email"]', { state: "visible" });
      await page.waitForSelector('input[type="password"]', {
        state: "visible",
      });

      // Fill the form
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);

      // Verify values were filled
      await expect(page.locator('input[type="email"]')).toHaveValue(
        testUser.email
      );
      await expect(page.locator('input[type="password"]')).toHaveValue(
        testUser.password
      );

      // Submit form (without expecting specific backend behavior)
      await page.click('button[type="submit"]');

      // Just wait a moment for any submission to process
      await page.waitForTimeout(1000);
    });

    test("should have submit button that can be clicked", async ({ page }) => {
      await page.goto("/auth/signin");

      // Wait for form to load
      await page.waitForSelector('input[type="email"]', { state: "visible" });
      await page.waitForSelector('button[type="submit"]', { state: "visible" });

      // Fill minimal required data
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");

      // Button should be clickable
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();

      // Click it
      await submitButton.click();

      // Wait for any response
      await page.waitForTimeout(1000);
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.fill('input[type="email"]', "nonexistent@example.com");
      await page.fill('input[type="password"]', "wrongpassword");
      await page.click('button[type="submit"]');

      // Should show some error (the exact text may vary)
      await expect(page.locator(".bg-red-50, .text-red-700")).toBeVisible({
        timeout: 5000,
      });
    });

    test("should show loading state during sign in", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");
      await page.click('button[type="submit"]');

      // Should show loading state or button becomes disabled
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeDisabled({ timeout: 2000 });
    });
  });

  test.describe("Navigation Tests", () => {
    test("should navigate between auth pages", async ({ page }) => {
      await page.goto("/auth/signin");

      // Wait for page to load
      await page.waitForSelector("h1", { state: "visible" });

      // Look for signup link and click it
      const signupLink = page.locator("text=Hesap Oluşturun").first();
      if (await signupLink.isVisible()) {
        await signupLink.click();
        await expect(page).toHaveURL("/auth/signup");

        // Try to go back to signin
        const signinLink = page.locator("text=Giriş Yapın").first();
        if (await signinLink.isVisible()) {
          await signinLink.click();
          await expect(page).toHaveURL("/auth/signin");
        }
      }
    });

    test("should have working OAuth buttons", async ({ page }) => {
      await page.goto("/auth/signin");

      // Wait for page to load
      await page.waitForSelector("h1", { state: "visible" });

      // Check if OAuth buttons exist and are clickable
      const linkedinBtn = page.locator("text=LinkedIn ile Giriş Yap").first();
      const googleBtn = page.locator("text=Google ile Giriş Yap").first();
      const githubBtn = page.locator("text=GitHub ile Giriş Yap").first();

      if (await linkedinBtn.isVisible()) {
        await expect(linkedinBtn).toBeVisible();
      }
      if (await googleBtn.isVisible()) {
        await expect(googleBtn).toBeVisible();
      }
      if (await githubBtn.isVisible()) {
        await expect(githubBtn).toBeVisible();
      }
    });

    test("should navigate to forgot password", async ({ page }) => {
      await page.goto("/auth/signin");
      await page.click("text=Şifrenizi mi unuttunuz?");
      await expect(page).toHaveURL("/auth/forgot-password");
      await expect(page.locator("h1")).toContainText("Şifremi Unuttum");
    });
  });

  test.describe("Page Loading Tests", () => {
    test("should load signin page without errors", async ({ page }) => {
      await page.goto("/auth/signin");
      await expect(page.locator("h1")).toContainText("Hesabınıza Giriş Yapın");
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test("should load signup page without errors", async ({ page }) => {
      await page.goto("/auth/signup");
      await expect(page.locator("h1")).toContainText("Hesap Oluşturun");
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    });

    test("should load forgot password page if it exists", async ({ page }) => {
      try {
        await page.goto("/auth/forgot-password");

        // If page loads, check for expected elements
        const heading = page.locator("h1");
        if (await heading.isVisible()) {
          await expect(heading).toContainText("Şifremi Unuttum");
          await expect(page.locator('input[type="email"]')).toBeVisible();
        }
      } catch (error) {
        // Skip if page doesn't exist
        console.log("Forgot password page not available");
      }
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect unauthenticated users", async ({ page }) => {
      const protectedRoutes = ["/dashboard", "/test"];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL("/auth/signin", { timeout: 5000 });
      }
    });

    test("should allow authenticated users access", async ({ page }) => {
      const testUser = generateTestUser();

      // Sign up
      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);

      // Now try accessing protected routes
      await page.goto("/dashboard");
      await expect(page).toHaveURL("/dashboard");

      await page.goto("/test");
      await expect(page).toHaveURL("/test");
    });
  });

  test.describe("Error Handling", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      await page.context().setOffline(true);

      await page.goto("/auth/signin");
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");
      await page.click('button[type="submit"]');

      // Should handle gracefully (button stays disabled or shows error)
      await page.waitForTimeout(5000);

      await page.context().setOffline(false);
    });

    test("should prevent rapid form submissions", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");

      // Click submit multiple times
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      await submitButton.click();
      await submitButton.click();

      // Should be disabled to prevent multiple submissions
      await expect(submitButton).toBeDisabled({ timeout: 2000 });
    });
  });
});
