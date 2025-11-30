import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/";

  // SCENARIO 1: User has a token (is authenticated)
  if (token) {
    // If they are trying to access a login/signup page, redirect to dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Otherwise, allow them to proceed
    return NextResponse.next();
  }

  // SCENARIO 2: User does NOT have a token (is not authenticated)
  if (!token) {
    // If they are trying to access a protected page (i.e., NOT an auth page),
    // redirect them to the login page.
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // If they are already on an auth page, let them proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*", // Use :path* to protect nested dashboard routes
    "/login",
    "/signup",
    "/"
  ],
};
