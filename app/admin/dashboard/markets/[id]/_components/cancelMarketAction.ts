"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getAllPaymentsForAMarket } from "@/sanity/queries/admin/payments";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";

export const cancelMarket = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const marketId = formData.get("marketId") as string;

  console.log("cancelling market", marketId);

  if (!marketId) {
    return {
      errors: ["Market ID is required"],
      success: false,
    };
  }
  try {
    
    // find payment records to update
    
    const paymentRecords = await getAllPaymentsForAMarket(marketId);
    if (!paymentRecords) {
      return {
        success: false,
        errors: ["Error finding payment records"],
      };
    }
    
    console.log({paymentRecords})
    // TODO add anotation to payment records  Add Credits back to all the users of the market

    for (const paymentRecord of paymentRecords) {
      try {
        const vendor = await sanityWriteClient.fetch(
          `*[_type == "user" && _id == $vendorId][0]`,
          { vendorId: paymentRecord.vendor._id }
        );
  
        // Add the payment value to the vendor's credits
  
        const updatedUserCredits =
          Number(vendor.credits) +
          (paymentRecord.amount.paid);
        // add payment value to credits
  
        await sanityWriteClient
          .patch(vendor._id)
          .set({ credits: updatedUserCredits })
          .commit();
  
        await sanityWriteClient
          .patch(paymentRecord._id)
          .set({ paymentReturned: true })
          .commit();
  
        // add the transaction to the credit transactions array
        await sanityWriteClient
          .create({
            _type: "creditTransaction",
            date: DateTime.now().toISO(), // Use the current date or the date of the transaction
            market: { _ref: marketId, _type: "reference" }, // Reference to the market
            vendor: { _ref: vendor._id, _type: "reference" }, // Reference to the vendor
            amount: updatedUserCredits, // The amount of the transaction
            reason: "Payment returned by admin", // The reason for the transaction
          })
          .catch((err) => console.error(err));
      } catch (err) {
        return {
          success: false,
          errors: ["Error updating payment record"]
        };
      }
    }
    
    

    // add the cancelled market flag to the market

    await addCancelFlagToMarket(marketId);

    // TODO notify the users a market has been cancelled and the credits have been added to their accounts

    revalidatePath("/admin/dashboard/markets");
    revalidatePath("/admin/dashboard/markets/[id]");
    revalidatePath("/dashboard/markets");
    revalidatePath("/dashboard/markets[id]");
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return {
      errors: [JSON.stringify(error, null, 2)],
      success: false,
    };
  }
};

const addCancelFlagToMarket = async (marketId: string) => {
  try {
    await sanityWriteClient
      .patch(marketId) // Specify the document ID
      .set({ cancelled: true }) // Set the `cancelled` field to true
      .commit(); // Commit the changes to apply the update

    console.log(`Market ${marketId} has been marked as cancelled.`);
  } catch (error) {
    console.error("Failed to update the market:", error);
  }
};

const addCreditsToUser = async (userId: string, creditsToAdd: number) => {
  try {
    // Fetch the current user data to get the existing credits
    const userData = await sanityWriteClient.fetch(
      `*[_type == "user" && _id == $userId]{credits}[0]`,
      { userId }
    );

    const currentCredits = userData?.credits || 0; // Assume 0 if null or undefined
    const newCredits = currentCredits + creditsToAdd;

    // Update the user's credits
    await sanityWriteClient
      .patch(userId) // Specify the document ID
      .set({ credits: newCredits }) // Set the new credits amount
      .commit(); // Commit the changes to apply the update

    console.log(
      `Added ${creditsToAdd} credits to user ${userId}. New total: ${newCredits}`
    );
  } catch (error) {
    console.error("Failed to add credits to user:", error);
  }
};
