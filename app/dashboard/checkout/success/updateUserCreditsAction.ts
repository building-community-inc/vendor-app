"use server";
import { sanityWriteClient } from "@/sanity/lib/client";

export const updateUserCredits = async (creditsLeft: number, userId: string) => {
  try {
    const formattedCreditsLeft = parseFloat(creditsLeft.toFixed(2));
    await sanityWriteClient.patch(userId).set({ credits: formattedCreditsLeft }).commit();
  } catch (error) {
    console.error(`Failed to update user credits: ${error}`);
    throw new Error(`Failed to update user credits: ${error}`);
  }
};