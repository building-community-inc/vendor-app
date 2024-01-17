import { sanityClient } from "@/sanity/lib/client";
import { zodImageSchema } from "@/zod/image";
import { zodMarketFormSchema } from "@/zod/markets";
import { z } from "zod";

const imageQueryString = `{
  "url": asset -> url,
  "dimensions": asset -> metadata.dimensions {
    height,
    width,
    aspectRatio
  }
}
`;

const marketQueryString = `
  _id,
  name,
  description,
  price,
  dates,
  "marketCover": marketCover ${imageQueryString},
  "venue": venue->{
    title,
    address,  
    city,
    tableInfo,
    hours
  },
  "daysWithTables": daysWithTables[] {
    date,

    "tables": tables[] {
      "table": table {
        id,
        price
      },
      available,
      reserved,
      confirmed
    }
  }
`;

const individualMarketQueryString = `
  _id,
  name,
  description,
  price,
  dates,
  "marketCover": marketCover ${imageQueryString},
  "venue": venue->{
    title,
    address,  
    city,
    tableInfo,
    "venueMap": venueMap ${imageQueryString},
    hours,
    phone,
    securityPhone,
    loadInInstructions,
    vendorInstructions
  },
  "vendors": vendors[] {
    "vendor": vendor->{
      "businessName": business -> businessName,
      "businessCategory": business -> industry, 
    },
    "datesBooked": datesBooked[] {
      date, 
      tableId,
    },
    specialRequests
  },
  "daysWithTables": daysWithTables[] {
    date,

    "tables": tables[] {
      "table": table {
        id, 
        price
      },
      booked
    }
  }
`;

const zodTable = z.object({
  id: z.string(),
  price: z.number(),
});

const zodTableInDay = z.object({
  table: zodTable,
  booked: z.object({}).passthrough().optional().nullable(),
});

const zodSelectedTable = z.object({
  date: z.string(),
  table: zodTable,
});

export type TSelectedTable = z.infer<typeof zodSelectedTable>;

const zodDayWithTable = z.object({
  date: z.string(),
  tables: z.array(zodTableInDay),
});

export type TDayWithTable = z.infer<typeof zodDayWithTable>;
export type TTable = z.infer<typeof zodTable>;
export type TTableInDay = z.infer<typeof zodTableInDay>;

const zodDaysWithTables = z.array(zodDayWithTable).optional().nullable();

const zodVendorSchema = z.object({
  vendor: z.object({
    businessName: z.string(),
    businessCategory: z.string(),
  }),
  datesBooked: z.array(
    z.object({
      date: z.string(),
      tableId: z.string(),
    })
  ),
  specialRequests: z.string().optional().nullable(),
});

export type TVendor = z.infer<typeof zodVendorSchema>;

const zodMarketQuery = zodMarketFormSchema.merge(
  z.object({
    _id: z.string(),
    marketCover: zodImageSchema,
    venue: z.object({
      title: z.string(),
      address: z.string(),
      city: z.string(),
      tableInfo: z.array(zodTable),
      venueMap: zodImageSchema.optional(),
      hours: z.string().optional(),
      phone: z.string().optional(),
      securityPhone: z.string().optional(),
      loadInInstructions: z.string().optional().nullable(),
    }),
    vendorInstructions: z.string().optional().nullable(),
    vendors: z.array(zodVendorSchema).optional().nullable(),

    daysWithTables: zodDaysWithTables,
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

const filterCurrentMarkets = (markets: TSanityMarket[]) => {
  const currentDate = new Date().toISOString().split("T")[0];

  return markets.filter((market) =>
    market.dates.some((date) => {
      const marketDate = new Date(date);
      return marketDate >= new Date(currentDate);
    })
  );
};

export const getCurrentMarkets = async () => {
  const currentDate = new Date().toISOString().split("T")[0];

  try {
    const result = await sanityClient.fetch(
      // `*[_type == 'market' && date >= $currentDate]{
      `*[_type == 'market']{

        ${marketQueryString}
      }`,
      { currentDate }
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
