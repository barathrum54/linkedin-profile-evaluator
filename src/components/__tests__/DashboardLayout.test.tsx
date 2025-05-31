import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardLayout from "../DashboardLayout";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.jpg",
      },
    },
    status: "authenticated",
  }),
  signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/dashboard",
  }),
  usePathname: () => "/dashboard",
}));

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("DashboardLayout", () => {
  const defaultProps = {
    children: <div>Test Content</div>,
  };

  it("renders children content", () => {
    render(<DashboardLayout {...defaultProps} />);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("displays user information when authenticated", () => {
    render(<DashboardLayout {...defaultProps} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<DashboardLayout {...defaultProps} />);

    // Check for common navigation items
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("has proper layout structure", () => {
    const { container } = render(<DashboardLayout {...defaultProps} />);

    // Check that the layout container exists
    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
  });

  it("renders with different content", () => {
    const customContent = <div>Custom Dashboard Content</div>;
    render(<DashboardLayout>{customContent}</DashboardLayout>);

    expect(screen.getByText("Custom Dashboard Content")).toBeInTheDocument();
  });

  it("handles empty children", () => {
    render(<DashboardLayout>{null}</DashboardLayout>);

    // Should still render the layout structure
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});
