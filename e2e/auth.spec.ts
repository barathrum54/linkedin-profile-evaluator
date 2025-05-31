import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto("/");
  });

  test("should navigate to sign up page", async ({ page }) => {
    await page.click("text=Ücretsiz Başlayın");
    await expect(page).toHaveURL("/auth/signup");
    await expect(page.locator("h1")).toContainText("Hesap Oluşturun");
  });

  test("should navigate to sign in page", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator("h1")).toContainText("Hesabınıza Giriş Yapın");
  });

  test("should show validation errors for empty sign up form", async ({
    page,
  }) => {
    await page.goto("/auth/signup");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for required attribute validation
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(nameInput).toHaveAttribute("required");
    await expect(emailInput).toHaveAttribute("required");
    await expect(passwordInput).toHaveAttribute("required");
  });

  test("should show validation errors for invalid email", async ({ page }) => {
    await page.goto("/auth/signup");

    // Fill form with invalid email
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "Password123!");

    await page.click('button[type="submit"]');

    // Check for email type validation
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute("type", "email");
  });

  test("should show error for weak password", async ({ page }) => {
    await page.goto("/auth/signup");

    // Fill form with weak password
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "123");

    await page.click('button[type="submit"]');

    // Should show custom validation error
    await expect(page.locator(".text-red-700")).toBeVisible();
  });

  test("should navigate between auth pages", async ({ page }) => {
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
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.click("text=Şifrenizi mi unuttunuz?");
    await expect(page).toHaveURL("/auth/forgot-password");
    await expect(page.locator("h1")).toContainText("Şifre Sıfırlama");
  });

  test("should show OAuth provider buttons", async ({ page }) => {
    await page.goto("/auth/signin");

    // Check for OAuth provider buttons
    await expect(page.locator("text=LinkedIn ile Giriş Yap")).toBeVisible();
    await expect(page.locator("text=Google ile Giriş Yap")).toBeVisible();
    await expect(page.locator("text=GitHub ile Giriş Yap")).toBeVisible();
  });

  test("should handle sign in form submission", async ({ page }) => {
    await page.goto("/auth/signin");

    // Fill sign in form
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");

    // Submit form
    await page.click('button[type="submit"]');

    // Should show loading state or error message
    await expect(page.locator("text=Giriş Yapılıyor...")).toBeVisible({
      timeout: 5000,
    });
  });
});
