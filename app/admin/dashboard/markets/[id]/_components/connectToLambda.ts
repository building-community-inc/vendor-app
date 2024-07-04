"use server";

import { getAllPaymentsForAMarket } from "@/sanity/queries/admin/payments";
import { currentUser } from "@clerk/nextjs";

export const connectToLambda = async (
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
    });
    const response = await fetch(
      "https://qzapxnzfyfi4okulacajyqiz6m0wyqyr.lambda-url.us-east-1.on.aws/",
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        mode: "no-cors",
      }
    );

    const result = await response.text();

    console.log(result);

    return {
      success: false,
      errors: null,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: ["something went wrong"],
      success: false,
    };
  }
};
