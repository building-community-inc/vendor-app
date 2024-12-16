"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const editMarketNameAction = async (
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
  const marketId = formData.get("marketId");
  const marketName = formData.get("marketName");
  
  if (!marketId || !marketName) {
    return {
      errors: ["Market ID and Market Name are required"],
      success: false
    }
  }

  const sanityResp = await sanityWriteClient.patch(marketId as string).set({ name: marketName as string }).commit()

  if (sanityResp) {
    
    revalidatePath("/dashboard/explore", "page");
    revalidatePath("/admin/dashboard/markets", "page");
    revalidatePath("/admin/dashboard/markets/[id]", "page");
    revalidatePath("/admin/dashboard/markets/[id]/edit", "page");
    revalidatePath("/dashboard/markets/[id]", "page");
    return {
      errors: null,
      success: true
    }
  }

  return {
    errors: ["Something went wrong"],
    success: false
  }
};