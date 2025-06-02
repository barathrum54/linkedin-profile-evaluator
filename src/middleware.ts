import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (req.auth && req.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not authenticated and tries to access protected routes
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL(
        "/auth/signin?callbackUrl=" + encodeURIComponent(req.url),
        req.url
      )
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/auth/:path*"],
};
