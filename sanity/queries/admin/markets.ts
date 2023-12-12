import { sanityClient } from "@/sanity/lib/client";
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
    tables,
    hours
  },
  "daysWithTables": daysWithTables[] {
    date,

    "tables": tables[] {
      table,
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
    tables,
    "venueMap": venueMap ${imageQueryString},
    hours,
    phone,
    securityPhone,
    loadInInstructions,
    vendorInstructions
  },
  "vendors": vendors[] {
    vendor,
    "datesSelected": datesSelected[] {
      date, 
      tableSelected,
      tableConfirmed,
      confirmed
    },
    specialRequests
  },
  "daysWithTables": daysWithTables[] {
    date,

    "tables": tables[] {
      table,
      available,
      reserved,
      confirmed
    }
  }
`;

const zodImageSchema = z.object({
  url: z.string(),
  dimensions: z.object({
    height: z.number(),
    width: z.number(),
    aspectRatio: z.number(),
  }),
});

const zodMarketQuery = zodMarketFormSchema.merge(
  z.object({
    _id: z.string(),
    marketCover: zodImageSchema,
    venue: z.object({
      title: z.string(),
      address: z.string(),
      city: z.string(),
      tables: z.array(z.string()),
      venueMap: zodImageSchema.optional(),
      hours: z.string().optional(),
      phone: z.string().optional(),
      securityPhone: z.string().optional(),
      loadInInstructions: z.string().optional().nullable(),
    }),
    vendorInstructions: z.string().optional().nullable(),
    vendors: z.array(
      z.object({
        vendor: z.string(),
        datesSelected: z.array(
          z.object({
            date: z.string(),
            tableSelected: z.string(),
            tableConfirmed: z.string().optional().nullable(),
            confirmed: z.boolean(),
          })
        ),
        specialRequests: z.string().optional().nullable(),
      })
    ).optional().nullable(),

    daysWithTables: z.array(z.object({
      date: z.string(),
      tables: z.array(z.object({
        table: z.string(),
        available: z.boolean(),
        reserved: z.object({}).passthrough().optional().nullable(),
        confirmed: z.object({}).passthrough().optional().nullable()
      }))
    })).optional().nullable()
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

    // console.log({result: result.map(m =>  m.venue)})
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
