"use server";
import { sanityClient } from "@/sanity/lib/client";
import { areDatesSame } from "@/utils/helpers";
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
  booked: zodRefObject,
});

const daySchema = z.object({
  date: z.string(),
  tables: z.array(tableObjectSchema),
});

type TDaySchema = z.infer<typeof daySchema>;

const rawDataParser = z.object({
  date: z.string().min(4, "Something went wrong with the date"),
  vendorIds: z.array(z.string()),
  tableSelections: z.array(z.string()),
  marketId: z.string(),
});

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

  const parsedData = rawDataParser.safeParse(rawData);

  if (!parsedData.success) {
    return {
      success: false,
      error: JSON.stringify(parsedData.error.errors, null, 2),
    };
  }

  const vendors = parsedData.data.vendorIds.map((vendorId, index) => {
    return {
      vendorId: vendorId,
      tableSelection: parsedData.data.tableSelections[index],
    };
  });

  const tableSelections = new Set();

  for (const vendor of vendors) {
    if (tableSelections.has(vendor.tableSelection)) {
      return {
        success: false,
        error: `Error in table selection: ${vendor.tableSelection} is duplicated.`,
      };
    }
    tableSelections.add(vendor.tableSelection);
  }

  const sanityMarket = await sanityClient.fetch(
    `*[_type == "market" && _id == "${parsedData.data.marketId}"][0] {
      "daysWithTables": daysWithTables[] {
        date,
        "tables": tables[] {
          "id": table.id,
          "price": table.price,
          "booked": booked -> {
            "_type": "reference",
            "_ref": _id
          }
        }
      }

    }`
  );

  if (!sanityMarket)
    return {
      success: false,
      error: "Error finding market",
    };
  const zodSanityMarket = z.object({
    daysWithTables: z.array(
      z.object({
        date: z.string(),
        tables: z.array(
          z.object({
            id: z.string(),
            price: z.number(),
            booked: zodRefObject.optional().nullable(),
          })
        ),
      })
    ),
  });

  const parsedSanityMarket = zodSanityMarket.safeParse(sanityMarket);

  if (!parsedSanityMarket.success) {
    return {
      success: false,
      error: JSON.stringify(parsedSanityMarket.error.errors, null, 2),
    };
  }

  const dayToUpdate = parsedSanityMarket.data.daysWithTables.find((day) =>
    areDatesSame(day.date, parsedData.data.date)
  );

  if (!dayToUpdate) {
    return {
      success: false,
      error: "Error finding the day to update",
    };
  }

  const dayWithTables: TDaySchema = {
    date: parsedData.data.date,
    tables: vendors.map((vendor) => ({
      table: {
        id: vendor.tableSelection,
        price: 0,
      },
      booked: {
        _type: "reference",
        _ref: vendor.vendorId,
      },
    })),
  };

  if (!areDatesSame(dayToUpdate.date, dayWithTables.date)) {
    return {
      success: false,
      error: "issue with the dates",
    };
  }

  const areTablesDifferent = areTableArraysDifferent(
    dayToUpdate.tables.map((table) => ({
      table: {
        id: table.id,
        price: table.price
      },
      booked: table.booked,
    })),
    dayWithTables.tables
  );

  console.log({
    // vendors,
    // tableSelections,
    areTablesDifferent,
    // date: rawData.date,
    // marketId: rawData.marketId,
    // sanityMarket,
    dayWithTables,
    dayToUpdate,
  });

  return {
    success: false,
    error: "q paso rick",
  };
};

type Table = {
  table: {
    id: string;
  };
  booked:
    | {
        _type: string;
        _ref: string;
        _key?: string | null;
      }
    | null
    | undefined;
};

function areTableArraysDifferent(tables1: Table[], tables2: Table[]): boolean {
  for (let table1 of tables1) {
    const table2 = tables2.find(t => t.table.id === table1.table.id);
    if (table2) {
      if (table1.booked?._ref !== table2.booked?._ref) {
        return true;
      }
    } else {
      return true; // table1 is not in tables2
    }
  }

  for (let table2 of tables2) {
    if (!tables1.find(t => t.table.id === table2.table.id)) {
      return true; // table2 is not in tables1
    }
  }

  return false;
}