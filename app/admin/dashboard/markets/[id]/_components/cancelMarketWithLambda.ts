"use server";

import { getAllPaymentsForAMarket } from "@/sanity/queries/admin/payments";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// const LAMBDA_URL = "http://127.0.0.1:3000/cancel-market";
const LAMBDA_URL = "https://jjk7u6hh6rd67cfke6jjp4hdpy0ityrx.lambda-url.us-east-1.on.aws/cancel-market";



const LAMBDA_CREDENTIAL = process.env.LAMBDA_CREDENTIAL;

export const cancelMarketWithLambda = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return {
      errors: ["User not found"],
      success: false,
    };
  }

  const marketId = formData.get("marketId") as string;
  const url = formData.get("url") as string;

  if (!marketId) {
    return {
      errors: ["Market ID is required"],
      success: false,
    };
  }
  console.log("cancelling market", marketId);

  const paymentRecords = await getAllPaymentsForAMarket(marketId);
  if (!paymentRecords) {
    return {
      success: false,
      errors: ["Error finding payment records"],
    };
  }

  try {
    const raw = JSON.stringify({
      marketId,
      paymentRecords,
      url,
      userId: clerkUser.id,
      "Sprain1-Hunchback-Deserve": LAMBDA_CREDENTIAL
    });
    const response = await fetch(
      LAMBDA_URL,
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        mode: "no-cors",
      }
    );

    const result = await response.json();

    revalidatePath("/admin/dashboard/", "layout");
    revalidatePath("/dashboard/", "layout");
    return result;
  } catch (error) {
    console.error(error);
    return {
      errors: ["something went wrong"],
      success: false,
    };
  }
};
