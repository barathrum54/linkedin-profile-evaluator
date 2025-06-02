import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (req.nextauth.token && req.nextUrl.pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is not authenticated and tries to access protected routes
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL(
          "/auth/signin?callbackUrl=" + encodeURIComponent(req.url),
          req.url
        )
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages for unauthenticated users
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }

        // Require authentication for dashboard and payment pages
        if (
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/payment")
        ) {
          return !!token;
        }

        // Allow access to all other pages
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/auth/:path*"],
};
