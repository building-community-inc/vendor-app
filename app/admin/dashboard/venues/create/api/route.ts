import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { zodSanityVenue } from "@/zod/venues";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({
      status: 405,
      body: { message: "Method not allowed" },
    });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (user.role !== "admin") {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  const body = await req.json();

  const parsedVenue = zodSanityVenue.safeParse(body);

  if (!parsedVenue.success) {
    throw new Error(parsedVenue.error.message);
  }

  const sanityResp = await sanityWriteClient
    .create(parsedVenue.data)
    .catch((err) => {
      throw new Error(err);
    });

  revalidatePath("/admin/dashboard/", "layout");
  revalidatePath("/dashboard/", "layout");

  return Response.json(sanityResp);
};
