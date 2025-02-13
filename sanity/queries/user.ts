import { sanityClient } from "@/sanity/lib/client";
import { zodUserWithOptionalBusinessRef } from "@/zod/user-business";
import { redirect } from "next/navigation";
import { z } from "zod";

export const userQueryString = `
  _id,
  _type,
  email,
  firstName,
  lastName,
  hasImage,
  image,
  role,
  status,
  acceptedTerms,
  business->{
      _id,
      _type,
      businessName,
      address1,
      address2,
      city,
      province,
      postalCode,
      country,
      phone,
      instagramHandle,
      industry,
      logo,
      "logoUrl": logo.asset->url,
      "pdfs": pdf[] {
          "url": asset -> url,
          "originalFileName": asset -> originalFilename,
          "_id": asset -> _id,
          "size": asset -> size,
      },
  },
  credits
        `;
export const getSanityUserByEmail = async (email: string) => {
  const user =
    await sanityClient.fetch(`*[_type == 'user' && email == '${email}'][0]{
     ${userQueryString}
    }`);

  const validatedUser = zodUserWithOptionalBusinessRef.safeParse(user);
  if (!validatedUser.success) {
     console.log(new Error(validatedUser.error.message));
    return redirect("/add-user-to-sanity")
  }

  return validatedUser.data;
};

const userMarketQueryString = `
    "amount": amount {
        total,
        paid,
        owed,
        hst  
    },
    "market": market -> {
      name, 
      _id,
      dates
    },
    _id,
    "items": items[] {
        price,
        date,
        tableId
    },
    paymentReturned,
    "payments": payments[] {
      stripePaymentIntentId,
      paymentType,
      amount,
      paymentDate
    }
`;
const zodTableItem = z.object({
  price: z.number(),
  date: z.string(),
  tableId: z.string(),
});

export type TTableItem = z.infer<typeof zodTableItem>;

const zodAmount = z.object({
  total: z.number(),
  paid: z.number(),
  owed: z.number().optional().nullable(),
  hst: z.number(),
});

export type TAmount = z.infer<typeof zodAmount>;

const zodPaymentSchema =  z.object({
  amount: z.number(),
  paymentDate: z.string(),
  stripePaymentIntentId: z.string().optional().nullable(),
})

export type TPayment = z.infer<typeof zodPaymentSchema>;

const zodUserMarket = z.object({
  amount: zodAmount,
  market: z.object({
    name: z.string(),
    dates: z.array(z.string()),
    _id: z.string(),
  }),
  _id: z.string(),
  items: z.array(zodTableItem),
  paymentReturned: z.boolean().optional().nullable(),
  payments: z.array(
    zodPaymentSchema
  ),
});

export type TUserMarket = z.infer<typeof zodUserMarket>;





const zodUserMarkets = z.array(zodUserMarket);

export const getUserPaymentRecords = async (userId: string) => {
  try {
    // const user = await getSanityUserByEmail(email);

    const payments = await sanityClient.fetch(
      `*[_type == "paymentRecord" && user._ref == $userId]{
        ${userMarketQueryString}
      }`,
      { userId }
    );

    const validatedPayments = zodUserMarkets.safeParse(payments);

    if (!validatedPayments.success) {
      throw new Error(validatedPayments.error.message);
    }

    return validatedPayments.data;
  } catch (error) {
    throw console.error(error);
  }
};

const zodPayment = z.object({
  amount: z.number(),
  paymentDate: z.string(),
  stripePaymentIntentId: z.string(),
});

export const zodUserPayment = z.object({
  _id: z.string(),
  createdAt: z.string(),
  items: z.array(
    z.object({
      price: z.number(),
      name: z.string(),
      date: z.string(),
      tableId: z.string(),
    })
  ),
  market: z.object({
    name: z.string(),
    _id: z.string(),
  }),
  payments: z.array(zodPayment),
  amount: z.object({
    total: z.number(),
    paid: z.number(),
    owed: z.number(),
    hst: z.number(),
  }),
});

export type TUserPayment = z.infer<typeof zodUserPayment>;

const zodUserPayments = z.array(zodUserPayment);

export const getAllUserPaymentsById = async (userId: string) => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == 'paymentRecord' && user._ref == $userId]{
        _id,
        createdAt,
        "items": items[] {
          price,
          name,
          date,
          tableId
        },
        "market": market -> {
          name,
          _id
        },
        stripePaymentIntendId,
        "amount": amount {
          total,
          paid,
          owed,
          hst
        },
        "payments": payments[] {
          amount,
          paymentDate,
          stripePaymentIntentId
        }
      }`,
      { userId }
    );

    const validatedResult = zodUserPayments.safeParse(result);

    if (!validatedResult.success) {
      throw new Error(validatedResult.error.message);
    }

    return validatedResult.data;
  } catch (error) {
    console.error(error);
  }
};
