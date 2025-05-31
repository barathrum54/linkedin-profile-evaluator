"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/ErrorPage";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorPage
          statusCode={500}
          title="Kritik Sistem Hatası"
          message="Uygulamada kritik bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin."
          showBackButton={false}
          showHomeButton={true}
          showRefreshButton={true}
        />
        {/* Global reset button for development */}
        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              position: "fixed",
              bottom: "16px",
              right: "16px",
              zIndex: 9999,
            }}
          >
            <button
              onClick={reset}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              Reset Global Error
            </button>
          </div>
        )}
      </body>
    </html>
  );
}
