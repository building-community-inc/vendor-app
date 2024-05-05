import { sanityClient } from "@/sanity/lib/client";
import { zodUserWithOptionalBusinessRef } from "@/zod/user-business";
import { z } from "zod";

export const getSanityUserByEmail = async (email: string) => {
  const user =
    await sanityClient.fetch(`*[_type == 'user' && email == '${email}'][0]{
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
        }
    }`);
  
  const validatedUser = zodUserWithOptionalBusinessRef.safeParse(user);
  if (!validatedUser.success) {
    throw new Error(validatedUser.error.message);
  }

  return validatedUser.data;
};

const userMarketQueryString = `
    amount,
    "market": market -> {
      name, 
      _id,
      dates
    },
    _id,
    "items": items[] {
        price,
        name,
        date,
        tableId
    }
`;

const zodUserMarket = z.object({
  amount: z.object({
    total: z.number(),
    paid: z.number(),
    owed: z.number(),
  }),
  market: z.object({
    name: z.string(),
    dates: z.array(z.string()),
    _id: z.string(),
  }),
  _id: z.string(),
  items: z.array(
    z.object({
      price: z.number(),
      name: z.string(),
      date: z.string(),
      tableId: z.string(),
    })
  ),
});

const zodUserMarkets = z.array(zodUserMarket);

export const getUserMarkets = async (userId: string) => {
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
