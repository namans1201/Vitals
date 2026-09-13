import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Everything except the login page/action and static assets requires the
// session cookie. Static files (logo, favicons, fonts, …) must stay excluded
// by extension, not by an ever-growing filename list — Next's own docs
// recommend exactly this pattern — because /login itself needs its logo to
// load while logged out, and it was 307-redirecting to /login?from=/logo.png
// (which an <img> tag can't decode) before this was widened.
// /api/import (Phase 4) will authenticate separately via a bearer token and
// needs its own exemption when it's built.
export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf)$).*)",
  ],
};
