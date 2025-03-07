import { z } from "zod";
import { sanityClient, sanityWriteClient } from "../lib/client";
import { groq } from "next-sanity";

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
      paymentType: z.string().optional().nullable(),
      _key: z.string(),
      paymentDate: z.string(),
      stripePaymentIntentId: z.string().optional().nullable(),
      amount: z.number(),
      _type: z.string(),
    })
  ).optional().nullable(),
  amount: z.object({
    paid: z.number(),
    total: z.number(),
    owed: z.number().optional().nullable(),
    hst: z.number(),
  }),
  marketId: z.string(),
  items: z.array(
    z.object({
      tableId: z.string(),
      date: z.string(),
      price: z.number(),
    })
  ),
  paymentReturned: z.boolean().optional().nullable(),
  status: z.string().optional().nullable(),
});

export const zodPaymentItem = z.object({
  tableId: z.string(),
  date: z.string(),
  price: z.number(),
});

export const zodLatePaymentWithMarketSchema = zodLatePaymentSchema.merge(
  z.object({
    market: z.object({
      name: z.string(),
      _id: z.string(),
      venue: z.object({
        city: z.string(),
        phone: z.string(),
        hours: z.string(),
        address: z.string(),
        title: z.string(),
        loadInInstructions: z.string(),
      }),
    }),
    items: z.array(zodPaymentItem),
  })
);

const paymentQuery = `
  _id,
  "payments": payments [] {
    _key,
    paymentDate,
    stripePaymentIntentId,
    amount,
    _type,
    paymentType
  },
  "amount": amount {
    paid,
    total,
    owed,
    hst
  },
  "marketId": market->_id,
  "items": items[] {
    tableId,
    date,
    price
  },
  paymentReturned,
  status
`;

const paymentQueryWithMarket = groq`
  ${paymentQuery},
  "market": market->{
    name,
    _id,
    "venue": venue->{
      city,
      phone,
      hours,
      address,
      title,
      loadInInstructions
    },
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
    `*[_type == "paymentRecord" && _id match $paymentId][0] {
    ${paymentQuery}
    }`,
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
    `*[_type == "paymentRecord" && _id match $paymentId][0] {
      ${paymentQueryWithMarket}
    }
    `,
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
