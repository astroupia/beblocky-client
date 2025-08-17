import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without authentication
const publicPaths = ["/sign-in", "/sign-up", "/reset-password"];

// Add regex patterns for Better Auth callback URLs
const publicPathPatterns = [
  /^\/sign-in/,
  /^\/sign-up/,
  /^\/reset-password/,
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
