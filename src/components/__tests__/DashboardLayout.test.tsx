import React from "react";
import { render } from "@testing-library/react";
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
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
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
    const { container } = render(<DashboardLayout {...defaultProps} />);
    expect(container.textContent).toContain("Test Content");
  });

  it("displays user information when authenticated", () => {
    const { container } = render(<DashboardLayout {...defaultProps} />);
    expect(container.textContent).toContain("Premium Üye");
  });

  it("renders navigation links", () => {
    const { container } = render(<DashboardLayout {...defaultProps} />);

    // Check for common navigation items
    expect(container.textContent).toContain("Dashboard");
    expect(container.textContent).toContain("Profile");
    expect(container.textContent).toContain("Settings");
  });

  it("has proper layout structure", () => {
    const { container } = render(<DashboardLayout {...defaultProps} />);

    // Check that the layout container exists
    const navElement = container.querySelector("nav");
    expect(navElement).toBeTruthy();
  });

  it("renders with different content", () => {
    const customContent = <div>Custom Dashboard Content</div>;
    const { container } = render(
      <DashboardLayout>{customContent}</DashboardLayout>
    );

    expect(container.textContent).toContain("Custom Dashboard Content");
  });

  it("handles empty children", () => {
    const { container } = render(<DashboardLayout>{null}</DashboardLayout>);

    // Should still render the layout structure
    expect(container.textContent).toContain("Premium Üye");
  });
});
