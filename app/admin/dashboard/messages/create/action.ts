"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type TCreateMessageFormState = {
  message: string;
  success: boolean;
  errors: null | { message: string; path: (string | number)[] }[];
};

const zodSanityMessageSchema = z.object({
  // _id: z.string(),
  _type: z.literal("message"),
  for: z.array(
    z.object({
      vendor: z.object({
        _ref: z.string().min(1, "User not found"),
        _type: z.literal("reference"),
        _key: z.string().optional(),
      }),
    })
  ),
  from: z.object({
    _ref: z.string(),
    _type: z.literal("reference"),
  }),
  subject: z.string().min(1, "Please enter a subject"),
  body: z.string().min(1, "Please enter a message"),
});

type TSanityMessage = z.infer<typeof zodSanityMessageSchema>;

export const createMessage = async (
  state: TCreateMessageFormState,
  formData: FormData
) => {
  const rawMessage: TSanityMessage = {
    _type: "message",
    for: formData
      .getAll("vendorId")
      .filter((id): id is string => typeof id === "string")
      .map((id) => ({
        vendor: { _ref: id, _type: "reference", _key: nanoid() },
      })),
    from: {
      _ref: formData.get("from") as string,
      _type: "reference",
    },
    subject: formData.get("subject") as string,
    body: formData.get("body") as string,
  };

  const message = zodSanityMessageSchema.safeParse(rawMessage);

  if (!message.success) {
    return {
      message: "Message not sent!",
      success: false,
      errors: message.error.errors.map((error) => ({
        message: error.message,
        path: error.path,
      })),
    };
  }

  // try {
  const sanityResp = await sanityWriteClient.create(message.data).catch((e) => {
    return {
      message: "Message not sent!",
      success: false,
      errors: [{ message: e, path: ["sanity"] }],
    };
  });

  revalidatePath("/admin/dashboard/", "layout");
  revalidatePath("/dashboard/", "layout");

  return {
    message: "Message sent almost.... lol!",
    success: true,
    errors: null,
  };
  // } catch (error) {
  // return {
  //   message: "Message not sent!",
  //   success: false,
  //   errors: [
  //     { message: "something went wrong while sending", path: ["sanity"] },
  //   ],
  // };
  // }
};
