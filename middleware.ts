import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook",
]);
const isProtectedRoute = createRouteMatcher(["/protected"]);
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
  if (auth().userId && isPublicRoute(req)) {
    if (auth().orgId) {
      return NextResponse.redirect(
        new URL(`/organization/${auth().orgId}`, req.url)
      );
    }
    return NextResponse.redirect(new URL("/select-org", req.url));
  }
  // if (
  //   auth().userId &&
  //   -!isPublicRoute(req) &&
  //   -!auth().orgId &&
  //   req.nextUrl.pathname !== "/select-org"
  // ) {
  //   return NextResponse.redirect("/select-org");
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
