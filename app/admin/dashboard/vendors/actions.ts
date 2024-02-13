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


  // console.log( parsedVendorId.data)
  if (!parsedVendorId.success) {
    return {
      error: parsedVendorId.error
    }

  }

  const user = await sanityWriteClient.fetch(`*[_type == "user" && _id == $vendorId][0]`, {vendorId: parsedVendorId.data});
  // console.log({user})
  
  const approvedUser = {
    ...user,
    status: "approved"
  }
  const sanityRes = await sanityWriteClient.createOrReplace(approvedUser);
  
  revalidatePath("/admin/dashboard/vendors")
  revalidatePath("/dashboard/explore")

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
    status: "pending"
  }
  const sanityRes = await sanityWriteClient.createOrReplace(approvedUser);
  
  
  revalidatePath("/admin/dashboard/vendors")


  return {
    success: "success"
  }

}