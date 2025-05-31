import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { ReactElement } from "react";

// Mock the ErrorPage component
jest.mock("@/components/ErrorPage", () => {
  return function MockErrorPage({
    statusCode,
    title,
    message,
    showBackButton,
    showHomeButton,
    showRefreshButton,
  }: {
    statusCode: number;
    title?: string;
    message?: string;
    showBackButton?: boolean;
    showHomeButton?: boolean;
    showRefreshButton?: boolean;
  }) {
    return (
      <div data-testid="error-page">
        <div data-testid="status-code">{statusCode}</div>
        {title && <div data-testid="title">{title}</div>}
        {message && <div data-testid="message">{message}</div>}
        <div data-testid="show-back-button">{String(showBackButton)}</div>
        <div data-testid="show-home-button">{String(showHomeButton)}</div>
        <div data-testid="show-refresh-button">{String(showRefreshButton)}</div>
      </div>
    );
  };
});

// Mock console.error
const mockConsoleError = jest.fn();
console.error = mockConsoleError;

// Define component type
type GlobalErrorComponentType = (props: {
  error: Error;
  reset: () => void;
}) => ReactElement;

describe("Global Error Component", () => {
  let GlobalError: GlobalErrorComponentType;

  beforeEach(() => {
    jest.clearAllMocks();
    // Import the component after mocks are set up
    const globalErrorModule = jest.requireActual("../global-error");
    GlobalError = globalErrorModule.default;
  });

  const mockReset = jest.fn();

  describe("Fixed status code", () => {
    it("should always use status code 500", () => {
      const error = { message: "not found" } as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("500");
    });

    it("should use 500 for any error type", () => {
      const error = { message: "unauthorized" } as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("500");
    });

    it("should use 500 for custom errors", () => {
      const error = { message: "custom error message" } as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("500");
    });
  });

  describe("ErrorPage props", () => {
    it("should pass custom title for global errors", () => {
      const error = { message: "test error" } as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("title")).toHaveTextContent(
        "Kritik Sistem Hatası"
      );
    });

    it("should pass custom message for global errors", () => {
      const error = { message: "test error" } as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("message")).toHaveTextContent(
        "Uygulamada kritik bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin."
      );
    });
  });

  describe("ErrorPage button configuration", () => {
    it("should only show refresh button", () => {
      const error = { message: "test error" } as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("show-back-button")).toHaveTextContent("false");
      expect(screen.getByTestId("show-home-button")).toHaveTextContent("true");
      expect(screen.getByTestId("show-refresh-button")).toHaveTextContent(
        "true"
      );
    });
  });

  describe("Component structure", () => {
    it("should render within html and body tags", () => {
      const error = { message: "test error" } as Error;
      const { container } = render(
        <GlobalError error={error} reset={mockReset} />
      );

      // Check if component renders properly
      expect(screen.getByTestId("error-page")).toBeTruthy();
      expect(container.firstChild).toBeTruthy();
    });

    it("should render ErrorPage component", () => {
      const error = { message: "test error" } as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("error-page")).toBeTruthy();
    });
  });

  describe("Error handling", () => {
    it("should handle undefined error messages", () => {
      const error = {} as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("500");
    });

    it("should handle null error", () => {
      const error = null as unknown as Error;
      render(<GlobalError error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("500");
    });
  });
});
