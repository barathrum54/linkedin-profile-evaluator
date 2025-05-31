import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock localStorage
const localStorageMock = {
  removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.removeItem.mockClear();
  });

  const defaultProps = {
    title: "Test Title",
    subtitle: "Test Subtitle",
    showBackButton: true,
    showRestartButton: true,
    backRoute: "/back",
    maxWidth: "4xl" as const,
  };

  it("should render with all props", () => {
    render(<Navbar {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeDefined();
    expect(screen.getByText("Test Subtitle")).toBeDefined();
  });

  it("should show back button when showBackButton is true", () => {
    render(<Navbar {...defaultProps} />);

    const backButton = screen.getByRole("button", { name: /geri/i });
    expect(backButton).toBeDefined();
  });

  it("should hide back button when showBackButton is false", () => {
    render(<Navbar {...defaultProps} showBackButton={false} />);

    const backButton = screen.queryByRole("button", { name: /geri/i });
    expect(backButton).toBeNull();
  });

  it("should show restart button when showRestartButton is true", () => {
    render(<Navbar {...defaultProps} />);

    const restartButton = screen.getByRole("button", { name: /tekrar başla/i });
    expect(restartButton).toBeDefined();
  });

  it("should hide restart button when showRestartButton is false", () => {
    render(<Navbar {...defaultProps} showRestartButton={false} />);

    const restartButton = screen.queryByRole("button", {
      name: /tekrar başla/i,
    });
    expect(restartButton).toBeNull();
  });

  it("should navigate to back route when back button is clicked", () => {
    render(<Navbar {...defaultProps} />);

    const backButton = screen.getByRole("button", { name: /geri/i });
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith("/back");
  });

  it("should handle restart functionality", () => {
    render(<Navbar {...defaultProps} />);

    const restartButton = screen.getByRole("button", { name: /tekrar başla/i });
    fireEvent.click(restartButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("testAnswers");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("testScore");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should apply custom max width", () => {
    const { container } = render(<Navbar {...defaultProps} maxWidth="6xl" />);

    const navbar = container.querySelector(".max-w-6xl");
    expect(navbar).toBeDefined();
  });

  it("should use default routes when not provided", () => {
    render(
      <Navbar
        title="Test"
        subtitle="Test"
        showBackButton={true}
        showRestartButton={true}
      />
    );

    const backButton = screen.getByRole("button", { name: /geri/i });
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should have proper responsive classes", () => {
    const { container } = render(<Navbar {...defaultProps} />);

    const navbar = container.firstChild as HTMLElement;
    expect(navbar.className).toContain("bg-white/80");
    expect(navbar.className).toContain("backdrop-blur-lg");
    expect(navbar.className).toContain("shadow-lg");
  });

  it("should render title and subtitle with correct hierarchy", () => {
    render(<Navbar {...defaultProps} />);

    const title = screen.getByText("Test Title");
    const subtitle = screen.getByText("Test Subtitle");

    expect(title.tagName).toBe("H1");
    expect(subtitle.tagName).toBe("P");
  });

  it("should display logo/icon", () => {
    const { container } = render(<Navbar {...defaultProps} />);

    const logoSvg = container.querySelector("svg");
    expect(logoSvg).toBeDefined();
  });

  it("should handle default props correctly", () => {
    render(<Navbar title="Test" subtitle="Test" />);

    // Should show both buttons by default
    expect(screen.getByRole("button", { name: /geri/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /tekrar başla/i })).toBeDefined();
  });
});
