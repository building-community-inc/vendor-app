"use server";
import { sanityClient } from "@/sanity/lib/client";
import { z } from "zod";

const tableSchema = z.object({
  id: z.string(),
  price: z.number(),
});

const zodRefObject = z.object({
  _type: z.literal("reference"),
  _ref: z.string(),
  _key: z.string().optional().nullable(),
});

// type TSanityReference = z.infer<typeof zodRefObject>;

const tableObjectSchema = z.object({
  table: tableSchema,
  booked: zodRefObject, // Assuming the reference to user is a string
});

const daySchema = z.object({
  date: z.string(),
  tables: z.array(tableObjectSchema),
});

const daysWithTablesSchema = z.array(daySchema);

type TDaySchema = z.infer<typeof daySchema>;

export const saveMarketChanges = async (
  formState: {
    success: boolean;
    error: string;
  },
  formData: FormData
) => {
  // console.log(formData);
  const rawData = {
    date: formData.get("date"),
    vendorIds: formData.getAll("vendorId"),
    tableSelections: formData.getAll("tableSelection"),
    marketId: formData.get("marketId"),
  };

  const vendors = rawData.vendorIds.map((vendorId, index) => {
    return {
      vendorId: vendorId,
      tableSelection: rawData.tableSelections[index],
    };
  });

  const tableSelections = new Set();

  for (const vendor of vendors) {
    if (tableSelections.has(vendor.tableSelection)) {
      return {
        success: false,
        error: `Error in table selection: ${vendor.tableSelection} is duplicated.`
      }
    }
    tableSelections.add(vendor.tableSelection);
  }

  const sanityMarket = await sanityClient.fetch(
    `*[_type == "market" && _id == "${rawData.marketId}"][0]`
  );
  // const daysWithTables: TDaySchema[] =

  if (!sanityMarket)
    return {
      success: false,
      error: "Error finding market",
    };

  console.log({
    vendors,
    date: rawData.date,
    marketId: rawData.marketId,
    sanityMarket,
  });

  return {
    success: false,
    error: "q paso rick",
  };
};
