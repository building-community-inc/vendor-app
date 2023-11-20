import { zodVenueSchema } from "@/zod/venues";
import { sanityClient } from "../lib/client";
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
  "venueMap": venueMap.asset->url,
`;

const zodVenueQuery = zodVenueSchema.merge(
  z.object({
    _id: z.string(),
    venueMap: z.string(),
  })
);

export type TVenueFront = z.infer<typeof zodVenueQuery>;

const zodVenueQueryArray = z.array(zodVenueQuery);

export const getAllVenues = async () => {
  try {
    const result = await sanityClient.fetch(`*[_type == 'venue']{
     ${venueQueryString}
    }`, {
      next: {
        cache: "no-cache",
      }
    });

    const parsedResult = zodVenueQueryArray.safeParse(result);

    if (!parsedResult.success) {
      throw new Error(parsedResult.error.message);
    }
    return parsedResult.data;
  } catch (error) {
    console.error(error);
  }
};
