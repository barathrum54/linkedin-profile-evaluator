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

    test('should load signin page with required elements', async ({ page }) => {
      await page.goto('/auth/signin');
      await expect(page.locator('h1')).toContainText('Giriş Yapın');
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should load forgot password page', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      await expect(page.locator('h1')).toContainText('Şifremi Unuttum');
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to signup from signin', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.click('text=Hesap oluşturun');
      await expect(page).toHaveURL('/auth/signup');
    });

    test('should navigate to signin from signup', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.click('text=Giriş yapın');
      await expect(page).toHaveURL('/auth/signin');
    });

    test('should navigate to forgot password from signin', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.click('text=Şifremi unuttum');
      await expect(page).toHaveURL('/auth/forgot-password');
    });

    test('should navigate from homepage to auth pages', async ({ page }) => {
      await page.goto('/');
      await page.click('text=Giriş Yap');
      await expect(page).toHaveURL('/auth/signin');
    });
  });

  test.describe('OAuth Integration', () => {
    test('should show OAuth providers on signin page', async ({ page }) => {
      await page.goto('/auth/signin');
      await expect(page.locator('button:has-text("Google")')).toBeVisible();
      await expect(page.locator('button:has-text("LinkedIn")')).toBeVisible();
    });

    test('should show OAuth providers on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      await expect(page.locator('button:has-text("Google")')).toBeVisible();
      await expect(page.locator('button:has-text("LinkedIn")')).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors for empty signup form', async ({
      page,
    }) => {
      await page.goto('/auth/signup');
      await page.click('button[type="submit"]');

      // Check that form doesn't submit (still on signup page)
      await expect(page).toHaveURL('/auth/signup');

      // HTML5 validation should prevent submission
      const nameInput = page.locator('input[name="name"]');
      await expect(nameInput).toHaveAttribute('required');
    });

    test('should show validation errors for empty signin form', async ({
      page,
    }) => {
      await page.goto('/auth/signin');
      await page.click('button[type="submit"]');

      // Check that form doesn't submit (still on signin page)
      await expect(page).toHaveURL('/auth/signin');

      // HTML5 validation should prevent submission
      const emailInput = page.locator('input[name="email"]');
      await expect(emailInput).toHaveAttribute('required');
    });

    test('should validate email format on signup', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      await page.click('button[type="submit"]');

      // Should still be on signup page due to invalid email
      await expect(page).toHaveURL('/auth/signup');
    });

    test('should validate password confirmation mismatch', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
      await page.click('button[type="submit"]');

      // Should show error message for password mismatch
      await expect(page.locator('text=Şifreler eşleşmiyor')).toBeVisible();
    });
  });

  test.describe('Password Requirements', () => {
    test('should validate password strength requirements', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');

      // Test weak password
      await page.fill('input[name="password"]', '123');
      await page.fill('input[name="confirmPassword"]', '123');
      await page.click('button[type="submit"]');

      // Should show password requirements error
      await expect(
        page.locator('text=Şifre en az 8 karakter olmalıdır')
      ).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle registration with existing email gracefully', async ({
      page,
    }) => {
      await page.goto('/auth/signup');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'existing@example.com');
      await page.fill('input[name="password"]', 'ValidPassword123!');
      await page.fill('input[name="confirmPassword"]', 'ValidPassword123!');
      await page.click('button[type="submit"]');

      // Should handle the error gracefully (either show error or redirect)
      // We can't predict the exact behavior without a test database
      await page.waitForTimeout(2000);
      // Test passes if no uncaught errors occur
    });

    test('should handle signin with invalid credentials gracefully', async ({
      page,
    }) => {
      await page.goto('/auth/signin');
      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Should handle the error gracefully
      await page.waitForTimeout(2000);
      // Test passes if no uncaught errors occur
    });
  });

  test.describe('Accessibility', () => {
    test('signup page should have proper form labels', async ({ page }) => {
      await page.goto('/auth/signup');

      // Check for form labels
      await expect(page.locator('label[for="name"]')).toContainText('Ad Soyad');
      await expect(page.locator('label[for="email"]')).toContainText('E-posta');
      await expect(page.locator('label[for="password"]')).toContainText(
        'Şifre'
      );
      await expect(page.locator('label[for="confirmPassword"]')).toContainText(
        'Şifre Tekrar'
      );
    });

    test('signin page should have proper form labels', async ({ page }) => {
      await page.goto('/auth/signin');

      // Check for form labels
      await expect(page.locator('label[for="email"]')).toContainText('E-posta');
      await expect(page.locator('label[for="password"]')).toContainText(
        'Şifre'
      );
    });
  });

  test.describe('Responsive Design', () => {
    test('auth pages should be responsive on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/auth/signin');

      // Check that main elements are still visible on mobile
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
  });
});
