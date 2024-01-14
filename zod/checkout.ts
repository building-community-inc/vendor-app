import { z } from "zod";
import { zodMarketWithVendorsSchema } from "./markets";

const zodTableSchema = z.object({
  booked: z.boolean().optional().nullable(),
  table: z.object({
    id: z.string(),
    price: z.number(),
  }),
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

export type TBookMarketWithoutMarketSchema = z.infer<typeof zodBookMarketWithoutMarketSchema>;

export const zodBookMarketOptionsSchema =
  zodBookMarketWithoutMarketSchema.merge(
    z.object({
      market: zodMarketWithVendorsSchema,
    })
  );

export type TBookMarketOptionsSchema = z.infer<
  typeof zodBookMarketOptionsSchema
>;
