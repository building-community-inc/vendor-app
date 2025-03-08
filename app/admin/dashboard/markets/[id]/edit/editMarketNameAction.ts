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
  const lastDayToBook = formData.get("lastDayToBook");
  
  if (!marketId || !marketName || !lastDayToBook) {
    return {
      errors: ["Market Name and last day to book are required"],
      success: false
    }
  }

  const sanityResp = await sanityWriteClient.patch(marketId as string).set({ name: marketName as string, lastDayToBook: lastDayToBook as string }).commit()

  if (sanityResp) {
    
    revalidatePath("/dashboard/", "layout");
    revalidatePath("/admin/dashboard/", "layout");
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