// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// List of public routes
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/pricing",
  "/signin",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  '/policy',
  '/terms'
];

interface DecodedToken {
  exp: number;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(
      /\.(png|jpg|jpeg|gif|svg|webp|ico|mp4|webm|ogg|mp3|wav|woff2?|ttf|eot)$/
    )
  ) {
    return NextResponse.next();
  }

  // Check access token from cookie
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    // Token expired → redirect to login
    if (decoded.exp < currentTime) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Token valid → continue
    return NextResponse.next();
  } catch {
    // Invalid token → redirect to login
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

// Apply middleware to all routes except _next and static assets
export const config = {
  matcher: ["/((?!_next/).*)"], // apply to all except _next
};
