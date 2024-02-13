import { sanityClient } from "@/sanity/lib/client";
import { z } from "zod";



const vendorQuery = `
  {
    _id,
    "business": business -> {
      "name": businessName,
      "category": industry,
    },
    firstName, 
    lastName,
    email,
    status,
    acceptedTerms,
  }
`

const zodVendorSchema = z.object({
  _id: z.string(),
  business: z.object({
    name: z.string(),
    category: z.string(),
  }).optional().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  status: z.string(),
  acceptedTerms: z.object({
    dateAccepted: z.string().optional().nullable(),
    accepted: z.boolean(),
  }).optional().nullable(),
});

const zodVendorsSchema = z.array(zodVendorSchema);

export const getAllVendors = async () => {
  try {
    const result = await sanityClient.fetch(`*[_type == "user" && role == "vendor"] ${vendorQuery}`);

    const parsedVendors = zodVendorsSchema.safeParse(result);

    if (!parsedVendors.success) {
      console.log({ error: parsedVendors.error});
      return null;
    }

    return parsedVendors.data;
  } catch (error) {
    console.error(error);
  }
};