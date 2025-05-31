# Testing Guide

This document outlines the testing strategy and tools used in the LinkedIn Profile Evaluator project.

## 🧪 Testing Stack

- **Unit & Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Code Coverage**: Jest Coverage Reports
- **TypeScript Support**: @types/jest

## 📁 Test Structure

```
src/
├── components/
│   └── __tests__/          # Component unit tests
├── lib/
│   └── __tests__/          # Utility function tests
├── app/
│   └── api/
│       └── **/__tests__/   # API route tests
e2e/                        # End-to-end tests
├── auth.spec.ts           # Authentication flow tests
└── ...                    # Other E2E test files
```

## 🚀 Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open coverage report in browser (macOS)
npm run test:coverage:open
```

### E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI interface
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed
```

### All Tests

```bash
# Run all tests (unit + E2E)
npm run test:all

# CI-optimized test run with coverage
npm run test:ci
```

## 📊 Code Coverage

Our Jest configuration includes comprehensive code coverage with the following thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Text**: Console output during test runs
- **HTML**: Interactive report in `coverage/lcov-report/index.html`
- **LCOV**: Machine-readable format in `coverage/lcov.info`
- **JSON**: Summary in `coverage/coverage-summary.json`

### Coverage Exclusions

The following files/patterns are excluded from coverage:

- TypeScript declaration files (`*.d.ts`)
- Storybook stories (`*.stories.{js,jsx,ts,tsx}`)
- Layout files (`layout.tsx`)
- Loading components (`loading.tsx`)
- Error pages (`not-found.tsx`)
- Middleware (`middleware.ts`)

## 🧩 Test Categories

### 1. Component Tests

**Purpose**: Test React component behavior, props handling, and user interactions.

**Example**: `src/components/__tests__/Layout.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import Layout from "../Layout";

test("renders children correctly", () => {
  render(
    <Layout navbarProps={{ title: "Test" }}>
      <div data-testid="test-child">Test Child</div>
    </Layout>
  );
  expect(screen.getByTestId("test-child")).toBeInTheDocument();
});
```

### 2. Utility Function Tests

**Purpose**: Test business logic, helper functions, and utility modules.

**Example**: `src/lib/__tests__/auth.test.ts`

```typescript
import { hashPassword } from "../auth";

test("should hash password with bcrypt", async () => {
  const result = await hashPassword("password123");
  expect(result).toBeDefined();
  expect(result).not.toBe("password123");
});
```

### 3. API Route Tests

**Purpose**: Test API endpoints, request/response handling, and error cases.

**Example**: `src/app/api/auth/register/__tests__/route.test.ts`

```typescript
import { POST } from "../route";
import { NextRequest } from "next/server";

test("should create user successfully", async () => {
  const request = new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Test",
      email: "test@example.com",
      password: "Password123!",
    }),
  });

  const response = await POST(request);
  expect(response.status).toBe(201);
});
```

### 4. E2E Tests

**Purpose**: Test complete user workflows and browser interactions.

**Example**: `e2e/auth.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test("should navigate to sign up page", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Ücretsiz Başlayın");
  await expect(page).toHaveURL("/auth/signup");
});
```

## 🛠️ Test Configuration

### Jest Configuration (`jest.config.js`)

- **Environment**: jsdom for DOM testing
- **Setup**: Global test setup in `jest.setup.js`
- **Module mapping**: Automatic alias resolution for `@/` imports
- **Coverage**: Comprehensive coverage collection with exclusions

### Playwright Configuration (`playwright.config.ts`)

- **Browsers**: Chrome, Firefox, Safari (desktop + mobile)
- **Parallel execution**: Optimized for CI/CD
- **Reporting**: HTML, JSON, and JUnit reports
- **Screenshots/Videos**: On failure for debugging

## 🎯 Testing Best Practices

### Unit Tests

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it
2. **Use descriptive test names**: Clearly state what is being tested
3. **Arrange-Act-Assert pattern**: Structure tests clearly
4. **Mock external dependencies**: Isolate units under test
5. **Test edge cases**: Include error conditions and boundary values

### E2E Tests

1. **Test critical user journeys**: Focus on important workflows
2. **Use data-testid for stable selectors**: Avoid relying on text that might change
3. **Keep tests independent**: Each test should be able to run in isolation
4. **Use page object model**: Organize complex interactions
5. **Handle async operations**: Use proper waits and timeouts

### Code Coverage

1. **Aim for meaningful coverage**: 100% coverage doesn't guarantee bug-free code
2. **Focus on critical paths**: Prioritize testing important business logic
3. **Review uncovered code**: Understand why certain code isn't covered
4. **Update tests with code changes**: Maintain test quality over time

## 🚨 Mocking Strategy

### Global Mocks (`jest.setup.js`)

- **next/navigation**: Router and navigation hooks
- **next-auth/react**: Authentication providers and hooks
- **window.matchMedia**: Media query support

### Test-specific Mocks

- **API responses**: Mock external service calls
- **Database operations**: Mock MongoDB interactions
- **File system**: Mock file operations where needed

## 📈 Continuous Integration

The test suite is designed to run in CI environments:

1. **Parallel execution**: Tests run in parallel for speed
2. **Retry logic**: Flaky tests are retried automatically
3. **Artifact collection**: Screenshots and videos saved on failure
4. **Coverage reporting**: Coverage data exported for analysis

## 🐛 Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm test -- Layout.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Debug with node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Tests

```bash
# Run specific test file
npx playwright test auth.spec.ts

# Debug with UI mode
npx playwright test --debug

# Run with trace viewer
npx playwright test --trace on
```

## 📝 Writing New Tests

### Adding Component Tests

1. Create `__tests__` folder in component directory
2. Name test file: `ComponentName.test.tsx`
3. Import and test the component behavior
4. Mock any external dependencies

### Adding E2E Tests

1. Create new `.spec.ts` file in `e2e/` directory
2. Use descriptive test names and organize in describe blocks
3. Test complete user workflows
4. Use appropriate assertions and waits

## 🔍 Test Coverage Reports

After running `npm run test:coverage`, you can view detailed coverage reports:

- **Console**: Summary printed to terminal
- **HTML Report**: Open `coverage/lcov-report/index.html` in browser
- **File-by-file**: Detailed coverage for each source file
- **Missing coverage**: Lines not covered by tests highlighted in red

The HTML report provides interactive coverage exploration with:

- Line-by-line coverage visualization
- Branch coverage details
- Function coverage summary
- Drill-down capability to specific files and functions

---

## 🎉 Getting Started

1. **Install dependencies**: `npm install`
2. **Run your first test**: `npm test`
3. **Check coverage**: `npm run test:coverage`
4. **Try E2E tests**: `npm run test:e2e:ui`

Happy testing! 🧪✨
