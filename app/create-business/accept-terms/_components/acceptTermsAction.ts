"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { z } from "zod";

const dataSchema = z.object({
  terms: z.literal("on", {
    errorMap: () => ({ message: "Terms and conditions not accepted!" }),
  }),
})
export const acceptTerms = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const user = await currentUser();

  if (!user) {
    return {
      errors: ["User not found"],
      success: false,
    };
  };

  const sanityUser = await getSanityUserByEmail(user.emailAddresses[0].emailAddress);

  if (!sanityUser) {
    return {
      errors: ["User not found"],
      success: false,
    };
  };

  const parsedData = dataSchema.safeParse({
    terms: formData.get("terms"),
  });
  
  if (!parsedData.success) {
    console.error(parsedData.error);
    return {
      errors: ["Terms not accepted"],
      success: false,
    };
  };

  await sanityWriteClient.patch(sanityUser._id).set({
    acceptTerms: {
      accepted: true,
      dateAccepted: new Date().toISOString(),
    }
  }).commit().then(() => {
    return {
      errors: null,
      success: true,
    };
  }).catch((err) => {
    console.error(err);
    return {
      errors: ["Something went wrong"],
      success: false,
    };
  });

  return {
    errors: ["Something went wrong"],
    success: true,
  };
};