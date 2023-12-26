import { z } from "zod";

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
  // tables: z.array(z.any()).optional(),
});

export const zodVenueFormSchema = zodVenueSchema.merge(
  z.object({
    _type: z.literal("venue"),
    _id: z.string().optional(),
    tables: z.array(z.string()).min(1, "At least one table is required"),
    tableInfo: z.array(z.object({ id: z.string(), price: z.number() })),
  })
);

export const zodSanityVenue = zodVenueFormSchema.merge(
  z.object({
    // _id: z.string().optional(),
    // _type: z.literal("venue"),
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

export const zodSanityUpdateVenue = zodSanityVenue.merge(
  z.object({
    _id: z.string(),
  })
);

export type TVenue = z.infer<typeof zodVenueSchema>;
