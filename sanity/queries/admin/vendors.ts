import { sanityClient } from "@/sanity/lib/client";
import { z } from "zod";

const vendorQuery = `
  {
    _id,
    "business": business -> {
      "name": businessName,
      "category": industry,
      "logo": logo.asset->url,
      "address": address1 + " " + coalesce(address2, ""),
      city,
      province,
      postalCode,
      country,
      phone,
      instagramHandle,
      "docs": pdf[] {
        "url": asset->url,
        "name": asset->originalFilename
      }
    },
    firstName, 
    lastName,
    email,
    status,
    acceptedTerms,
    role,
    credits
  }
`;

const zodVendorSchema = z.object({
  _id: z.string(),
  business: z
    .object({
      name: z.string(),
      category: z.string(),
      logo: z.string().optional().nullable(),
      address: z.string(),
      city: z.string(),
      province: z.string(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string(),
      instagramHandle: z.string().optional().nullable(),
      docs: z
        .array(
          z.object({
            url: z.string(),
            name: z.string(),
          })
        )
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  status: z.string(),
  acceptedTerms: z
    .object({
      dateAccepted: z.string().optional().nullable(),
      accepted: z.boolean(),
    })
    .optional()
    .nullable(),
  role: z.string(),
  credits: z.number()
});

export type TVendor =  z.infer<typeof zodVendorSchema>;
const zodVendorsSchema = z.array(zodVendorSchema);

const isDev = process.env.NODE_ENV === "development";

export const getAllVendors = async () => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == "user" ${isDev ? "" : "&& role == 'vendor'"}] ${vendorQuery}`
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
      `*[_type == "user" && _id == $id][0] ${vendorQuery}`,
      { id }
    );

    const parsedVendor = zodVendorSchema.safeParse(result);

    return parsedVendor;

};
