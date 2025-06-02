import { test, expect } from "@playwright/test";

test.describe("Basic Authentication Tests", () => {
  test("should load signin page correctly", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator("h1")).toContainText("Hesabınıza Giriş Yapın");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should load signup page correctly", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.locator("h1")).toContainText("Hesap Oluşturun");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should display OAuth buttons with correct text", async ({ page }) => {
    await page.goto("/auth/signin");

    // Check signin page OAuth buttons
    await expect(page.locator("text=LinkedIn ile Giriş Yap")).toBeVisible();
    await expect(page.locator("text=Google ile Giriş Yap")).toBeVisible();
    await expect(page.locator("text=GitHub ile Giriş Yap")).toBeVisible();

    // Check signup page OAuth buttons
    await page.goto("/auth/signup");
    await expect(page.locator("text=LinkedIn ile Hesap Oluştur")).toBeVisible();
    await expect(page.locator("text=Google ile Hesap Oluştur")).toBeVisible();
    await expect(page.locator("text=GitHub ile Hesap Oluştur")).toBeVisible();
  });

  test("should navigate between auth pages", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.click("text=Hesap Oluşturun");
    await expect(page).toHaveURL("/auth/signup");

    await page.click("text=Giriş Yapın");
    await expect(page).toHaveURL("/auth/signin");
  });

  test("should show validation for empty form submission", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.click('button[type="submit"]');

    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute("required");
  });

  test("should handle basic form submission", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should show some loading state or error
    await page.waitForTimeout(2000);
  });
});
