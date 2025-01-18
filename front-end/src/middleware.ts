import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const session = await auth0.getSession(request);
  if (request.nextUrl.pathname === "/") {
    if (session) {
      return Response.redirect(new URL("/home", request.url));
    }
  } else if(request.nextUrl.pathname === "/home" || request.nextUrl.pathname === "/analytics") {
    if (!session) {
      return Response.redirect(new URL("/", request.url));
    }
  }
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
