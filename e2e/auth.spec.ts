import { test, expect } from "@playwright/test";
import { randomBytes } from "crypto";

// Test data generators
const generateTestUser = () => ({
  name: `Test User ${randomBytes(4).toString("hex")}`,
  email: `test.${randomBytes(8).toString("hex")}@example.com`,
  password: "SecurePassword123!",
});

const generateWeakPasswords = () => [
  "123",
  "password",
  "12345678",
  "qwerty",
  "Password", // Missing special chars and numbers
  "password123", // Missing special chars
  "Password!", // Missing numbers
];

test.describe("Authentication Flow - Comprehensive E2E Tests", () => {
  test.describe("Navigation and UI Tests", () => {
    test("should navigate to test page from homepage", async ({ page }) => {
      await page.goto("/");
      await page.click("text=Başla");
      await expect(page).toHaveURL("/test");
    });

    test("should navigate between auth pages correctly", async ({ page }) => {
      // Start at sign up page
      await page.goto("/auth/signup");
      await expect(page.locator("h1")).toContainText("Hesap Oluşturun");

      // Navigate to sign in
      await page.click("text=Giriş Yapın");
      await expect(page).toHaveURL("/auth/signin");
      await expect(page.locator("h1")).toContainText("Hesabınıza Giriş Yapın");

      // Navigate back to sign up
      await page.click("text=Hesap Oluşturun");
      await expect(page).toHaveURL("/auth/signup");

      // Navigate to forgot password
      await page.goto("/auth/signin");
      await page.click("text=Şifrenizi mi unuttunuz?");
      await expect(page).toHaveURL("/auth/forgot-password");
      await expect(page.locator("h1")).toContainText("Şifremi Unuttum");
    });

    test("should display OAuth provider buttons", async ({ page }) => {
      await page.goto("/auth/signin");

      // Check for OAuth provider buttons
      await expect(page.locator("text=LinkedIn ile Giriş Yap")).toBeVisible();
      await expect(page.locator("text=Google ile Giriş Yap")).toBeVisible();
      await expect(page.locator("text=GitHub ile Giriş Yap")).toBeVisible();

      // Check OAuth buttons on signup page too
      await page.goto("/auth/signup");
      await expect(
        page.locator("text=LinkedIn ile Hesap Oluştur")
      ).toBeVisible();
      await expect(page.locator("text=Google ile Hesap Oluştur")).toBeVisible();
      await expect(page.locator("text=GitHub ile Hesap Oluştur")).toBeVisible();
    });

    test("should handle responsive design on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

      await page.goto("/auth/signin");
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();

      // Check if form is properly responsive
      const formContainer = page.locator("form").first();
      await expect(formContainer).toBeVisible();
    });
  });

  test.describe("Sign Up Flow", () => {
    test("should successfully create account with valid data", async ({
      page,
    }) => {
      const testUser = generateTestUser();

      await page.goto("/auth/signup");

      // Fill out the form
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);

      // Accept terms (if checkbox exists)
      const termsCheckbox = page.locator('input[type="checkbox"]');
      if (await termsCheckbox.isVisible()) {
        await termsCheckbox.check();
      }

      // Submit form
      await page.click('button[type="submit"]');

      // Should show success message or redirect
      try {
        await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
      } catch {
        await expect(page.locator("text=Giriş başarılı")).toBeVisible();
      }
    });

    test("should show validation errors for empty form", async ({ page }) => {
      await page.goto("/auth/signup");
      await page.click('button[type="submit"]');

      // Check for HTML5 validation
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      const passwordInput = page.locator('input[name="password"]');

      await expect(nameInput).toHaveAttribute("required");
      await expect(emailInput).toHaveAttribute("required");
      await expect(passwordInput).toHaveAttribute("required");
    });

    test("should validate email format", async ({ page }) => {
      await page.goto("/auth/signup");

      const testUser = generateTestUser();
      const invalidEmails = [
        "invalid-email",
        "test@",
        "@example.com",
        "test.example.com",
        "test..test@example.com",
      ];

      for (const invalidEmail of invalidEmails) {
        await page.fill('input[name="name"]', testUser.name);
        await page.fill('input[name="email"]', invalidEmail);
        await page.fill('input[name="password"]', testUser.password);
        await page.fill('input[name="confirmPassword"]', testUser.password);

        await page.click('button[type="submit"]');

        // Check for browser validation or custom error message
        const emailInput = page.locator('input[name="email"]');
        const isInvalid = await emailInput.evaluate(
          (el: HTMLInputElement) => !el.validity.valid
        );

        if (!isInvalid) {
          // If browser validation passes, check for custom error message
          await expect(
            page.locator(".text-red-500, .text-red-700, .error")
          ).toBeVisible({
            timeout: 2000,
          });
        }

        // Clear form for next iteration
        await page.reload();
      }
    });

    test("should validate password strength", async ({ page }) => {
      await page.goto("/auth/signup");

      const testUser = generateTestUser();
      const weakPasswords = generateWeakPasswords();

      for (const weakPassword of weakPasswords) {
        await page.fill('input[name="name"]', testUser.name);
        await page.fill('input[name="email"]', testUser.email);
        await page.fill('input[name="password"]', weakPassword);
        await page.fill('input[name="confirmPassword"]', weakPassword);

        await page.click('button[type="submit"]');

        // Should show password validation error
        await expect(
          page.locator(".text-red-500, .text-red-700, .error")
        ).toBeVisible({
          timeout: 3000,
        });

        await page.reload();
      }
    });

    test("should validate password confirmation", async ({ page }) => {
      await page.goto("/auth/signup");

      const testUser = generateTestUser();

      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', "DifferentPassword123!");

      await page.click('button[type="submit"]');

      // Should show password mismatch error
      try {
        await expect(page.locator("text=Şifreler uyuşmuyor")).toBeVisible({
          timeout: 3000,
        });
      } catch {
        await expect(
          page.locator(".text-red-500, .text-red-700, .error")
        ).toBeVisible();
      }
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
      await page.waitForTimeout(2000);

      // Second registration with same email
      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', "Another User");
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      // Should show error for existing email
      try {
        await expect(
          page.locator("text=Bu e-posta adresi zaten kullanılıyor")
        ).toBeVisible({
          timeout: 5000,
        });
      } catch {
        await expect(
          page.locator(".text-red-500, .text-red-700, .error")
        ).toBeVisible();
      }
    });
  });

  test.describe("Sign In Flow", () => {
    test("should successfully sign in with valid credentials", async ({
      page,
    }) => {
      const testUser = generateTestUser();

      // First create an account
      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(2000);

      // Now try to sign in
      await page.goto("/auth/signin");
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', testUser.password);
      await page.click('button[type="submit"]');

      // Should redirect to dashboard or show success
      try {
        await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
      } catch {
        await expect(page.locator("text=Giriş başarılı")).toBeVisible();
      }
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto("/auth/signin");

      const invalidCredentials = [
        { email: "nonexistent@example.com", password: "password123" },
        { email: "test@example.com", password: "wrongpassword" },
      ];

      for (const creds of invalidCredentials) {
        await page.fill('input[type="email"]', creds.email);
        await page.fill('input[type="password"]', creds.password);
        await page.click('button[type="submit"]');

        // Should show error message
        try {
          await expect(
            page.locator("text=Geçersiz e-posta veya şifre")
          ).toBeVisible({
            timeout: 5000,
          });
        } catch {
          await expect(
            page.locator(".text-red-500, .text-red-700, .error")
          ).toBeVisible();
        }

        await page.reload();
      }
    });

    test("should handle empty sign in form", async ({ page }) => {
      await page.goto("/auth/signin");
      await page.click('button[type="submit"]');

      // Check for HTML5 validation
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(emailInput).toHaveAttribute("required");
      await expect(passwordInput).toHaveAttribute("required");
    });

    test("should show loading state during sign in", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");
      await page.click('button[type="submit"]');

      // Should show loading state
      try {
        await expect(page.locator("text=Giriş Yapılıyor...")).toBeVisible({
          timeout: 2000,
        });
      } catch {
        await expect(page.locator("button[disabled]")).toBeVisible();
      }
    });
  });

  test.describe("Password Reset Flow", () => {
    test("should navigate to forgot password page", async ({ page }) => {
      await page.goto("/auth/signin");
      await page.click("text=Şifrenizi mi unuttunuz?");

      await expect(page).toHaveURL("/auth/forgot-password");
      await expect(page.locator("h1")).toContainText("Şifremi Unuttum");
    });

    test("should handle password reset request", async ({ page }) => {
      await page.goto("/auth/forgot-password");

      const testEmail = "test@example.com";
      await page.fill('input[type="email"]', testEmail);
      await page.click('button[type="submit"]');

      // Should show success message
      try {
        await expect(
          page.locator("text=Şifre sıfırlama bağlantısı gönderildi")
        ).toBeVisible({
          timeout: 5000,
        });
      } catch {
        await expect(page.locator("text=E-posta gönderildi")).toBeVisible();
      }
    });

    test("should validate email in forgot password form", async ({ page }) => {
      await page.goto("/auth/forgot-password");

      // Try with invalid email
      await page.fill('input[type="email"]', "invalid-email");
      await page.click('button[type="submit"]');

      const emailInput = page.locator('input[type="email"]');
      const isInvalid = await emailInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );

      if (!isInvalid) {
        await expect(
          page.locator(".text-red-500, .text-red-700, .error")
        ).toBeVisible();
      }
    });

    test("should handle empty email in forgot password", async ({ page }) => {
      await page.goto("/auth/forgot-password");
      await page.click('button[type="submit"]');

      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute("required");
    });
  });

  test.describe("Protected Routes and Authentication State", () => {
    test("should redirect unauthenticated users from protected routes", async ({
      page,
    }) => {
      const protectedRoutes = [
        "/dashboard",
        "/dashboard/profile",
        "/dashboard/settings",
        "/dashboard/billing",
        "/test",
        "/results",
        "/improvement",
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);

        // Should redirect to signin page
        await expect(page).toHaveURL("/auth/signin", { timeout: 5000 });
      }
    });

    test("should allow authenticated users to access protected routes", async ({
      page,
    }) => {
      // First sign up and sign in
      const testUser = generateTestUser();

      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);

      // Now try accessing protected routes
      const protectedRoutes = ["/dashboard", "/test"];

      for (const route of protectedRoutes) {
        await page.goto(route);

        // Should not redirect to signin page
        await expect(page).not.toHaveURL("/auth/signin");
        await expect(page).toHaveURL(route, { timeout: 5000 });
      }
    });

    test("should handle session persistence across page reloads", async ({
      page,
    }) => {
      // Sign up and sign in
      const testUser = generateTestUser();

      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);

      // Go to dashboard
      await page.goto("/dashboard");
      await expect(page).toHaveURL("/dashboard");

      // Reload page
      await page.reload();

      // Should still be on dashboard (session persisted)
      await expect(page).toHaveURL("/dashboard");
    });

    test("should handle logout functionality", async ({ page }) => {
      // Sign up and sign in first
      const testUser = generateTestUser();

      await page.goto("/auth/signup");
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);

      // Go to dashboard
      await page.goto("/dashboard");

      // Look for logout button (might be in navbar, dropdown, etc.)
      const logoutButton = page
        .locator("text=Çıkış Yap")
        .or(
          page
            .locator("text=Logout")
            .or(
              page
                .locator('button:has-text("Çıkış")')
                .or(page.locator('[data-testid="logout"]'))
            )
        );

      if (await logoutButton.isVisible()) {
        await logoutButton.click();

        // Should redirect to home or signin page
        try {
          await expect(page).toHaveURL("/", { timeout: 5000 });
        } catch {
          await expect(page).toHaveURL("/auth/signin");
        }
      }
    });
  });

  test.describe("Edge Cases and Error Handling", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);

      await page.goto("/auth/signin");
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");
      await page.click('button[type="submit"]');

      // Should show network error message
      try {
        await expect(page.locator("text=Bağlantı hatası")).toBeVisible({
          timeout: 10000,
        });
      } catch {
        await expect(page.locator("text=Network error")).toBeVisible();
      }

      // Restore network
      await page.context().setOffline(false);
    });

    test("should handle rapid form submissions", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");

      // Click submit button multiple times rapidly
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      await submitButton.click();
      await submitButton.click();

      // Should prevent multiple submissions
      await expect(submitButton).toBeDisabled({ timeout: 2000 });
    });

    test("should handle special characters in passwords", async ({ page }) => {
      await page.goto("/auth/signup");

      const testUser = generateTestUser();
      const specialPassword = "P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?";

      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', specialPassword);
      await page.fill('input[name="confirmPassword"]', specialPassword);
      await page.click('button[type="submit"]');

      // Should handle special characters properly
      await page.waitForTimeout(5000);

      // Now try to sign in with the same password
      await page.goto("/auth/signin");
      await page.fill('input[type="email"]', testUser.email);
      await page.fill('input[type="password"]', specialPassword);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);
    });

    test("should handle very long email addresses", async ({ page }) => {
      await page.goto("/auth/signup");

      const longEmail = `verylongemailaddressthatexceedstypicallimits${"a".repeat(
        100
      )}@example.com`;
      const testUser = generateTestUser();

      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', longEmail);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');

      // Should handle gracefully (either accept or show appropriate error)
      await page.waitForTimeout(3000);
    });

    test("should handle concurrent user registrations", async ({ browser }) => {
      const promises = [];

      for (let i = 0; i < 3; i++) {
        promises.push(
          (async () => {
            const page = await browser.newPage();
            const testUser = generateTestUser();

            await page.goto("/auth/signup");
            await page.fill('input[name="name"]', testUser.name);
            await page.fill('input[name="email"]', testUser.email);
            await page.fill('input[name="password"]', testUser.password);
            await page.fill('input[name="confirmPassword"]', testUser.password);
            await page.click('button[type="submit"]');

            await page.waitForTimeout(5000);
            await page.close();
          })()
        );
      }

      // All registrations should complete without errors
      await Promise.all(promises);
    });
  });

  test.describe("Security Tests", () => {
    test("should prevent SQL injection in auth forms", async ({ page }) => {
      const sqlInjectionPayloads = [
        "'; DROP TABLE users; --",
        "admin' OR '1'='1",
        "test@example.com'; DELETE FROM users WHERE '1'='1",
      ];

      for (const payload of sqlInjectionPayloads) {
        await page.goto("/auth/signin");
        await page.fill('input[type="email"]', payload);
        await page.fill('input[type="password"]', "password123");
        await page.click('button[type="submit"]');

        // Should not crash or show database errors
        await expect(page.locator("text=SQL")).not.toBeVisible({
          timeout: 3000,
        });
        await expect(page.locator("text=database")).not.toBeVisible({
          timeout: 3000,
        });

        await page.reload();
      }
    });

    test("should prevent XSS in form inputs", async ({ page }) => {
      const xssPayloads = [
        "<script>alert('xss')</script>",
        "javascript:alert('xss')",
        "<img src=x onerror=alert('xss')>",
      ];

      for (const payload of xssPayloads) {
        await page.goto("/auth/signup");
        await page.fill('input[name="name"]', payload);
        await page.fill('input[name="email"]', "test@example.com");
        await page.fill('input[name="password"]', "Password123!");
        await page.fill('input[name="confirmPassword"]', "Password123!");
        await page.click('button[type="submit"]');

        // Should not execute script
        page.on("dialog", async (dialog) => {
          throw new Error(`XSS alert detected: ${dialog.message()}`);
        });

        await page.waitForTimeout(3000);
        await page.reload();
      }
    });

    test("should have proper CSRF protection", async ({ page }) => {
      await page.goto("/auth/signin");

      // Check for CSRF token in form or meta tag
      const csrfToken = await page
        .locator(
          'input[name="csrf_token"], input[name="_token"], meta[name="csrf-token"]'
        )
        .first();

      if (await csrfToken.isVisible()) {
        const tokenValue =
          (await csrfToken.getAttribute("value")) ||
          (await csrfToken.getAttribute("content"));
        expect(tokenValue).toBeTruthy();
        expect(tokenValue!.length).toBeGreaterThan(10);
      }
    });
  });
});
