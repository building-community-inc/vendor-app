import { prisma } from "@/prisma/client";
import { UserCreateInputSchema, UserSchema } from "@/prisma/generated/zod";
import { currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server";

export const GET = async function () {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return NextResponse.redirect("/sign-in");
  }

  const userToValidate = {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    hasImage: clerkUser.hasImage,
    image: clerkUser.hasImage ? clerkUser.imageUrl : null,
  }
  
  const validatedUser = UserCreateInputSchema.safeParse(userToValidate);

  if (!validatedUser.success) {
    return NextResponse.json(validatedUser.error)
  }

  await prisma.user.create({data: validatedUser.data})

  
  return NextResponse.redirect("http://localhost:3000/");
}