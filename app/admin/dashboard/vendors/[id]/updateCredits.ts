"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { object, pipe, safeParse, string, transform } from "valibot";

const creditSchema = pipe(
  string(),
  transform((input) => {
    const num = Number(input);
    if (isNaN(num)) {
      throw new Error("Invalid number");
    }
    return num;
  })
);

const dataValidator = object({
  newCredits: creditSchema,
  oldCredits: creditSchema,
  userId: string(),
});

export const updateCredits = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return {
      success: false,
      errors: ["You are not authorized to perform this action"],

      
    };
  }

  const sanityUser = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (sanityUser.role !== "admin") {
    return {
      success: false,
      errors: ["You are not authorized to perform this action"],
    };
  }

  const newCredits = formData.get("newCredits") as string;
  const oldCredits = formData.get("oldCredits") as string;
  const userId = formData.get("userId") as string;

  if (!newCredits || !oldCredits || !userId) {
    return {
      success: false,
      errors: ["Missing required fields"],
    };
  }

  if (newCredits === oldCredits) {
    return {
      success: false,
      errors: ["New credits are the same as old credits"],
    };
  }

  try {
    const result = safeParse(dataValidator, { newCredits, oldCredits, userId });
    if (!result.success) {
      const errors = result.issues.map(
        (error) => `${error.path?.join(".")}: ${error.message}`
      );
      return {
        success: false,
        errors,
      };
    }

    await sanityWriteClient
      .patch(userId)
      .set({ credits: result.output.newCredits })
      .commit();

    revalidatePath(`/admin/dashboard/vendors/${userId}/`);
    revalidatePath(`/admin/dashboard/vendors/`);
    revalidatePath(`/dashboard`);

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: [error.message || "An unknown error occurred"],
      };
    } else {
      return {
        success: false,
        errors: ["An unknown error occurred"],
      };
    }
  }
};
