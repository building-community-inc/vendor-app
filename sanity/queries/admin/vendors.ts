import { sanityClient } from "@/sanity/lib/client";
import { z } from "zod";
import { userQueryString } from "../user";
import { zodUserWithOptionalBusinessRef } from "@/zod/user-business";
import { defineQuery } from "next-sanity";

const zodVendorsSchema = z.array(zodUserWithOptionalBusinessRef);

export const getAllVendors = async () => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == "user"] {
        ${userQueryString}
      }`
    );

    const parsedVendors = zodVendorsSchema.safeParse(result);

    if (!parsedVendors.success) {
      throw new Error(parsedVendors.error.message);
    }

    return parsedVendors.data;
  } catch (error) {
    console.error(error);
  }
};

export const getVendorById = async (id: string) => {
  // try {
  const result = await sanityClient.fetch(
    `*[_type == "user" && _id == $id][0] {
        ${userQueryString}
      }`,
    { id }
  );

  const parsedVendor = zodUserWithOptionalBusinessRef.safeParse(result);

  return parsedVendor;
};

const VENDOR_BUSINESS_NAME_BY_ID_QUERY = defineQuery(`
  *[_type == "user" && _id == $id][0] {
    "businessName": business -> businessName
  }
`);

export const getVendorBusinessNameById = async (id: string) => {
  try {
    const result = await sanityClient.fetch(VENDOR_BUSINESS_NAME_BY_ID_QUERY, {
      id,
    });
    return result?.businessName;
    
  } catch (error) {
    
  }
};
