import { z } from "zod";
import { zodVenueWithVenueMapAsImage } from "./venues";

const zodDaySchema = z.string();

export const zodMarketFormSchema = z.object({
  name: z.string().min(1, "Name of the Market is required"),
  // description: z.string().min(1, "Description of the Market is required"),
  vendorInstructions: z.string().optional().nullable(),
  dates: z.array(zodDaySchema).min(1, "At least one day is required"),
  marketCover: z
    .string()
    .optional()
    .transform((refId) => ({ _type: "image", asset: { _ref: refId } })),
  venue: z
    .object({
      _ref: z.string(),
    })
    .optional(),
  cancelled: z.boolean().optional().nullable(),
  archived: z.boolean().optional().nullable(),
  allDaysMandatory: z.boolean().optional().nullable()
});

export const sanityZodMarketFormSchema = zodMarketFormSchema.merge(
  z.object({
    _type: z.literal("market"),
    _id: z.string().optional(),
    daysWithTables: z.array(
      z.object({
        date: z.string(),
        _key: z.string(),
        tables: z.array(
          z.object({
            table: z.object({
              _key: z.string(),
              id: z.string(),
              price: z.number(),
            }),
            _key: z.string(),
            booked: z
              .object({
                _ref: z.string().optional().nullable(),
              })
              .optional()
              .nullable(),
          })
        ),
      })
    ),
  })
);

export const zodMarketWithVendorsSchema = sanityZodMarketFormSchema.merge(
  z.object({
    vendors: z.array(z.any()).optional().nullable(),
  })
);

export const zodMarketWithMarketCoverObjectSchema =
  zodMarketWithVendorsSchema.merge(
    z.object({
      marketCover: z.any().optional().nullable(),
      venue: zodVenueWithVenueMapAsImage,
    })
  );

export type TMarketFormSchema = z.infer<typeof zodMarketFormSchema>;
