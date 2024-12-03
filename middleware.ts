import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about-us",
  "/pricing",
  "/blog(.*)",
  "/sso-callback(.*)",
  "/api(.*)",
  "/api/ws",
  "/api/ws/events",
];

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const path = req.nextUrl.pathname;

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    route.endsWith("(.*)")
      ? path.startsWith(route.replace("(.*)", ""))
      : path === route
  );

  // If the route is not public and user is not authenticated, redirect
  if (!isPublicRoute && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
