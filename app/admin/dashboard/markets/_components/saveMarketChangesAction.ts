"use server";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
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
  booked: zodRefObject.optional().nullable(),
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
      _id,
      "daysWithTables": daysWithTables[] {
        date,
        "tables": tables[] {
          "table": table {
            ...,
          },
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

  console.log({ table: sanityMarket.daysWithTables[0].tables[0] });
  const zodSanityMarket = z.object({
    _id: z.string(),
    daysWithTables: z.array(
      z.object({
        date: z.string(),
        tables: z.array(
          z.object({
            table: z.object({
              id: z.string(),
              price: z.number(),
            }),
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
    tables: dayToUpdate.tables.map((table) => {
      const vendor = vendors.find(
        (vendor) => vendor.tableSelection === table.table.id
      );

      if (vendor) {
        return {
          ...table,
          table: {
            ...table.table,
            price: table.table.price || 0,
          },
          booked: {
            _type: "reference",
            _ref: vendor.vendorId,
          },
        };
      } else
        return {
          ...table,
          booked: null,
        };
    }),
  };

  if (dayWithTables.tables.some((table) => table.table.price === 0)) {
    return {
      success: false,
      error: "error finding prices",
    };
  }

  if (!areDatesSame(dayToUpdate.date, dayWithTables.date)) {
    return {
      success: false,
      error: "issue with the dates",
    };
  }

  // if (!dayToUpdate.tables) {
  //   return {
  //     success: false,
  //     error: "no tables found"
  //   }
  // }

  if (!areAllTablesInTable2InTable1(dayToUpdate.tables, dayWithTables.tables)) {
    return {
      success: false,
      error: "issue with the tables",
    };
  }

  const areTablesDifferent = areTableArraysDifferent(
    dayToUpdate.tables,
    dayWithTables.tables
  );

  if (!areTablesDifferent) {
    return {
      success: false,
      error: "tables are the same, update one to save changes",
    };
  }

  const updatedDaysWithTables = parsedSanityMarket.data.daysWithTables.map(
    (day) => {
      if (areDatesSame(day.date, dayWithTables.date)) {
        return dayWithTables;
      } else {
        return day;
      }
    }
  );

  // const newTables:
  console.log({
    areTablesDifferent,
    updatedDaysWithTables,
    newTables: updatedDaysWithTables[0].tables,
    oldTables: dayToUpdate.tables,
  });


  // const sanityResp = await sanityWriteClient
  // .patch(parsedSanityMarket.data._id) // replace '<document-id>' with the id of the document you want to update
  // .set({
  //   'daysWithTables': updatedDaysWithTables // replace 'updatedDaysWithTables' with the updated array
  // })
  // .commit() // Don't forget to call commit() to send the patch



  return {
    success: false,
    error: "q paso rick",
  };
};

type TTable = {
  table: {
    id: string;
  };
  booked?:
    | {
        _type: string;
        _ref: string;
        _key?: string | null;
      }
    | null
    | undefined;
};

function areTableArraysDifferent(
  oldTables: TTable[],
  newTables: TTable[]
): boolean {
  for (const newTable of newTables) {
    const oldTable = oldTables.find((t) => t.table.id === newTable.table.id);

    if (!oldTable) {
      // console.log("newTable is not in oldTable");
      return true; // newTable is not in oldTable
    }

    if (oldTable.booked?._ref !== newTable.booked?._ref) {
      // console.log("booked refs are not the same");
      return true;
    }
  }

  return false;
}

function areAllTablesInTable2InTable1(
  tables1: TTable[],
  tables2: TTable[]
): boolean {
  return tables2.every((table2) =>
    tables1.some((table1) => table1.table.id === table2.table?.id)
  );
}
