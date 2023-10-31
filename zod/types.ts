import { z } from "zod";

export const zodUserBase = z.object({
  _type: z.literal("user"),
  _id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  hasImage: z.boolean(),
  image: z.string().nullable(),
  role: z.enum(["admin", "vendor", "dev"]),
});

export type TUserBase = z.infer<typeof zodUserBase>;

export const zodBusiness = z.object({
  businessName: z.string().min(1, "Business name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().nullable(),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone is required"),
  instagramHandle: z.string().nullable(),
  industry: z.string().nullable(),
});

export type TBusiness = z.infer<typeof zodBusiness>;

export const zodUserWithOptionalBusinessRef = zodUserBase.merge(
  z.object({
    business: z.object({
      _ref: z.string(),
      _type: z.literal("reference"),
    }).optional(),
  })
);

export type TUserWithOptionalBusinessRef = z.infer<typeof zodUserWithOptionalBusinessRef>;
