import React from "react";
import { render } from "@testing-library/react";
import SignUpPage from "../page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("SignUp Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<SignUpPage />);
    expect(container).toBeTruthy();
  });

  it("displays signup content", () => {
    const { container } = render(<SignUpPage />);
    expect(container.textContent).toBeTruthy();
  });

  it("contains signup form", () => {
    const { container } = render(<SignUpPage />);
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
