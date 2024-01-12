import { nanoid } from "nanoid";
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
  industry: z.string().min(1, "Industry is required"),

  logo: z
    .string()
    .optional()
    .transform((refId) => ({ _type: "image", asset: { _ref: refId } })),

  pdf: z
    .array(z.string())
    .optional()
    .nullable()
    .transform((refIds) =>
      refIds?.map((refId) => ({
        _type: "file",
        asset: { _ref: refId },
        _key: nanoid(),
      }))
    ),
});

export const zodBusinessForm = zodBusiness.merge(
  z.object({
    _type: z.literal("business"),
  })
);

export const zodSanityBusiness = zodBusiness.merge(
  z.object({
    _type: z.literal("business"),
    logo: z.object({
      _type: z.literal("image"),
      asset: z.object({
        _ref: z.string(),
      }),
    }),
    pdf: z.array(
      z.object({
        _type: z.literal("file"),
        asset: z.object({
          _ref: z.string(),
        }),
        _key: z.string(),
      })
    ),
  })
);
export const zodBusinessQuery = zodBusinessForm.merge(
  z.object({
    logoUrl: z.string().optional().nullable(),
    pdfs: z.array(
      z.object({
        url: z.string(),
        name: z.string(),
      })
    ).optional().nullable(),
  })
);
// export const zodBusinessForm = zodBusiness.merge(
//   z.object({
//     _type: z.literal("business"),
//     logo: z.string().nullable(),
//   })
// );

export type TBusiness = z.infer<typeof zodBusiness>;

export const zodUserWithOptionalBusinessRef = zodUserBase.merge(
  z.object({
    business: zodBusinessQuery.optional().nullable(),
  })
);

export type TUserWithOptionalBusinessRef = z.infer<
  typeof zodUserWithOptionalBusinessRef
>;
