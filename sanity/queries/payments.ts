import { z } from "zod";
import { sanityClient } from "../lib/client";

export const getExistingPayment = async (paymentIntentId: string) => {
  const result = await sanityClient.fetch(
    '*[_type == "paymentRecord" && payments[].stripePaymentIntentId match $paymentId][0]',
    { paymentId: paymentIntentId }
  );

  return result;
};

export const zodLatePaymentSchema = z.object({
  _id: z.string(),
  payments: z.array(
    z.object({
      paymentType: z.union([z.literal("stripe"), z.literal("cash")]),
      _key: z.string(),
      paymentDate: z.string(),
      stripePaymentIntentId: z.string().optional().nullable(),
      amount: z.number(),
      _type: z.string(),
    })
  ),
  amount: z.object({
    paid: z.number(),
    total: z.number(),
    owed: z.number(),
    hst: z.number(),
  }),
});
export const zodLatePaymentWithMarketSchema = zodLatePaymentSchema.merge(
  z.object({
    market: z.object({
      name: z.string(),
      _id: z.string(),
    }),
    items: z.array(
      z.object({
        tableId: z.string(),
        date: z.string(),
        price: z.number(),
      })
    ),
  })
);

const paymentQuery = `
  _id,
  "payments": payments [] {
    _key,
    paymentDate,
    stripePaymentIntentId,
    amount,
    _type
  },
  "amount": amount {
    paid,
    total,
    owed,
    hst
  },
`;

const paymentQueryWithMarket = `
  ${paymentQuery}
  "market": market->{
    name,
    _id
  },
  "items": items[] {
    tableId,
    date,
    price
  }
`;

export type TLatePaymentSchema = z.infer<typeof zodLatePaymentSchema>;
export const getPaymentById = async (paymentId: string) => {
  const result = await sanityClient.fetch(
    `*[_type == "paymentRecord" && _id match $paymentId][0] {${paymentQuery}}`,
    { paymentId }
  );

  const parsedResult = zodLatePaymentSchema.safeParse(result);

  if (!parsedResult.success) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};
export const getPaymentByIdWithMarket = async (paymentId: string) => {
  const result = await sanityClient.fetch(
    `*[_type == "paymentRecord" && _id match $paymentId][0] {${paymentQueryWithMarket}}`,
    { paymentId }
  );
  const parsedResult = zodLatePaymentWithMarketSchema.safeParse(result);

  if (!parsedResult.success) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const getAllExistingPayment = async () => {
  const result = await sanityClient.fetch('*[_type == "paymentRecord"]');

  return result;
};
