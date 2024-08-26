import { sanityClient } from "@/sanity/lib/client";
import { z } from "zod";
import { userQueryString } from "../user";
import { zodUserWithOptionalBusinessRef } from "@/zod/user-business";


const zodVendorsSchema = z.array(zodUserWithOptionalBusinessRef);

const isDev = process.env.NODE_ENV === "development";

export const getAllVendors = async () => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == "user" ${isDev ? "" : "&& role == 'vendor'"}] {
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
