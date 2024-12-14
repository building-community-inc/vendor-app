"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const deleteMarketAction = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const user = await currentUser();

  if (!user) {
    return {
      errors: ["User not found"],
      success: false
    }
  }

  const sanityUser = await getSanityUserByEmail(user.emailAddresses[0].emailAddress);

  if (!sanityUser || sanityUser.role !== "admin") {
    return {
      errors: ["User not found or authorized"],
      success: false
    }
  }
  const marketId = formData.get("marketId") as string;

  if (!marketId) {
    return {
      success: false,
      errors: ["Market ID not provided"]
    }
  }

  const sanityResp = await sanityWriteClient.delete(marketId);

  revalidatePath("/dashboard/explore", "page");
  revalidatePath("/admin/dashboard/markets", "page");
  revalidatePath("/admin/dashboard/markets/[id]", "page");
  revalidatePath("/dashboard/markets/[id]", "page");
  return {
    success: true,
    errors: null
  }
};