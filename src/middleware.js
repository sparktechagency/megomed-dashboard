import { NextResponse } from "next/server";


export function middleware(req) {
  const token = req.headers.get("authorization"); // Token header theke nicchi
  const loginUrl = new URL("/auth/login", req.url);

  // Jodi token na thake, tahole login page e redirect korbe
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*", 
};


