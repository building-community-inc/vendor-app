"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const editMarketNameAction = async (
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

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser || sanityUser.role !== "admin") {
    return {
      errors: ["User not found or authorized"],
      success: false,
    };
  }

  const rawData = {
    allDaysMandatory: formData.get("allDaysMandatory"),
    marketId: formData.get("marketId"),
    marketName: formData.get("marketName"),
    lastDayToBook: formData.get("lastDayToBook"),
    oldAllDaysMandatory: formData.get("oldAllDaysMandatory"),
    oldMarketName: formData.get("oldMarketName"),
    oldLastDayToBook: formData.get("oldLastDayToBook"),
  };

  const { success, data, error } = formSchema.safeParse(rawData);

  if (!success) {
    console.error({ error });
    return {
      success: false,
      errors: ["something went very wrong"],
    };
  }

  const {
    allDaysMandatory,
    lastDayToBook,
    marketId,
    marketName,
    oldAllDaysMandatory,
    oldLastDayToBook,
    oldMarketName,
  } = data;

  const changes: {
    allDaysMandatory?: boolean;
    lastDayToBook?: string;
    marketName?: string;
  } = {};

  if (allDaysMandatory !== oldAllDaysMandatory) {
    changes.allDaysMandatory = allDaysMandatory;
  }

  if (lastDayToBook !== oldLastDayToBook) {
    changes.lastDayToBook = lastDayToBook;
  }

  if (marketName !== oldMarketName) {
    changes.marketName = marketName;
  }

  if (Object.keys(changes).length > 0) {
    try {
      await sanityWriteClient.patch(marketId).set(changes).commit();
      
      revalidatePath("/dashboard/", "layout");
      revalidatePath("/admin/dashboard/", "layout");
      
      return {
        errors: null,
        success: true,
      };
    } catch (error) {
      console.error(error)
      return {
        success: false,
        errors: ["something went wrong"]
      }
    }
  }

  return {
    errors: ["Something went wrong"],
    success: false,
  };
};

const formSchema = z.object({
  allDaysMandatory: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v === "on"),
  marketId: z.string(),
  marketName: z.string().transform((v) => v.trim()),
  lastDayToBook: z.string(),
  oldAllDaysMandatory: z.string().transform((v) => v === "true"),
  oldMarketName: z.string(),
  oldLastDayToBook: z.string(),
});
