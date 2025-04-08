"use server";

import { FormState } from "@/app/types";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import {
  messageQueryString,
  zodMessage,
} from "@/sanity/queries/admin/messages";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export const setMessageAsRead = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const messageId = formData.get("messageId");
  const userId = formData.get("userId");

  const result = await sanityClient.fetch(
    `*[_type == "message" && _id == $messageId][0]{
      ${messageQueryString}
    }`,
    { messageId }
  );

  const message = zodMessage.safeParse(result);

  if (!message)
    return {
      success: false,
      errors: ["Message not found"],
    };

  if (!message.success) {
    console.error(message.error);
    return {
      success: false,
      errors: message.error.issues.map((issue) => issue.message),
    };
  }

  const forObject = message.data.for.find(
    (forObject) => forObject.vendor._id === userId
  );

  if (!forObject)
    return {
      success: false,
      errors: ["User not found"],
    };
  try {
    await sanityWriteClient
      .patch(message.data._id)
      .set({
        for: message.data.for.map((forObject) =>
          forObject.vendor._id === userId
            ? {
                _key: nanoid(),
                vendor: {
                  _type: "reference",
                  _ref: forObject.vendor._id,
                },
                read: true,
              }
            : {
                _key: nanoid(),
                vendor: {
                  _type: "reference",
                  _ref: forObject.vendor._id,
                },
                read: forObject.read,
              }
        ),
      })
      .commit();

    revalidatePath("/dashboard/", "layout");
    revalidatePath("/admin/dashboard/", "layout");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating or replacing user:", error);
    return {
      success: false,
      errors: ["Error creating or replacing user"],
    };
  }
};
