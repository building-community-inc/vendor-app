import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware

const publicRoutes = [
  "/", 
  "/studio(.*)", 
  // "/dashboard/explore"
];

export default authMiddleware({
  publicRoutes,
  authorizedParties: ["https://vendorapp.buildingcommunityinc.com/", "http://localhost:3000"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};