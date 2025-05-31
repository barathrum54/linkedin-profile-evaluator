# Test info

- Name: Authentication Flow >> should navigate to sign up page
- Location: /Users/minted_tr/Desktop/linkedin-profile-evaluator/e2e/auth.spec.ts:9:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Ücretsiz Başlayın')

    at /Users/minted_tr/Desktop/linkedin-profile-evaluator/e2e/auth.spec.ts:10:16
```

# Page snapshot

```yaml
- img
- heading "LinkedIn Profil Değerlendirici" [level=1]
- paragraph: LinkedIn profilinizin ne kadar etkili olduğunu öğrenin ve kişiselleştirilmiş önerilerle profilinizi geliştirin.
- img
- heading "Hızlı Analiz" [level=3]
- paragraph: 12 kritik alanda profilinizi değerlendirin
- img
- heading "Kişisel Öneriler" [level=3]
- paragraph: Puanınıza özel iyileştirme tavsiyeleri
- img
- heading "Detaylı Rapor" [level=3]
- paragraph: Her alan için özel analiz ve çözümler
- button "Başla"
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from "@playwright/test";
   2 |
   3 | test.describe("Authentication Flow", () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Start from the home page
   6 |     await page.goto("/");
   7 |   });
   8 |
   9 |   test("should navigate to sign up page", async ({ page }) => {
>  10 |     await page.click("text=Ücretsiz Başlayın");
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
   11 |     await expect(page).toHaveURL("/auth/signup");
   12 |     await expect(page.locator("h1")).toContainText("Hesap Oluşturun");
   13 |   });
   14 |
   15 |   test("should navigate to sign in page", async ({ page }) => {
   16 |     await page.goto("/auth/signin");
   17 |     await expect(page.locator("h1")).toContainText("Hesabınıza Giriş Yapın");
   18 |   });
   19 |
   20 |   test("should show validation errors for empty sign up form", async ({
   21 |     page,
   22 |   }) => {
   23 |     await page.goto("/auth/signup");
   24 |
   25 |     // Try to submit empty form
   26 |     await page.click('button[type="submit"]');
   27 |
   28 |     // Check for required attribute validation
   29 |     const nameInput = page.locator('input[name="name"]');
   30 |     const emailInput = page.locator('input[name="email"]');
   31 |     const passwordInput = page.locator('input[name="password"]');
   32 |
   33 |     await expect(nameInput).toHaveAttribute("required");
   34 |     await expect(emailInput).toHaveAttribute("required");
   35 |     await expect(passwordInput).toHaveAttribute("required");
   36 |   });
   37 |
   38 |   test("should show validation errors for invalid email", async ({ page }) => {
   39 |     await page.goto("/auth/signup");
   40 |
   41 |     // Fill form with invalid email
   42 |     await page.fill('input[name="name"]', "Test User");
   43 |     await page.fill('input[name="email"]', "invalid-email");
   44 |     await page.fill('input[name="password"]', "Password123!");
   45 |
   46 |     await page.click('button[type="submit"]');
   47 |
   48 |     // Check for email type validation
   49 |     const emailInput = page.locator('input[name="email"]');
   50 |     await expect(emailInput).toHaveAttribute("type", "email");
   51 |   });
   52 |
   53 |   test("should show error for weak password", async ({ page }) => {
   54 |     await page.goto("/auth/signup");
   55 |
   56 |     // Fill form with weak password
   57 |     await page.fill('input[name="name"]', "Test User");
   58 |     await page.fill('input[name="email"]', "test@example.com");
   59 |     await page.fill('input[name="password"]', "123");
   60 |
   61 |     await page.click('button[type="submit"]');
   62 |
   63 |     // Should show custom validation error
   64 |     await expect(page.locator(".text-red-700")).toBeVisible();
   65 |   });
   66 |
   67 |   test("should navigate between auth pages", async ({ page }) => {
   68 |     // Start at sign up page
   69 |     await page.goto("/auth/signup");
   70 |     await expect(page.locator("h1")).toContainText("Hesap Oluşturun");
   71 |
   72 |     // Navigate to sign in
   73 |     await page.click("text=Giriş Yapın");
   74 |     await expect(page).toHaveURL("/auth/signin");
   75 |     await expect(page.locator("h1")).toContainText("Hesabınıza Giriş Yapın");
   76 |
   77 |     // Navigate back to sign up
   78 |     await page.click("text=Hesap Oluşturun");
   79 |     await expect(page).toHaveURL("/auth/signup");
   80 |   });
   81 |
   82 |   test("should navigate to forgot password page", async ({ page }) => {
   83 |     await page.goto("/auth/signin");
   84 |
   85 |     await page.click("text=Şifrenizi mi unuttunuz?");
   86 |     await expect(page).toHaveURL("/auth/forgot-password");
   87 |     await expect(page.locator("h1")).toContainText("Şifre Sıfırlama");
   88 |   });
   89 |
   90 |   test("should show OAuth provider buttons", async ({ page }) => {
   91 |     await page.goto("/auth/signin");
   92 |
   93 |     // Check for OAuth provider buttons
   94 |     await expect(page.locator("text=LinkedIn ile Giriş Yap")).toBeVisible();
   95 |     await expect(page.locator("text=Google ile Giriş Yap")).toBeVisible();
   96 |     await expect(page.locator("text=GitHub ile Giriş Yap")).toBeVisible();
   97 |   });
   98 |
   99 |   test("should handle sign in form submission", async ({ page }) => {
  100 |     await page.goto("/auth/signin");
  101 |
  102 |     // Fill sign in form
  103 |     await page.fill('input[type="email"]', "test@example.com");
  104 |     await page.fill('input[type="password"]', "password123");
  105 |
  106 |     // Submit form
  107 |     await page.click('button[type="submit"]');
  108 |
  109 |     // Should show loading state or error message
  110 |     await expect(page.locator("text=Giriş Yapılıyor...")).toBeVisible({
```