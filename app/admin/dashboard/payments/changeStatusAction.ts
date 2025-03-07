"use server";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type FormState = {
  success: false;
  errors: string[] | undefined;
} | {
  success: true;
  errors: undefined;
};
export const changeStatusAction = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      errors: ["Unauthorized"],
    };
  }

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) {
    return {
      success: false,
      errors: ["Unauthorized"],
    };
  }

  const rawData = {
    paymentRecordId: formData.get("paymentRecordId"),
    newStatus: formData.get("newStatus"),
  };

  const { success, data, error } = formSchema.safeParse(rawData);

  if (!success) {
    console.log(error.formErrors.fieldErrors);
    return {
      success: false,
      errors: ["something went wrong!"],
    };
  }

  const paymentRecordDocument = await sanityClient.getDocument(
    data.paymentRecordId
  );

  if (!paymentRecordDocument) {
    return {
      success: false,
      errors: ["Payment record not found"],
    };
  }

  try {
    await sanityWriteClient
      .patch(paymentRecordDocument._id)
      .set({
        status: data.newStatus,
      })
      .commit();
    revalidatePath("/admin/dashboard/", "layout");
    revalidatePath("/dashboard/", "layout");

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      errors: ["Something went wrong"],
    };
  }
};

const formSchema = z.object({
  paymentRecordId: z.string().min(1),
  newStatus: z.string().min(1),
});
