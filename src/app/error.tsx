"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/ErrorPage";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  // Determine error type based on error message or other factors
  const getErrorCode = (error: Error): number => {
    const message = error.message.toLowerCase();

    // Check for specific error patterns
    if (message.includes("unauthorized") || message.includes("401")) {
      return 401;
    }
    if (message.includes("forbidden") || message.includes("403")) {
      return 403;
    }
    if (message.includes("not found") || message.includes("404")) {
      return 404;
    }
    if (message.includes("bad request") || message.includes("400")) {
      return 400;
    }
    if (message.includes("service unavailable") || message.includes("503")) {
      return 503;
    }

    // Default to 500 for unknown errors
    return 500;
  };

  const errorCode = getErrorCode(error);

  // Create a custom ErrorPage component that uses the reset function
  return (
    <div>
      <ErrorPage
        statusCode={errorCode}
        title={errorCode === 500 ? "Beklenmeyen Bir Hata Oluştu" : undefined}
        message={
          errorCode === 500
            ? "Üzgünüz, bir şeyler ters gitti. Lütfen sayfayı yenilemeyi deneyin."
            : undefined
        }
        showBackButton={true}
        showHomeButton={true}
        showRefreshButton={true}
      />
      {/* Custom reset button for development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={reset}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
          >
            Reset Error Boundary
          </button>
        </div>
      )}
    </div>
  );
}
