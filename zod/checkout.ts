import { z } from "zod";
import { zodMarketWithMarketCoverObjectSchema } from "./markets";
import { zodImageSchema } from "./image";

const zodTableSch = z.object({
  id: z.string(),
  price: z.number(),
})

const zodTableSchema = z.object({
  booked: z.boolean().optional().nullable(),
  table: zodTableSch
});

const zodDateSchema = z.object({
  date: z.string(),
  table: zodTableSchema,
});

export const zodBookMarketWithoutMarketSchema = z.object({
  selectedTables: z.array(zodDateSchema),
  specialRequest: z.string().optional().nullable(),
  totalToPay: z.number(),
});

export type TBookMarketWithoutMarketSchema = z.infer<
  typeof zodBookMarketWithoutMarketSchema
>;

export const zodBookMarketOptionsSchema =
  zodBookMarketWithoutMarketSchema.merge(
    z.object({
      market: z.object({
        name: z.string(),
        description: z.string(),
        dates: z.array(z.string()),
        marketCover: zodImageSchema,
        venue: z.object({
          title: z.string(),
          address: z.string(),
          city: z.string(),
          tableInfo: z.array(
            z.object({
              id: z.string(),
              price: z.number(),
            })
          ),
          venueMap: zodImageSchema,
          securityPhone: z.string(),
          hours: z.string(),
          phone: z.string(),
          loadInInstructions: z.string(),
        }),
        _id: z.string(),
        vendors: z.array(z.any()).optional().nullable(),
        daysWithTables: z.array(z.object({
          date: z.string(),
          tables: z.array(zodTableSchema),
        })),
      }),
    })
  );

export type TBookMarketOptionsSchema = z.infer<
  typeof zodBookMarketOptionsSchema
>;
