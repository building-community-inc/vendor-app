import { zodVendorSchema } from "@/sanity/queries/admin/markets/zods";
import { nanoid } from "nanoid";
import { z } from "zod";

export const tableSchema = z.object({
  id: z.string(),
  price: z.number(),
});

export const zodRefObject = z.object({
  _type: z.literal("reference"),
  _ref: z.string(),
  _key: z.string().optional().nullable(),
});

// type TSanityReference = z.infer<typeof zodRefObject>;

export const tableObjectSchema = z.object({
  table: tableSchema,
  booked: zodRefObject.optional().nullable(),
});

export const daySchema = z.object({
  _key: z.string(),
  date: z.string(),
  tables: z.array(tableObjectSchema),
});

export type TDaySchema = z.infer<typeof daySchema>;

export const rawDataParser = z.object({
  date: z.string().min(4, "Something went wrong with the date"),
  vendorIds: z.array(z.string()),
  tableSelections: z.array(z.string()),
  marketId: z.string(),
  deletedVendors: z
    .array(
      z
        .string()
        .transform((str) => JSON.parse(str))
        .refine(
          (vendor) => zodVendorSchema.safeParse(vendor).success,
          "Invalid vendor object"
        )
    )
    .optional()
    .nullable(),
});


export const zodSanityMarket = z.object({
  _id: z.string(),
  daysWithTables: z.array(
    z.object({
      _key: z.string().default(() => nanoid()),
      date: z.string(),
      tables: z.array(
        z.object({
          _key: z.string().default(() => nanoid()),
          table: z.object({
            id: z.string(),
            price: z.number(),
          }),
          booked: zodRefObject.optional().nullable(),
        })
      ),
    })
  ),
  vendors: z.array(
    z.object({
      vendor: z.object({
        _ref: z.string(),
        _type: z.string(),
      }),
      _key: z.string().default(() => nanoid()),
      datesBooked: z.array(
        z.object({
          _key: z.string().default(() => nanoid()),
          date: z.string(),
          tableId: z.string(),
          _type: z.string(),
        })
      ),
    })
  ),
});
