import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/studio(.*)", 
  "/sign-in(.*)",
  "/add-user-to-sanity(.*)",
  "/sign-up(.*)"
]);

export default clerkMiddleware(
  async (auth, request) => {
    console.log("running");
    if (!isPublicRoute(request)) {
      console.log("protecting route");
      await auth.protect();
    }
  },
  {
    authorizedParties: process.env.NODE_ENV === "production" ? [
      "https://vendorapp.buildingcommunityinc.com",
      "http://localhost:3000",
    ] : undefined,
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
