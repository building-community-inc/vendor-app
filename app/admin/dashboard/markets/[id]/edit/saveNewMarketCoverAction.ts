"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const saveNewMarketCoverAction = async (
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

  const marketCover = formData.get("newMarketCover") as File;
  
  if (!marketCover) {
    return {
      success: false,
      errors: ["Market cover not provided"]
    }
  }

  const coverUpload = await sanityWriteClient.assets.upload("image", marketCover, {
    filename: marketCover.name,
  });

  if (!coverUpload) {
    return {
      success: false,
      errors: ["Failed to upload market cover"]
    }
  }

  const sanityResp = await sanityWriteClient.patch(marketId).set({
    marketCover: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: coverUpload._id
      }
    }
  }).commit();

  revalidatePath("/dashboard/explore", "page");
  revalidatePath("/admin/dashboard/markets", "page");
  revalidatePath("/admin/dashboard/markets/[id]", "page");
  revalidatePath("/admin/dashboard/markets/[id]/edit", "page");
  revalidatePath("/dashboard/markets/[id]", "page");

  const oldMarketCoverId = formData.get("oldMarketCoverId") as string;
  if (!oldMarketCoverId) {
    return {
      success: true,
      errors: null
    }
  }

  const sanityDeleteResp = await sanityWriteClient.delete(oldMarketCoverId);

  if (!sanityDeleteResp) {
    return {
      success: true,
      errors: null
    }
  }

  return {
    success: true,
    errors: null
  }

}