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
    tables
  },
`;

const individualMarketQueryString = `
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
    tables,
    "venueMap": venueMap.asset->url
  },
`;
const zodMarketQuery = zodMarketFormSchema.merge(
  z.object({
    _id: z.string(),
    marketCover: z.string(),
    venue: z.object({
      title: z.string(),
      address: z.string(),
      city: z.string(),
      tables: z.array(z.string()),
      venueMap: z.string().optional(),
    }),
  })
);
export type TSanityMarket = z.infer<typeof zodMarketQuery>;

const zodMarketQueryArray = z.array(zodMarketQuery);
export const getAllMarkets = async () => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == 'market']{
        ${marketQueryString}
      }`
    );

    const parsedResult = zodMarketQueryArray.safeParse(result);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error.message);
    }

    return parsedResult.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMarketById = async (id: string) => {
  try {
    const result = await sanityClient.fetch(
      `*[_type == 'market' && _id == $id]{
      ${individualMarketQueryString}
      }`,
      { id }
    );

    const parsedResult = zodMarketQuery.safeParse(result[0]);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error.message);
    }

    return parsedResult.data;
  } catch (error) {
    console.error(error);
  }
};
