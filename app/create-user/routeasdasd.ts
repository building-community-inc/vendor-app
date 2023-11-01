import { sanityWriteClient } from "@/sanity/lib/client";
import { zodUserBase } from "@/zod/types";
import { currentUser } from "@clerk/nextjs";


export const GET = async (req: Request) => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return Response.redirect("/sign-in");
  }
  const userToValidate = {
    _type: "user",
    _id: clerkUser.id,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    hasImage: clerkUser.hasImage,
    image: clerkUser.hasImage ? clerkUser.imageUrl : null,
    role: "vendor"
  };

  const validatedUser = zodUserBase.safeParse(userToValidate);

  if (!validatedUser.success) {
    throw new Error(validatedUser.error.message);
  }

  const sanityWriteResponse = await sanityWriteClient.createIfNotExists(validatedUser.data);

  if (!sanityWriteResponse) {
    throw new Error("something went wrong");
  }
  if (sanityWriteResponse) {
    return Response.redirect("/create-business");
  } 
}