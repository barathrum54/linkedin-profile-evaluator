"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface ErrorHandlerOptions {
  redirectTo?: string;
  showNotification?: boolean;
  logError?: boolean;
}

export const useErrorHandler = () => {
  const router = useRouter();

  const handleError = useCallback(
    (error: Error | string | number, options: ErrorHandlerOptions = {}) => {
      const { redirectTo, showNotification = true, logError = true } = options;

      // Log error if enabled
      if (logError) {
        if (typeof error === "string" || typeof error === "number") {
          console.error(`Error ${error}:`, error);
        } else {
          console.error("Application error:", error);
        }
      }

      // Show notification if enabled (you could integrate with a toast library here)
      if (showNotification && typeof window !== "undefined") {
        // For now, we'll use a simple alert, but you could replace this with a toast
        if (typeof error === "number") {
          const errorMessages: Record<number, string> = {
            400: "Geçersiz istek gönderildi.",
            401: "Bu işlem için giriş yapmanız gerekiyor.",
            403: "Bu işlemi gerçekleştirme izniniz yok.",
            404: "İstenen kaynak bulunamadı.",
            500: "Sunucu hatası oluştu.",
            503: "Servis şu anda kullanılamıyor.",
          };

          const message = errorMessages[error] || "Bilinmeyen bir hata oluştu.";
          // You could replace this with a proper toast notification
          console.warn(`Hata ${error}: ${message}`);
        }
      }

      // Redirect if specified
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      // Handle different error types
      if (typeof error === "number") {
        // For HTTP status codes, create error page URL
        const searchParams = new URLSearchParams();
        searchParams.set("error", error.toString());

        // Navigate to a custom error page with the error code
        router.push(`/error?${searchParams.toString()}`);
      } else if (typeof error === "string") {
        // For string errors, you could parse them or handle differently
        const searchParams = new URLSearchParams();
        searchParams.set("message", error);
        router.push(`/error?${searchParams.toString()}`);
      } else {
        // For Error objects, trigger the error boundary by throwing
        throw error;
      }
    },
    [router]
  );

  const handleApiError = useCallback(
    (response: Response) => {
      const statusCode = response.status;

      switch (statusCode) {
        case 401:
          // Redirect to login or show auth modal
          handleError(401, { redirectTo: "/login" });
          break;
        case 403:
          handleError(403);
          break;
        case 404:
          handleError(404);
          break;
        case 500:
        case 502:
        case 503:
          handleError(statusCode);
          break;
        default:
          handleError(statusCode);
      }
    },
    [handleError]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      fallbackValue?: T
    ): Promise<T | undefined> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error as Error);
        return fallbackValue;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleApiError,
    handleAsyncError,
  };
};
