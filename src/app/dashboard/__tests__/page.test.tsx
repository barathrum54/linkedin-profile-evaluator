import React from "react";
import { render } from "@testing-library/react";
import DashboardPage from "../page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        name: "Test User",
        email: "test@example.com",
      },
    },
    status: "authenticated",
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("Dashboard Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<DashboardPage />);
    expect(container).toBeTruthy();
  });

  it("displays dashboard content", () => {
    const { container } = render(<DashboardPage />);
    expect(container.textContent).toBeTruthy();
  });

  it("contains dashboard information", () => {
    const { container } = render(<DashboardPage />);
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
