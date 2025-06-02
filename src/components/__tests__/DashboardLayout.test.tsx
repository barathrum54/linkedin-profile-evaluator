import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardLayout from "../DashboardLayout";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/dashboard",
}));

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
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
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock next-auth hooks
    const mockNextAuth = jest.requireMock("next-auth/react");
    mockNextAuth.useSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Taha Özkan",
          email: "taha@example.com",
          image: "https://example.com/avatar.jpg",
        },
      },
      status: "authenticated",
    });
  });

  it("renders layout with authenticated user data", () => {
    render(
      <DashboardLayout title="Test Dashboard">
        <div>Test Content</div>
      </DashboardLayout>
    );

    // Check if layout renders
    expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();

    // Check user info in sidebar
    expect(screen.getByTestId("sidebar-user-name")).toHaveTextContent(
      "Taha Özkan"
    );
    expect(screen.getByTestId("sidebar-user-email")).toHaveTextContent(
      "taha@example.com"
    );
    expect(screen.getByTestId("sidebar-user-avatar")).toBeInTheDocument();
  });

  it("displays app name and logo", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("app-name")).toHaveTextContent("LinkedIn Pro");
    expect(screen.getByTestId("app-logo")).toBeInTheDocument();
  });

  it("renders all navigation items with proper test-ids", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    // Check navigation items
    expect(screen.getByTestId("nav-item-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("nav-item-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-item-billing")).toBeInTheDocument();
    expect(screen.getByTestId("nav-item-main-course")).toBeInTheDocument();
    expect(screen.getByTestId("nav-item-settings")).toBeInTheDocument();
  });

  it("displays premium status section", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("premium-status")).toBeInTheDocument();
    expect(screen.getByTestId("premium-status-text")).toHaveTextContent(
      "Premium Üye"
    );
    expect(screen.getByTestId("premium-features-text")).toHaveTextContent(
      "Tüm özelliklere erişim"
    );
  });

  it("handles logout button click", async () => {
    const mockNextAuth = jest.requireMock("next-auth/react");

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    const logoutButton = screen.getByTestId("logout-button");
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);

    // Check if signOut was called
    expect(mockNextAuth.signOut).toHaveBeenCalledWith({
      redirect: true,
      callbackUrl: "/",
    });
  });

  it("handles navigation button clicks", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    const profileNavItem = screen.getByTestId("nav-item-profile");
    fireEvent.click(profileNavItem);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/profile");
  });

  it("shows course badge correctly", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("nav-badge-main-course")).toHaveTextContent(
      "Yakında"
    );
  });

  it("renders mobile header elements", () => {
    render(
      <DashboardLayout title="Mobile Test">
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("mobile-header")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-header-title")).toHaveTextContent(
      "Mobile Test"
    );
    expect(screen.getByTestId("sidebar-open-button")).toBeInTheDocument();
  });

  it("handles user without image", () => {
    // Mock user without image
    const mockNextAuth = jest.requireMock("next-auth/react");
    mockNextAuth.useSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Taha Özkan",
          email: "taha@example.com",
          image: null,
        },
      },
      status: "authenticated",
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(
      screen.getByTestId("sidebar-user-avatar-placeholder")
    ).toBeInTheDocument();
  });

  it("shows loading state correctly", () => {
    // Mock loading state
    const mockNextAuth = jest.requireMock("next-auth/react");
    mockNextAuth.useSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("dashboard-layout-loading")).toBeInTheDocument();
  });

  it("renders child content in content area", () => {
    render(
      <DashboardLayout>
        <div data-testid="child-content">Test Child Content</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("content-area")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toHaveTextContent(
      "Test Child Content"
    );
  });
});
