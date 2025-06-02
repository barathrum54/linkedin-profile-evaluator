import { test, expect } from "@playwright/test";

test.describe("Essential Authentication Tests", () => {
  test.describe("Basic Page Loading", () => {
    test("should load signup page", async ({ page }) => {
      await page.goto("/auth/signup");
      await expect(page.locator("h1")).toContainText("Hesap Oluşturun");
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    });

    test("should load signin page", async ({ page }) => {
      await page.goto("/auth/signin");
      await expect(page.locator("h1")).toContainText("Hesabınıza Giriş Yapın");
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test("should load forgot password page", async ({ page }) => {
      await page.goto("/auth/forgot-password");
      await expect(page.locator("h1")).toContainText("Şifremi Unuttum");
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test("should navigate between auth pages", async ({ page }) => {
      await page.goto("/auth/signin");
      await page.click("text=Hesap Oluşturun");
      await expect(page).toHaveURL("/auth/signup");

      await page.click("text=Giriş Yapın");
      await expect(page).toHaveURL("/auth/signin");
    });

    test("should navigate to forgot password", async ({ page }) => {
      await page.goto("/auth/signin");
      await page.click("text=Şifrenizi mi unuttunuz?");
      await expect(page).toHaveURL("/auth/forgot-password");
    });

    test("should navigate from homepage to test", async ({ page }) => {
      await page.goto("/");
      await page.click("text=Başla");
      await expect(page).toHaveURL("/test");
    });
  });

  test.describe("OAuth Buttons", () => {
    test("should show OAuth buttons on signin", async ({ page }) => {
      await page.goto("/auth/signin");
      await expect(page.locator("text=LinkedIn ile Giriş Yap")).toBeVisible();
      await expect(page.locator("text=Google ile Giriş Yap")).toBeVisible();
      await expect(page.locator("text=GitHub ile Giriş Yap")).toBeVisible();
    });

    test("should show OAuth buttons on signup", async ({ page }) => {
      await page.goto("/auth/signup");
      await expect(
        page.locator("text=LinkedIn ile Hesap Oluştur")
      ).toBeVisible();
      await expect(page.locator("text=Google ile Hesap Oluştur")).toBeVisible();
      await expect(page.locator("text=GitHub ile Hesap Oluştur")).toBeVisible();
    });
  });

  test.describe("Basic Form Validation", () => {
    test("should have required attributes on form fields", async ({ page }) => {
      await page.goto("/auth/signup");

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
    });

    test("should have email type on email fields", async ({ page }) => {
      await page.goto("/auth/signin");
      await expect(page.locator('input[type="email"]')).toHaveAttribute(
        "type",
        "email"
      );

      await page.goto("/auth/signup");
      await expect(page.locator('input[name="email"]')).toHaveAttribute(
        "type",
        "email"
      );
    });
  });

  test.describe("Basic Form Input", () => {
    test("should accept basic form input on signup", async ({ page }) => {
      await page.goto("/auth/signup");

      await page.fill('input[name="name"]', "Test User");
      await page.fill('input[name="email"]', "test@example.com");
      await page.fill('input[name="password"]', "testpassword");
      await page.fill('input[name="confirmPassword"]', "testpassword");

      // Check that values were filled
      await expect(page.locator('input[name="name"]')).toHaveValue("Test User");
      await expect(page.locator('input[name="email"]')).toHaveValue(
        "test@example.com"
      );
    });

    test("should accept basic form input on signin", async ({ page }) => {
      await page.goto("/auth/signin");

      // Wait for the form to be fully loaded
      await page.waitForSelector('input[type="email"]', { state: "visible" });
      await page.waitForSelector('input[type="password"]', {
        state: "visible",
      });

      // Fill the form fields with small delays for webkit compatibility
      await page.fill('input[type="email"]', "test@example.com");
      await page.waitForTimeout(100);
      await page.fill('input[type="password"]', "password123");
      await page.waitForTimeout(100);

      // Use more reliable assertions that work across browsers
      const emailValue = await page.locator('input[type="email"]').inputValue();
      const passwordValue = await page
        .locator('input[type="password"]')
        .inputValue();

      expect(emailValue).toBe("test@example.com");
      expect(passwordValue).toBe("password123");
    });
  });
});
