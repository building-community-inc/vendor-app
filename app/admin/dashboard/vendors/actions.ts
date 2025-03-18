"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const zodVendorId = z.string();

export const approveVendor = async(formData: FormData) => {
  const vendorId = formData.get("vendorId");

  if (!vendorId) {
    return {
      error: "no vendorId"
    }
  }

  const parsedVendorId = zodVendorId.safeParse(vendorId);


  if (!parsedVendorId.success) {
    return {
      error: parsedVendorId.error
    }

  }

  const user = await sanityWriteClient.fetch(`*[_type == "user" && _id == $vendorId][0]`, {vendorId: parsedVendorId.data});
  
  const approvedUser = {
    ...user,
    status: "approved"
  }
  const sanityRes = await sanityWriteClient.createOrReplace(approvedUser);
  
  revalidatePath("/admin/dashboard", "layout")
  revalidatePath("/dashboard/", "layout")

  return {
    success: "success"
  }

}
export const disapproveVendor = async(formData: FormData) => {
  const vendorId = formData.get("vendorId");

  if (!vendorId) {
    return {
      error: "no vendorId"
    }
  }

  const parsedVendorId = zodVendorId.safeParse(vendorId);


  if (!parsedVendorId.success) {
    return {
      error: parsedVendorId.error
    }

  }

  const user = await sanityWriteClient.fetch(`*[_type == "user" && _id == $vendorId][0]`, {vendorId: parsedVendorId.data});
  
  const approvedUser = {
    ...user,
    status: "archived"
  }
  const sanityRes = await sanityWriteClient.createOrReplace(approvedUser);
  
  
  revalidatePath("/admin/dashboard/" , "layout")
  revalidatePath("/dashboard/", "layout")


  return {
    success: "success"
  }

}

export const setUserStatus = async function (formData: FormData) {
  const vendorId = formData.get("vendorId");
  const status = formData.get("status");

  if (!status) {
    return {
      error: "no status"
    }
  }

  if (!vendorId) {
    return {
      error: "no vendorId"
    }
  }

  const parsedVendorId = zodVendorId.safeParse(vendorId);

  if (!parsedVendorId.success) {
    return {
      error: parsedVendorId.error
    }
  }

  const user = await sanityWriteClient.fetch(`*[_type == "user" && _id == $vendorId][0]`, {vendorId: parsedVendorId.data});

  const updatedUser = {
    ...user,
    status: status
  }
  const sanityRes = await sanityWriteClient.createOrReplace(updatedUser);

  revalidatePath("/admin/dashboard/", "layout")
  revalidatePath("/dashboard/", "layout")

  return {
    success: "success"
  }
}