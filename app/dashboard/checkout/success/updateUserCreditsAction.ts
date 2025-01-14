"use server";
import { sanityWriteClient } from "@/sanity/lib/client";

export const updateUserCredits = async (creditsLeft: number, userId: string) => {
  try {
    await sanityWriteClient.patch(userId).set({ credits: creditsLeft }).commit();
  } catch (error) {
    console.error(`Failed to update user credits: ${error}`);
    throw new Error(`Failed to update user credits: ${error}`);
  }

};