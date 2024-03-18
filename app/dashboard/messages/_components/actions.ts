"use server";

import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import {
  messageQueryString,
  zodMessage,
} from "@/sanity/queries/admin/messages";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export const setMessageAsRead = async (formData: FormData) => {
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
      status: 404,
      body: "Message not found",
    };

  if (!message.success) {
    console.error(message.error);
    return {
      status: 500,
      body: message.error.message,
    };
  }

  const forObject = message.data.for.find(
    (forObject) => forObject.vendor._id === userId
  );

  if (!forObject) return { status: 404, body: "User not found" };

  const updatedMessage = await sanityWriteClient
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
    .commit()
    .catch((error) => {
      return {
        status: 500,
        body: error.message,
      };
    });

  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard/");
  revalidatePath("admin/dashboard/messages");
  return {
    status: 200,
    body: "Message updated",
  };
  // const updatedMessage = await client
  //   .patch(message._id)
  //   .set({
  //     for: message.for.map((forObject) =>
  //       forObject.vendor._ref === userId
  //         ? { ...forObject, read: true }
  //         : forObject
  //     ),
  //   })
  //   .commit();
  // return updatedMessage;
};
