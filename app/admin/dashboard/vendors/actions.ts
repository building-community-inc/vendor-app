"use server";

import { FormState } from "@/app/types";
import { sanityWriteClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const zodVendorId = z.string();

export const approveVendor = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const vendorId = formData.get("vendorId");

  if (!vendorId) {
    return {
      success: false,
      errors: ["no vendorId"],
    };
  }

  const parsedVendorId = zodVendorId.safeParse(vendorId);

  if (!parsedVendorId.success) {
    return {
      success: false,
      errors: parsedVendorId.error,
    };
  }

  const user = await sanityWriteClient.fetch(
    `*[_type == "user" && _id == $vendorId][0]`,
    { vendorId: parsedVendorId.data }
  );

  const approvedUser = {
    ...user,
    status: "approved",
  };
  try {
    await sanityWriteClient.createOrReplace(approvedUser);

    revalidatePath("/admin/dashboard", "layout");
    revalidatePath("/dashboard/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating or replacing user:", error);
    return {
      success: false,
      errors: ["Error creating or replacing user"],
    };
  }
};
export const disapproveVendor = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const vendorId = formData.get("vendorId");

  if (!vendorId) {
    return {
      success: false,
      errors: ["no vendorId"],
    };
  }

  const parsedVendorId = zodVendorId.safeParse(vendorId);

  if (!parsedVendorId.success) {
    return {
      success: false,
      errors: parsedVendorId.error,
    };
  }

  const user = await sanityWriteClient.fetch(
    `*[_type == "user" && _id == $vendorId][0]`,
    { vendorId: parsedVendorId.data }
  );

  const approvedUser = {
    ...user,
    status: "archived",
  };

  try {
    await sanityWriteClient.createOrReplace(approvedUser);

    revalidatePath("/admin/dashboard/", "layout");
    revalidatePath("/dashboard/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating or replacing user:", error);
    return {
      success: false,
      errors: ["Error creating or replacing user"],
    };
  }
};

export const setUserStatus = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const vendorId = formData.get("vendorId");
  const status = formData.get("status");

  if (!status) {
    return {
      success: false,
      errors: ["no status"],
    };
  }

  if (!vendorId) {
    return {
      success: false,
      errors: ["no vendorId"],
    };
  }

  const parsedVendorId = zodVendorId.safeParse(vendorId);

  if (!parsedVendorId.success) {
    return {
      success: false,
      errors: parsedVendorId.error,
    };
  }

  const user = await sanityWriteClient.fetch(
    `*[_type == "user" && _id == $vendorId][0]`,
    { vendorId: parsedVendorId.data }
  );

  const updatedUser = {
    ...user,
    status: status,
  };
  try {
    await sanityWriteClient.createOrReplace(updatedUser);

    revalidatePath("/admin/dashboard/", "layout");
    revalidatePath("/dashboard/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating or replacing user:", error);
    return {
      success: false,
      errors: ["Error creating or replacing user"],
    };
  }
};
