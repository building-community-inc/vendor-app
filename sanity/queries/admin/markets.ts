import { sanityClient } from "@/sanity/lib/client";
import { zodMarketFormSchema } from "@/zod/markets";
import { z } from "zod";

const marketQueryString = `
  _id,
  name,
  description,
  price,
  dates,
  "marketCover": marketCover.asset->url,
  "venue": venue->{
    title,
    address,  
    city,
    securityPhone,
    hours,
    phone,
    loadInInstructions,
    _id,
    "venueMap": venueMap.asset->url,
    tables
  },
`;

const zodMarketQuery = z.array(
  zodMarketFormSchema.merge(
    z.object({
      _id: z.string(),
      marketCover: z.string(),
      venue: z.object({
        _id: z.string(),
        title: z.string(),
        address: z.string(),
        city: z.string(),
        securityPhone: z.string(),
        hours: z.string(),
        phone: z.string(),
        loadInInstructions: z.string(),
        venueMap: z.string(),
        tables: z.array(z.string()),
      }),
    })
  )
);
export const getAllMarkets = async () => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == 'market']{
      ${marketQueryString}
      }`
    );

    const parsedResult = zodMarketQuery.safeParse(result);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error.message);
    }

    return parsedResult.data;
    
  } catch (error) {
    console.error(error);
  }
};
``;
