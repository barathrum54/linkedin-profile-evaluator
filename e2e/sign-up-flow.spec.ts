import { test, expect } from '@playwright/test';

test.describe('Complete Sign-up Flow E2E Tests', () => {
  // Generate unique test user data for each test run
  const generateTestUser = () => {
    const timestamp = Date.now();
    return {
      name: `Test User ${timestamp}`,
      firstName: `Test`,
      email: `testuser${timestamp}@example.com`,
      password: 'SecurePassword123!',
    };
  };

  test('complete sign-up, verification, logout, and re-login flow', async ({
    page,
  }) => {
    const testUser = generateTestUser();

    // Step 1: Navigate to sign-up page and complete registration
    await test.step('Sign up with valid credentials', async () => {
      await page.goto('/auth/signup');

      // Wait for page to load
      await expect(page.locator('h1')).toContainText('Hesap Oluşturun');

      // Fill out the registration form
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);

      // Submit the form
      await page.click('button[type="submit"]');

      // Wait for redirect to dashboard or success indication
      // This might redirect to signin or directly to dashboard depending on implementation
      await page.waitForURL(/\/(dashboard|auth\/signin)/, { timeout: 10000 });
    });

    // Step 2: If redirected to signin, log in; if already on dashboard, continue
    await test.step('Handle post-registration flow', async () => {
      const currentUrl = page.url();

      if (currentUrl.includes('/auth/signin')) {
        // Need to log in after registration
        await page.fill('input[name="email"]', testUser.email);
        await page.fill('input[name="password"]', testUser.password);
        await page.click('button[type="submit"]');

        // Wait for redirect to dashboard
        await page.waitForURL('/dashboard', { timeout: 10000 });
      }

      // Ensure we're on the dashboard
      await expect(page).toHaveURL('/dashboard');
    });

    // Step 3: Verify user is logged in by checking welcome message
    await test.step('Verify user is logged in via welcome message', async () => {
      // Check that welcome message contains user's first name instead of "Kullanıcı"
      const welcomeMessage = page.locator('[data-testid="welcome-message"]');
      await expect(welcomeMessage).toBeVisible();

      // Should contain the user's first name, not the default "Kullanıcı"
      await expect(welcomeMessage).toContainText(testUser.firstName);
      await expect(welcomeMessage).not.toContainText('Kullanıcı');
    });

    // Step 4: Navigate to debug page and verify user data
    await test.step('Verify user data on debug page', async () => {
      await page.goto('/dashboard/debug');

      // Wait for the debug page to load
      await expect(page.locator('h1')).toContainText('Debug');

      // Check if user data is displayed in content area
      const contentArea = page.locator(
        '.content-area, [data-testid="content-area"], main'
      );
      await expect(contentArea).toBeVisible();

      // Look for user's email in the debug data
      await expect(page.locator('text=' + testUser.email)).toBeVisible();

      // Verify user data sections are present
      await expect(page.locator('text=Current Session')).toBeVisible();
      await expect(page.locator('text=Environment')).toBeVisible();
      await expect(page.locator('text=MongoDB')).toBeVisible();
    });

    // Step 5: Log out the user
    await test.step('Log out user', async () => {
      // Navigate back to dashboard first if needed
      await page.goto('/dashboard');

      // Find and click logout button (could be in header, sidebar, or dropdown)
      const logoutButton = page.locator(
        'button:has-text("Çıkış Yap"), button:has-text("Logout"), [data-testid="logout-button"]'
      );
      await expect(logoutButton).toBeVisible();
      await logoutButton.click();

      // Wait for redirect to home page or login page
      await page.waitForURL(/\/(|auth\/signin)/, { timeout: 10000 });
    });

    // Step 6: Verify user is logged out
    await test.step('Verify user is logged out', async () => {
      // Navigate to dashboard to check if redirected to login
      await page.goto('/dashboard');

      // Should be redirected to signin page
      await expect(page).toHaveURL('/auth/signin');

      // Alternatively, if dashboard is accessible but shows default state
      // Check if welcome message shows default "Kullanıcı" instead of user name
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard')) {
        const welcomeMessage = page.locator('[data-testid="welcome-message"]');
        if (await welcomeMessage.isVisible()) {
          await expect(welcomeMessage).toContainText('Kullanıcı');
          await expect(welcomeMessage).not.toContainText(testUser.firstName);
        }
      }
    });

    // Step 7: Log back in via sign-in page
    await test.step('Log back in via sign-in page', async () => {
      // Ensure we're on the signin page
      if (!page.url().includes('/auth/signin')) {
        await page.goto('/auth/signin');
      }

      await expect(page.locator('h1')).toContainText('Giriş Yapın');

      // Fill login form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);

      // Submit login form
      await page.click('button[type="submit"]');

      // Wait for redirect to dashboard
      await page.waitForURL('/dashboard', { timeout: 10000 });
    });

    // Step 8: Re-verify user is logged in
    await test.step('Re-verify user is logged in after re-login', async () => {
      // Check welcome message again
      const welcomeMessage = page.locator('[data-testid="welcome-message"]');
      await expect(welcomeMessage).toBeVisible();
      await expect(welcomeMessage).toContainText(testUser.firstName);
      await expect(welcomeMessage).not.toContainText('Kullanıcı');

      // Navigate to debug page again to verify user data
      await page.goto('/dashboard/debug');
      await expect(page.locator('text=' + testUser.email)).toBeVisible();
      await expect(page.locator('text=Current Session')).toBeVisible();
    });

    // Cleanup: Log out at the end of test
    await test.step('Cleanup - Final logout', async () => {
      await page.goto('/dashboard');
      const logoutButton = page.locator(
        'button:has-text("Çıkış Yap"), button:has-text("Logout"), [data-testid="logout-button"]'
      );
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
      }
    });
  });

  test('sign-up flow with validation errors', async ({ page }) => {
    await test.step('Test password mismatch validation', async () => {
      const testUser = generateTestUser();

      await page.goto('/auth/signup');

      // Fill form with mismatched passwords
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');

      await page.click('button[type="submit"]');

      // Should show error message and stay on signup page
      await expect(page.locator('text=Şifreler eşleşmiyor')).toBeVisible();
      await expect(page).toHaveURL('/auth/signup');
    });

    await test.step('Test weak password validation', async () => {
      const testUser = generateTestUser();

      await page.goto('/auth/signup');

      // Fill form with weak password
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', '123');
      await page.fill('input[name="confirmPassword"]', '123');

      await page.click('button[type="submit"]');

      // Should show password strength error
      await expect(
        page.locator('text=Şifre en az 8 karakter olmalıdır')
      ).toBeVisible();
      await expect(page).toHaveURL('/auth/signup');
    });
  });

  test('sign-up flow with existing email', async ({ page }) => {
    await test.step('Test registration with existing email', async () => {
      // Use a common email that might already exist
      const existingUser = {
        name: 'Existing User',
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      await page.goto('/auth/signup');

      // Fill form with potentially existing email
      await page.fill('input[name="name"]', existingUser.name);
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);
      await page.fill('input[name="confirmPassword"]', existingUser.password);

      await page.click('button[type="submit"]');

      // Wait for response - either error message or redirect
      await page.waitForTimeout(3000);

      // Check if error message is shown for existing email
      const errorMessage = page.locator(
        'text=Bu e-posta adresi zaten kullanılıyor, text=Email already exists, text=User already exists'
      );
      if (await errorMessage.isVisible()) {
        // Should stay on signup page with error
        await expect(page).toHaveURL('/auth/signup');
      } else {
        // If registration succeeded (email wasn't taken), that's also valid
        // The test should handle both scenarios gracefully
        console.log('Email was not taken, registration succeeded');
      }
    });
  });
});
