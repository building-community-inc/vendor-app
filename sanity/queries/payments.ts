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
  payments: z.array(z.object({
    _key: z.string(),
    paymentDate: z.string(),
    stripePaymentIntentId: z.string(),
    amount: z.number(),
    _type: z.string()
  })),
  amount: z.object({
    paid: z.number(),
    total: z.number(),
    owed: z.number()
  })
})

export type TLatePaymentSchema = z.infer<typeof zodLatePaymentSchema>;
export const getPaymentById = async (paymentId: string) => {
  const result = await sanityClient.fetch(
    `*[_type == "paymentRecord" && _id match $paymentId][0]{
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
        owed
      }
    }`,
    { paymentId }
  );

  const parsedResult = zodLatePaymentSchema.safeParse(result);

  if (!parsedResult.success) {
    throw new Error(parsedResult.error.message);
  }


  return parsedResult.data;
};


export const getAllExistingPayment = async () => {
  const result = await sanityClient.fetch(
    '*[_type == "paymentRecord"]'
  );

  return result;
}