import { z } from "zod";
import { zodImageSchema } from "./image";

export const zodVenueSchema = z.object({
  title: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  hours: z.string().min(1, "Hours are required"),
  phone: z.string().min(1, "Phone is required"),
  securityPhone: z.string().min(1, "Security Phone is required"),
  loadInInstructions: z.string().min(1, "Load In Instructions are required"),
  venueMap: z
    .string()
    .optional()
    .transform((refId) => ({ _type: "image", asset: { _ref: refId } })),
});

const zodTableSchema = z.object({
  id: z.string(),
  price: z.number(),
  _key: z.string(),
});

export const zodVenueFormSchema = zodVenueSchema.merge(
  z.object({
    _type: z.literal("venue"),
    _id: z.string().optional(),
    tableInfo: z.array(zodTableSchema).min(1, "At least one table is required"),
  })
);

export const zodSanityVenue = zodVenueFormSchema.merge(
  z.object({
    venueMap: z.object({
      _type: z.literal("image"),
      asset: z
        .object({
          _ref: z.string(),
        })
        .optional(),
    }),
  })
);


export const zodVenueWithVenueMapAsImage = zodVenueSchema.merge(z.object({
  venueMap: zodImageSchema
}))

export const zodSanityUpdateVenue = zodSanityVenue.merge(
  z.object({
    _id: z.string(),
  })
);

export type TVenue = z.infer<typeof zodVenueSchema>;
