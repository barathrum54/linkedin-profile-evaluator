"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ErrorPage from "@/components/ErrorPage";

function ErrorPageContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const customMessage = searchParams.get("message");
  const customTitle = searchParams.get("title");

  const statusCode = errorCode ? parseInt(errorCode, 10) : 500;

  return (
    <ErrorPage
      statusCode={statusCode}
      title={customTitle || undefined}
      message={customMessage || undefined}
      showBackButton={true}
      showHomeButton={true}
      showRefreshButton={true}
    />
  );
}

export default function CustomErrorPage() {
  return (
    <Suspense
      fallback={
        <ErrorPage
          statusCode={500}
          title="Yükleniyor..."
          message="Hata sayfası yükleniyor..."
          showBackButton={false}
          showHomeButton={true}
          showRefreshButton={false}
        />
      }
    >
      <ErrorPageContent />
    </Suspense>
  );
}
