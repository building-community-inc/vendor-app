import { sanityWriteClient } from "@/sanity/lib/client";
import { zodUserBase } from "@/zod/user-business";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const revalidate = 60;

export const GET = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return redirect("/sign-in");
  };

  const userToValidate = {
    _type: "user",
    _id: clerkUser.id,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    hasImage: clerkUser.hasImage,
    image: clerkUser.hasImage ? clerkUser.imageUrl : null,
    role: "vendor",
    status: "pending",
  };

  const validatedUser = zodUserBase.safeParse(userToValidate);

  if (!validatedUser.success) {
    throw new Error(validatedUser.error.message);
  }

  const sanityWriteResponse = await sanityWriteClient.createIfNotExists(
    validatedUser.data
  );

  if (!sanityWriteResponse) {
    throw new Error("something went wrong");
  }
  if (sanityWriteResponse) {
    return redirect("/create-business");
  }
};
