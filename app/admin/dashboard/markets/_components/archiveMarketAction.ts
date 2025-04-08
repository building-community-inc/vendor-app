"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  marketId: z.string(),
  archive: z.enum(["archive", "restore"]).transform((val) => val === "archive")
});

export const archiveMarket = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const user = await currentUser();

  if (!user) {
    return {
      errors: ["User not found"],
      success: false,
    };
  }

  const rawData = {
    marketId: formData.get("marketId"),
    archive: formData.get("archive")
  };

  
  const parsedData = formSchema.safeParse(rawData);
  
  if (!parsedData.success)
    return {
  success: false,
  errors: ["something went wrong."],
};

try {
    await sanityWriteClient
      .patch(parsedData.data.marketId)
      .set({
        archived: parsedData.data.archive,
      })
      .commit();
      
      revalidatePath("/dashboard", "layout")
      revalidatePath("/admin/dashboard", "layout")
    
    return {
      errors: null,
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      errors: ["something went wrong updating the market"],
      success: false,
    };
  }
};
