import { renderHook, act } from "@testing-library/react";
import { useErrorHandler } from "../useErrorHandler";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("useErrorHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods and suppress error output
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should provide handleError function", () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(typeof result.current.handleError).toBe("function");
  });

  it("should provide handleApiError function", () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(typeof result.current.handleApiError).toBe("function");
  });

  it("should provide handleAsyncError function", () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(typeof result.current.handleAsyncError).toBe("function");
  });

  it("should log error when handleError is called with Error object", () => {
    const { result } = renderHook(() => useErrorHandler());
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const testError = new Error("Test error");

    // The hook throws the error, so we need to catch it
    act(() => {
      expect(() => {
        result.current.handleError(testError);
      }).toThrow();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Application error:",
      testError
    );
    consoleErrorSpy.mockRestore();
  });

  it("should log error when handleError is called with string", () => {
    const { result } = renderHook(() => useErrorHandler());
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const testError = "String error message";

    act(() => {
      result.current.handleError(testError);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error String error message:",
      testError
    );
    consoleErrorSpy.mockRestore();
  });

  it("should redirect to error page with string error", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError("Test error");
    });

    expect(mockPush).toHaveBeenCalledWith("/error?message=Test+error");
  });

  it("should redirect to error page with number error", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(404);
    });

    expect(mockPush).toHaveBeenCalledWith("/error?error=404");
  });

  it("should redirect to custom path when redirectTo option is provided", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError("Test error", { redirectTo: "/custom-error" });
    });

    expect(mockPush).toHaveBeenCalledWith("/custom-error");
  });

  it("should not log error when logError option is false", () => {
    const { result } = renderHook(() => useErrorHandler());
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    act(() => {
      result.current.handleError("Test error", { logError: false });
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("should handle API error with 401 status", () => {
    const { result } = renderHook(() => useErrorHandler());
    const mockResponse = { status: 401 } as Response;

    act(() => {
      result.current.handleApiError(mockResponse);
    });

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should handle API error with 404 status", () => {
    const { result } = renderHook(() => useErrorHandler());
    const mockResponse = { status: 404 } as Response;

    act(() => {
      result.current.handleApiError(mockResponse);
    });

    expect(mockPush).toHaveBeenCalledWith("/error?error=404");
  });

  it("should handle API error with 500 status", () => {
    const { result } = renderHook(() => useErrorHandler());
    const mockResponse = { status: 500 } as Response;

    act(() => {
      result.current.handleApiError(mockResponse);
    });

    expect(mockPush).toHaveBeenCalledWith("/error?error=500");
  });

  it("should handle async function successfully", async () => {
    const { result } = renderHook(() => useErrorHandler());
    const successfulAsyncFn = jest.fn().mockResolvedValue("success");

    const resultValue = await result.current.handleAsyncError(
      successfulAsyncFn
    );

    expect(resultValue).toBe("success");
    expect(successfulAsyncFn).toHaveBeenCalled();
  });

  it("should handle async function with rejected promise", async () => {
    const { result } = renderHook(() => useErrorHandler());
    const failingAsyncFn = jest.fn().mockRejectedValue("Simple rejection");

    // Suppress console error for this test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const resultValue = await result.current.handleAsyncError(
      failingAsyncFn,
      "fallback"
    );

    expect(resultValue).toBe("fallback");
    expect(failingAsyncFn).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should handle number errors with console warning", () => {
    const { result } = renderHook(() => useErrorHandler());
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    act(() => {
      result.current.handleError(400);
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Hata 400: Geçersiz istek gönderildi."
    );

    consoleWarnSpy.mockRestore();
  });
});
