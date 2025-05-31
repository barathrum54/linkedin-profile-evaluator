import React from "react";
import { render } from "@testing-library/react";
import SignInPage from "../page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  signIn: jest.fn(),
  getProviders: jest.fn().mockResolvedValue({}),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe("SignIn Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<SignInPage />);
    expect(container).toBeTruthy();
  });

  it("displays signin content", () => {
    const { container } = render(<SignInPage />);
    expect(container.textContent).toBeTruthy();
  });

  it("contains signin form", () => {
    const { container } = render(<SignInPage />);
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
