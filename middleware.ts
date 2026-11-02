// Place at the PROJECT ROOT (next to /app), not inside /app.
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_PREFIXES, canAccess, decodeJwt, homeFor } from "./app/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/" || PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = decodeJwt(req.cookies.get("session")?.value);
  if (!session) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!canAccess(pathname, session.role)) {
    return NextResponse.redirect(new URL(homeFor(session.role), req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};