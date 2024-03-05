import { sanityClient } from "@/sanity/lib/client";
import { z } from "zod";

const messageQueryString = `
  _id,
  _createdAt,
  body,
  subject,
  from -> {
    _id,
    firstName,
    lastName,
    email,
  },
  "for": for[] {
    vendor->{
      _id,
      firstName,
      lastName,
      email,
    },
    read
  }
`;

const zodMessageQueryArray = z.array(
  z.object({
    _id: z.string(),
    _createdAt: z.string(),
    body: z.string(),
    subject: z.string(),
    from: z.object({
      _id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
    }),
    for: z.array(
      z.object({
        vendor: z.object({
          _id: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
        }),
        read: z.boolean().optional().nullable(),
      })
    ),
  })
);
export const getAllSentMessages = async () => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == 'message']{
        ${messageQueryString}
      }`
    );
    const messages = zodMessageQueryArray.safeParse(result);

    if (!messages.success) {
      throw new Error(messages.error.message);
    }
    return messages.data;
  } catch (error) {
    console.error(error);
  }
};
