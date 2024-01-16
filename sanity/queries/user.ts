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
            "logoUrl": logo.asset->url,
            "pdfs": pdf[] {
                "url": asset -> url,
                "name": asset -> originalFilename
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
    stripePaymentIntendId,
    status,
    "market": market -> name,
    _id,
    "items": items[] {
        price,
        name,
        date,
        tableId
    }
`;

const zodUserMarket = z.object({
  amount: z.number(),
  stripePaymentIntendId: z.string(),
  status: z.string(),
  market: z.string(),
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
      `*[_type == "payment" && user._ref == $userId && status == "succeeded"]{
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
