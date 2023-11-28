import { zodVenueSchema } from "@/zod/venues";
import { sanityClient } from "../../lib/client";
import { z } from "zod";

const venueQueryString = `
  title,
  address,  
  city,
  securityPhone,
  hours,
  phone,
  loadInInstructions,
  _id,
  "venueMap": {
    "url": venueMap.asset->url,
    "_id": venueMap.asset->_id
  },
  tables
`;

const zodVenueQuery = zodVenueSchema.merge(
  z.object({
    _id: z.string(),
    venueMap: z.object({
      url: z.string(),
      _id: z.string(),
    }),
  })
);

export type TVenueFront = z.infer<typeof zodVenueQuery>;

const zodVenueQueryArray = z.array(zodVenueQuery);

export const getAllVenues = async () => {
  try {
    
    const result = await sanityClient.fetch(
      `*[_type == 'venue']{
     ${venueQueryString}
    }`
    );

    const parsedResult = zodVenueQueryArray.safeParse(result);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error.message);
    }
    return parsedResult.data;
  } catch (error) {
    console.error(error);
  }
};

export const getVenueById = async (id: string) => {
  const result = await sanityClient.fetch(
    `*[_type == 'venue' && _id == $id]{
    ${venueQueryString}
  }`,
    {
      id,
    }
  );

  const parsedResult = zodVenueQuery.safeParse(result[0]);

  if (!parsedResult.success) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};
