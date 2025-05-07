import { sanityClient } from "@/sanity/lib/client";
import { z } from "zod";

const zodPaymentSchema = z.object({
  _id: z.string(),
  market: z.object({
    _id: z.string(),
    name: z.string(),
    dates: z.array(z.string()),
  }),
  amount: z.object({
    total: z.number(),
    paid: z.number(),
    owed: z.number().optional().nullable(),
    hst: z.number(),
  }),
  vendor: z.object({
    _id: z.string(),
    businessName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    status: z.string(),
    acceptedTerms: z.boolean().optional().nullable(),
    credits: z.number().nullable().default(0),
  }),
  items: z.array(
    z.object({
      date: z.string(),
      price: z.number(),
      tableId: z.string(),
    })
  ),
  paymentReturned: z.boolean().optional().nullable(),
  status: z.string().optional().nullable(),
  payments: z.array(
    z.object({
      stripePaymentIntentId: z.string().optional().nullable(),
      amount: z.number(),
      paymentDate: z.string(),
      paymentType: z.string().optional().nullable(),
    })
  ),
  createdAt: z.string(),
});

export type TPayment = z.infer<typeof zodPaymentSchema>;

const zodPaymentsSchema = z.array(zodPaymentSchema);

export const getAllPayments = async () => {
  try {
    const res = await sanityClient.fetch(
      `*[_type == "paymentRecord"]{
        _id,
        market->{
          _id,
          name,
          dates
        },
        "amount": amount {
          total,
          paid,
          owed,
          hst
        },
        "payments": payments [] {
          stripePaymentIntentId,
          amount,
          paymentDate,
          paymentType
        },
        "vendor": user->{
          _id,
          "businessName":  business->businessName,
          firstName, 
          lastName,
          email,
          status,
          "acceptedTerms": acceptedTerms.accepted,
          credits
        },
        "items": items[] {
          date,
          price,
          tableId
        },
        paymentReturned,
        status,
        "createdAt": _createdAt

      }`
    );
    const parsedPayments = zodPaymentsSchema.safeParse(res);

    if (!parsedPayments.success) {
      throw new Error(parsedPayments.error.message);
    }

    return parsedPayments.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllPaymentsForAMarket = async (marketId: string) => {
  try {
    const res = await sanityClient.fetch(
      `*[_type == "paymentRecord" && market._ref == "${marketId}"]{
        _id,
        market->{
          _id,
          name,
          dates
        },
        "amount": amount {
          total,
          paid,
          owed,
          hst
        },
        "payments": payments [] {
          stripePaymentIntentId,
          amount,
          paymentDate
        },
        "vendor": user->{
          _id,
          "businessName":  business->businessName,
          firstName, 
          lastName,
          email,
          status,
          "acceptedTerms": acceptedTerms.accepted,
          credits
        },
        "items": items[] {
          date,
          price,
          tableId
        },
        paymentReturned
      }`
    );

    const parsedPayments = zodPaymentsSchema.safeParse(res);

    if (!parsedPayments.success) {
      throw new Error(parsedPayments.error.message);
    }

    return parsedPayments.data;
  } catch (error) {
    console.error(error);
  }
};
