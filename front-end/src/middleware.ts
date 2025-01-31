import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";
import { addUser, getName } from "./app/components/apiCaller";

export async function middleware(request: NextRequest) {
  const session = await auth0.getSession(request);
  if (request.nextUrl.pathname === "/") {
    if (session) {
      const storedName = request.cookies.get('onboardingName');
      if (storedName?.value) {
        try {
          const response = await getName({
            id: session.user.email as string,
            requestType: 'get_name',
            baseUrl: `${request.nextUrl.protocol}//${request.nextUrl.host.split('/unknown')[0]}`
          });
          const userData = await response.json();
          
          if (!userData) {
            await addUser({
              id: session.user.email as string,
              requestType: 'add_user',
              name: storedName.value,
              baseUrl: `${request.nextUrl.protocol}//${request.nextUrl.host.split('/unknown')[0]}`
            });
          }
          request.cookies.delete('onboardingName');
        } catch (error) {
          console.error('Error checking/creating user:', error);
        }
      }
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
