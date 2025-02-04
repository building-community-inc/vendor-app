import { sanityClient } from "@/sanity/lib/client";
import { individualMarketQueryString, marketQueryString } from "./queryStrings";
import { TSanityMarket, zodMarketQuery, zodMarketQueryArray } from "./zods";

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

const filterCurrentMarkets = (markets: TSanityMarket[]) => {
  const currentDate = new Date().toISOString().split("T")[0];

  return markets.filter(
    (market) =>
      !market.cancelled &&
      market.dates.some((date) => {
        const marketDate = new Date(date);
        return marketDate >= new Date(currentDate);
      })
  );
};

export const getCurrentMarkets = async () => {
  // const currentDate = new Date().toISOString().split("T")[0];
  // console.log({ currentDate });
  try {
    const result = await sanityClient.fetch(
      // `*[_type == 'market' && date >= $currentDate]{
      `*[_type == 'market']{

        ${marketQueryString}
      }`,
      // { currentDate }
    );

    const parsedResult = zodMarketQueryArray.safeParse(result);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error.message);
    }

    return filterCurrentMarkets(parsedResult.data);
  } catch (error) {
    console.error(error);
  }
};

export const findAllVendorsForAMarket = async (marketId: string) => {
  try {
    const market = await getMarketById(marketId);

    if (!market) {
      throw new Error("Market not found");
    }

    if (!market.vendors) {
      throw new Error("No vendors found");
    }

    return market.vendors;
  } catch (error) {
    console.error(error);

    throw new Error(JSON.stringify(error));
  }
};
