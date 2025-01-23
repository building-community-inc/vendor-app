import { zodImageSchema } from "@/zod/image";
import { zodMarketFormSchema } from "@/zod/markets";
import { z } from "zod";
import { zodLatePaymentWithMarketSchema, zodPaymentItem } from "../../payments";

export const zodTable = z.object({
  id: z.string(),
  price: z.number(),
});

export const zodTableInDay = z.object({
  table: zodTable,
  booked: z.object({
    _type: z.string(),
    _ref: z.string()
  }).optional().nullable(),
});

export const zodSelectedTable = z.object({
  date: z.string(),
  table: zodTable,
});

export type TSelectedTable = z.infer<typeof zodSelectedTable>;

export const zodDayWithTable = z.object({
  date: z.string(),
  tables: z.array(zodTableInDay),
});

export type TDayWithTable = z.infer<typeof zodDayWithTable>;
export type TTable = z.infer<typeof zodTable>;
export type TTableInDay = z.infer<typeof zodTableInDay>;

export const zodDaysWithTables = z.array(zodDayWithTable);

export const zodVendorSchema = z.object({
  vendor: z.object({
    businessName: z.string(),
    businessCategory: z.string(),
    _ref: z.string(),
    _type: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  datesBooked: z.array(
    z.object({
      date: z.string(),
      tableId: z.string(),
    })
  ),
  specialRequests: z.string().optional().nullable(),
});

export type TVendor = z.infer<typeof zodVendorSchema>;

export const zodMarketQuery = zodMarketFormSchema.merge(
  z.object({
    _id: z.string(),
    marketCover: zodImageSchema,
    venue: z.object({
      title: z.string(),
      address: z.string(),
      city: z.string(),
      tableInfo: z.array(zodTable),
      venueMap: zodImageSchema.optional(),
      hours: z.string().optional(),
      phone: z.string().optional(),
      securityPhone: z.string().optional(),
      loadInInstructions: z.string().optional().nullable(),
    }),
    vendorInstructions: z.string().optional().nullable(),
    vendors: z.array(zodVendorSchema).optional().nullable(),

    daysWithTables: zodDaysWithTables.optional().nullable(),
  })
);
export type TSanityMarket = z.infer<typeof zodMarketQuery>;

export const zodMarketQueryArray = z.array(zodMarketQuery);


const zodSanityReferenceSchema = z.object({
  _type: z.literal("reference"),
  _ref: z.string(),
  _key: z.string().optional().nullable(),
});

export const zodPaymentRecordSchemaSanityReady = zodLatePaymentWithMarketSchema.merge(
  z.object({
    market: zodSanityReferenceSchema,
    _type: z.literal("paymentRecord"),
    _id: z.string().optional().nullable(),
    user: zodSanityReferenceSchema,
    items: z.array(zodPaymentItem.merge(z.object({ _key: z.string() }))),
    marketId: z.undefined(),
  })
);

export type TPaymentRecord = z.infer<typeof zodPaymentRecordSchemaSanityReady>;

export const zodSanityMarket = z.object({
  _id: z.string(),
  daysWithTables: z.array(
    z.object({
      _key: z.string(),
      date: z.string(),
      tables: z.array(
        z.object({
          booked: zodSanityReferenceSchema.optional().nullable(),
          _key: z.string(),
          table: z.object({
            price: z.number(),
            id: z.string(),
          }),
        })
      ),
    })
  ),
  vendors: z.array(
    z.object({
      datesBooked: z.array(
        z.object({
          date: z.string(),
          _type: z.string(),
          tableId: z.string(),
          _key: z.string(),
        })
      ),
      vendor: zodSanityReferenceSchema,
      _key: z.string(),
    })
  ),
});


export const zodSanityMarketWithOptionalVendors = zodSanityMarket.merge(
  z.object({
    vendors: z
      .array(
        z.object({
          datesBooked: z.array(
            z.object({
              date: z.string(),
              _type: z.string(),
              tableId: z.string(),
              _key: z.string(),
            })
          ),
          vendor: zodSanityReferenceSchema,
          _key: z.string(),
        })
      )
      .optional()
      .nullable(),
  })
);
