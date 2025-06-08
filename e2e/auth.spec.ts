import { test, expect } from '@playwright/test';

test.describe('Essential Authentication Tests', () => {
  test.describe('Page Loading', () => {
    test('should load signup page with all required elements', async ({
      page,
    }) => {
      await page.goto('/auth/signup');
      await expect(page.locator('h1')).toContainText('Hesap Oluşturun');
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should load signin page with all required elements', async ({
      page,
    }) => {
      await page.goto('/auth/signin');
      await expect(page.locator('h1')).toContainText('Hesabınıza Giriş Yapın');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should load forgot password page', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      await expect(page.locator('h1')).toContainText('Şifremi Unuttum');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate between auth pages', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.click('text=Hesap Oluşturun');
      await expect(page).toHaveURL('/auth/signup');

      await page.click('text=Giriş Yapın');
      await expect(page).toHaveURL('/auth/signin');
    });

    test('should navigate to forgot password from signin', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.click('text=Şifrenizi mi unuttunuz?');
      await expect(page).toHaveURL('/auth/forgot-password');
    });

    test('should navigate from homepage to test page', async ({ page }) => {
      await page.goto('/');
      await page.click('text=Başla');
      await expect(page).toHaveURL('/test');
    });
  });

  test.describe('OAuth Integration', () => {
    test('should display OAuth buttons on signin page', async ({ page }) => {
      await page.goto('/auth/signin');
      await expect(page.locator('text=LinkedIn ile Giriş Yap')).toBeVisible();
      await expect(page.locator('text=Google ile Giriş Yap')).toBeVisible();
      await expect(page.locator('text=GitHub ile Giriş Yap')).toBeVisible();
    });

    test('should display OAuth buttons on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      await expect(
        page.locator('text=LinkedIn ile Hesap Oluştur')
      ).toBeVisible();
      await expect(page.locator('text=Google ile Hesap Oluştur')).toBeVisible();
      await expect(page.locator('text=GitHub ile Hesap Oluştur')).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should have required attributes on signup form fields', async ({
      page,
    }) => {
      await page.goto('/auth/signup');

      await expect(page.locator('input[name="name"]')).toHaveAttribute(
        'required'
      );
      await expect(page.locator('input[name="email"]')).toHaveAttribute(
        'required'
      );
      await expect(page.locator('input[name="password"]')).toHaveAttribute(
        'required'
      );
      await expect(
        page.locator('input[name="confirmPassword"]')
      ).toHaveAttribute('required');
    });

    test('should have proper input types', async ({ page }) => {
      await page.goto('/auth/signin');
      await expect(page.locator('input[type="email"]')).toHaveAttribute(
        'type',
        'email'
      );

      await page.goto('/auth/signup');
      await expect(page.locator('input[name="email"]')).toHaveAttribute(
        'type',
        'email'
      );
      await expect(page.locator('input[name="password"]')).toHaveAttribute(
        'type',
        'password'
      );
    });

    test('should prevent empty form submission', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.click('button[type="submit"]');

      // HTML5 validation should prevent submission
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute('required');
    });
  });

  test.describe('Form Input Handling', () => {
    test('should accept input on signup form', async ({ page }) => {
      await page.goto('/auth/signup');

      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'SecurePassword123!');
      await page.fill('input[name="confirmPassword"]', 'SecurePassword123!');

      // Verify values were filled correctly
      await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
      await expect(page.locator('input[name="email"]')).toHaveValue(
        'test@example.com'
      );
    });

    test('should accept input on signin form', async ({ page }) => {
      await page.goto('/auth/signin');

      // Wait for form to be fully loaded
      await page.waitForSelector('input[type="email"]', { state: 'visible' });
      await page.waitForSelector('input[type="password"]', {
        state: 'visible',
      });

      // Fill form fields with small delays for browser compatibility
      await page.fill('input[type="email"]', 'test@example.com');
      await page.waitForTimeout(100);
      await page.fill('input[type="password"]', 'password123');
      await page.waitForTimeout(100);

      // Verify input values
      const emailValue = await page.locator('input[type="email"]').inputValue();
      const passwordValue = await page
        .locator('input[type="password"]')
        .inputValue();

      expect(emailValue).toBe('test@example.com');
      expect(passwordValue).toBe('password123');
    });

    test('should handle form submission without errors', async ({ page }) => {
      await page.goto('/auth/signin');

      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');

      // Submit form and wait for response
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Form should not have crashed or thrown errors
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

      await page.goto('/auth/signin');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();

      // Check OAuth buttons are also visible on mobile
      await expect(page.locator('text=LinkedIn ile Giriş Yap')).toBeVisible();
    });
  });
});
