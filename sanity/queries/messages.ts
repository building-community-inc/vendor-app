import { sanityClient } from "../lib/client";
import { messageQueryString, zodMessageQueryArray } from "./admin/messages";

export const getAllUserMessagesById = async (userId: string) => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == "message" && $userId in for[].vendor._ref] {
        ${messageQueryString}
      }`,
      { userId }
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
