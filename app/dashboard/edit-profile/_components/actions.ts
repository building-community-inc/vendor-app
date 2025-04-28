"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { zodSanityUpdateBusiness } from "@/zod/user-business";
import { revalidatePath } from "next/cache";
export type TErrorType = {
  message: string;
  path: string[];
};
export const saveNewBusinessInfo = async (
  state: { success: boolean; message: string; errors: {
    message: string;
    path: string[];
  }[] | null },
  formData: FormData
) => {
  const data = {
    _id: formData.get("_id"),
    _type: "business",
    businessName: formData.get("businessName"),
    address1: formData.get("address1"),
    address2: formData.get("address2"),
    phone: formData.get("phone"),
    industry: formData.get("industry"),
    city: formData.get("city"),
    province: formData.get("province"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    instagramHandle: formData.get("instagramHandle"),
    // pdf: formData.getAll("pdfs").map((fileId) => ({
    //   _key: nanoid(),
    //   _type: "file",
    //   asset: {
    //     _ref: fileId,
    //   },
    // })),
    // logo: {
    //   _type: "image",
    //   asset: {
    //     _ref: formData.get("logo"),
    //   },
    // },
  };

  const business = zodSanityUpdateBusiness.safeParse(data);
  if (!business.success) {
    // Parse the error message back into an object
    const errors = JSON.parse(business.error.message);

    // Map over the errors and create a new array of error objects

    // Then use it in your map function
    const formattedErrors = errors.map((error: TErrorType) => ({
      message: error.message,
      path: error.path,
    }));
    return {
      success: false,
      message: "Business info is not valid",
      errors: formattedErrors, // Return the array of formatted errors
    };
  }


  // const sanityBusiness = await getSanityBusinessById(business.data._id);

  const sanityResp = await sanityWriteClient
    .patch(business.data._id)
    .set(business.data)
    .commit();


  revalidatePath("/dashboard", "layout");
  revalidatePath("/admin/dashboard", "layout");

  return {
    success: true,
    message: "Business info saved successfully",
    errors: null,
  };
};
