import { z } from "zod";
import { zodMarketWithMarketCoverObjectSchema } from "./markets";
import { zodImageSchema } from "./image";

const zodTableSch = z.object({
  id: z.string(),
  price: z.number(),
});

const zodTableSchema = z.object({
  booked: z.boolean().optional().nullable(),
  table: zodTableSch,
});

const zodDateSchema = z.object({
  date: z.string(),
  table: zodTableSchema,
});

export const zodBookMarketWithoutMarketSchema = z.object({
  selectedTables: z.array(zodDateSchema),
  specialRequest: z.string().optional().nullable(),
  totalToPay: z.number(),
  dueNow: z.number(),
});

export type TBookMarketWithoutMarketSchema = z.infer<
  typeof zodBookMarketWithoutMarketSchema
>;
export const zodShortMarketSchema = z.object({
  _id: z.string(),
  name: z.string(),
  venue: z.object({
    title: z.string(),
    address: z.string(),
    city: z.string(),
    phone: z.string().optional().nullable(),
  }),
});
export type TShortMarketSchema = z.infer<typeof zodShortMarketSchema>;
export const zodBookMarketOptionsSchema =
  zodBookMarketWithoutMarketSchema.merge(
    z.object({
      market: zodShortMarketSchema,
    })
  );

export type TBookMarketOptionsSchema = z.infer<
  typeof zodBookMarketOptionsSchema
>;

export const zodCheckoutStateSchema = z.object({
  items: z
    .array(
      z.object({
        price: z.number(),
        tableId: z.string(),
        name: z.string(),
        date: z.string(),
      })
    )
    .optional()
    .nullable(),
  market: zodShortMarketSchema.optional().nullable(),
  paymentType: z.enum(["full", "partial"]).optional().nullable(),
  price: z.number(),
  creditsApplied: z.number().optional().nullable(),
  depositAmount: z.number(),
  hst: z.number(),
  totalToPay: z.number(),
  specialRequest: z.string().optional().nullable(),
  previousPayment: z.number().optional().nullable(),
});

export const zodCheckoutStateSchemaRequired = z
  .object({
    items: z.array(
      z.object({
        price: z.number(),
        tableId: z.string(),
        name: z.string(),
        date: z.string(),
      })
    ),
    paymentType: z.enum(["full", "partial"]),
    market: zodShortMarketSchema,
    price: z.number(),
    creditsApplied: z.number().optional().nullable(),
    depositAmount: z.number(),
    hst: z.number(),
    totalToPay: z.number(),
    specialRequest: z.string().optional().nullable(),
    previousPayment: z.number().optional().nullable(),
  })
  // .refine(
  //   (data) => {
  //     const itemsTotal =
  //       data.items?.reduce((total, item) => total + item.price, 0) || 0;

  //     const credits = data.creditsApplied || 0;
  //     const hst = data.hst || 0;

  //     const totalWithExtras = itemsTotal - credits + hst;


  //     if (data.paymentType === "full") {
  //       return data.totalToPay === totalWithExtras;
  //     // } else if (data.paymentType === "partial") {
  //     //   const totalToPay = data.previousPayment
  //     //     ? totalWithExtras - data.previousPayment
  //     //     : (data.items?.length || 0) * 50 - credits + hst;
  //     //   return data.totalToPay === totalToPay;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "Total to pay or due now does not match the expected amount",
  //     path: ["totalToPay", "dueNow"],
  //   }
  // );

export const zodPaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  metadata: z.object({
    items: z.string(),
    userEmail: z.string(),
    business: z.string().optional(),
    specialRequest: z.string(),
    marketId: z.string(),
    amountOwing: z.number(),
    totalToPay: z.number(),
    paidNow: z.number(),
    previousPayment: z.number().optional(),
    paymentType: z.enum(["full", "partial"]),
    hst: z.number(),
    dueNowWithHst: z.number(),
  }),
});

export const zodLaterPaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  metadata: z.object({
    items: z.string(),
    userEmail: z.string(),
    business: z.string().optional(),
    marketId: z.string(),
    amountOwing: z.number(),
    hstPaid: z.number(),
    paymentType: z.enum(["full", "partial"]),
  }),
});
