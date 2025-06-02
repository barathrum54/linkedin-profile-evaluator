import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../page";

// Mock next-auth with authenticated user
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: "1",
        name: "Taha Özkan",
        email: "taha@example.com",
        image: "https://example.com/avatar.jpg",
      },
    },
    status: "authenticated",
  })),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

// Mock DashboardLayout
jest.mock("@/components/DashboardLayout", () => {
  return function MockDashboardLayout({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) {
    return (
      <div data-testid="dashboard-layout">
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dashboard with user greeting", () => {
    render(<DashboardPage />);

    // Check if welcome message with user's first name is displayed
    expect(screen.getByTestId("welcome-message")).toHaveTextContent(
      "Hoş Geldin, Taha! 👋"
    );
  });

  it("displays user email", () => {
    render(<DashboardPage />);

    // Check if user email is displayed
    expect(screen.getByTestId("user-email")).toHaveTextContent(
      "taha@example.com"
    );
  });

  it("renders all quick action buttons with proper test-ids", () => {
    render(<DashboardPage />);

    // Check quick actions
    expect(
      screen.getByTestId("quick-action-profil-analizi")
    ).toBeInTheDocument();
    expect(screen.getByTestId("quick-action-faturalama")).toBeInTheDocument();
    expect(screen.getByTestId("quick-action-ana-kurs")).toBeInTheDocument();
    expect(screen.getByTestId("quick-action-ayarlar")).toBeInTheDocument();
  });

  it("renders stats grid with proper test-ids", () => {
    render(<DashboardPage />);

    // Check stats grid components
    expect(screen.getByTestId("stats-grid")).toBeInTheDocument();
    expect(screen.getByTestId("profile-views-stat")).toBeInTheDocument();
    expect(screen.getByTestId("connections-stat")).toBeInTheDocument();
    expect(screen.getByTestId("profile-score-stat")).toBeInTheDocument();
  });

  it("renders recent activities section", () => {
    render(<DashboardPage />);

    // Check recent activities
    expect(screen.getByTestId("recent-activities")).toBeInTheDocument();
    expect(screen.getByTestId("activity-1")).toBeInTheDocument();
    expect(screen.getByTestId("activity-2")).toBeInTheDocument();
    expect(screen.getByTestId("activity-3")).toBeInTheDocument();
    expect(screen.getByTestId("activity-4")).toBeInTheDocument();
  });

  it("renders news feed section", () => {
    render(<DashboardPage />);

    // Check news feed
    expect(screen.getByTestId("news-feed")).toBeInTheDocument();
    expect(screen.getByTestId("feed-post-1")).toBeInTheDocument();
    expect(screen.getByTestId("feed-post-2")).toBeInTheDocument();
    expect(screen.getByTestId("feed-post-3")).toBeInTheDocument();
  });

  it("renders dashboard content wrapper", () => {
    render(<DashboardPage />);

    // Check main content wrapper
    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    expect(screen.getByTestId("welcome-banner")).toBeInTheDocument();
    expect(screen.getByTestId("quick-actions")).toBeInTheDocument();
  });
});
