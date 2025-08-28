import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isMaintenanceModeEnabled,
  isIPAllowed,
  isUserAgentAllowed,
} from "@/lib/config/maintenance";

// Add paths that should be accessible without authentication
const publicPaths = ["/sign-in", "/sign-up", "/reset-password", "/maintenance"];

// Add regex patterns for Better Auth callback URLs
const publicPathPatterns = [
  /^\/sign-in/,
  /^\/sign-up/,
  /^\/reset-password/,
  /^\/maintenance/,
  /^\/api\/auth\/reset-password\/[^?]+/, // Better Auth reset password callback
  /^\/api\/auth\/[^/]+\/[^?]+/, // General Better Auth callbacks
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public using both exact matches and regex patterns
  const isPublicPath =
    publicPaths.some((path) => pathname.startsWith(path)) ||
    publicPathPatterns.some((pattern) => pattern.test(pathname));

  // Check for better-auth session token - check multiple possible cookie names for deployed environments
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("__Host-better-auth.session_token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  // Maintenance mode check
  if (isMaintenanceModeEnabled()) {
    // Allow access to maintenance page itself
    if (pathname === "/maintenance") {
      return NextResponse.next();
    }

    // Get client IP and user agent for bypass checks
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    // Check if client is allowed to bypass maintenance mode
    const isAllowedIP = isIPAllowed(clientIP);
    const isAllowedUserAgent = isUserAgentAllowed(userAgent);

    // If not allowed to bypass, redirect to maintenance page
    if (!isAllowedIP && !isAllowedUserAgent) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  // If not logged in and trying to access protected page (including root "/")
  if (!sessionToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If already logged in and accessing login/signup, redirect to home page
  if (sessionToken && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
