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

// Mock React hooks
jest.mock("react", () => {
  const actualReact = jest.requireActual("react");
  return {
    ...actualReact,
    useEffect: jest.fn(),
  };
});

// Mock console.error
const mockConsoleError = jest.fn();
console.error = mockConsoleError;

// Define component type
type ErrorComponentType = (props: {
  error: Error;
  reset: () => void;
}) => ReactElement;

describe("Error Component", () => {
  let Error: ErrorComponentType;

  beforeEach(() => {
    jest.clearAllMocks();
    // Import the component after mocks are set up
    const errorModule = jest.requireActual("../error");
    Error = errorModule.default;
  });

  const mockReset = jest.fn();

  describe("Error code detection", () => {
    it("should detect 401 unauthorized error", () => {
      const error = { message: "unauthorized access" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("401");
    });

    it("should detect 403 forbidden error", () => {
      const error = { message: "forbidden request" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("403");
    });

    it("should detect 404 not found error", () => {
      const error = { message: "not found resource" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("404");
    });

    it("should detect 400 bad request error", () => {
      const error = { message: "bad request format" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("400");
    });

    it("should detect 503 service unavailable error", () => {
      const error = { message: "service unavailable" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("503");
    });

    it("should default to 500 for unknown errors", () => {
      const error = { message: "unknown error type" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("500");
    });

    it("should handle numeric error codes in messages", () => {
      const error = { message: "Error 401 occurred" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("401");
    });

    it("should be case insensitive", () => {
      const error = { message: "UNAUTHORIZED ACCESS" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("status-code")).toHaveTextContent("401");
    });
  });

  describe("ErrorPage props for 500 errors", () => {
    it("should pass custom title and message for 500 errors", () => {
      const error = { message: "internal server error" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("title")).toHaveTextContent(
        "Beklenmeyen Bir Hata Oluştu"
      );
      expect(screen.getByTestId("message")).toHaveTextContent(
        "Üzgünüz, bir şeyler ters gitti. Lütfen sayfayı yenilemeyi deneyin."
      );
    });

    it("should not show custom title and message for non-500 errors", () => {
      const error = { message: "not found" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.queryByTestId("title")).toBeNull();
      expect(screen.queryByTestId("message")).toBeNull();
    });
  });

  describe("ErrorPage button configuration", () => {
    it("should configure all buttons to be shown", () => {
      const error = { message: "test error" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("show-back-button")).toHaveTextContent("true");
      expect(screen.getByTestId("show-home-button")).toHaveTextContent("true");
      expect(screen.getByTestId("show-refresh-button")).toHaveTextContent(
        "true"
      );
    });
  });

  describe("Component structure", () => {
    it("should render ErrorPage component", () => {
      const error = { message: "test error" } as Error;
      render(<Error error={error} reset={mockReset} />);

      expect(screen.getByTestId("error-page")).toBeTruthy();
    });

    it("should render main div container", () => {
      const error = { message: "test error" } as Error;
      const { container } = render(<Error error={error} reset={mockReset} />);

      expect(container.firstChild).toBeTruthy();
    });
  });
});
