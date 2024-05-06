"use server";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { areDatesSame } from "@/utils/helpers";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
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
  _key: z.string(),
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
    reset: formData.get("reset"),
    date: formData.get("date"),
    vendorIds: formData.getAll("vendorId"),
    tableSelections: formData.getAll("tableSelection"),
    marketId: formData.get("marketId"),
  };

  if (rawData.reset) {
    return {
      success: false,
      error: ""
    }
  }

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
        _key,
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
      },
      "vendors": vendors[] {
        "vendor": vendor {
          _ref,
          "_type": "reference"
        },
        _key,
        "datesBooked": datesBooked[] {
          _key,
          date,
          tableId,
          _type
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
    _id: z.string(),
    daysWithTables: z.array(
      z.object({
        _key: z.string().default(() => nanoid()),
        date: z.string(),
        tables: z.array(
          z.object({
            _key: z.string().default(() => nanoid()),
            table: z.object({
              id: z.string(),
              price: z.number(),
            }),
            booked: zodRefObject.optional().nullable(),
          })
        ),
      })
    ),
    vendors: z.array(
      z.object({
        vendor: z.object({
          _ref: z.string(),
          _type: z.string(),
        }),
        _key: z.string().default(() => nanoid()),
        datesBooked: z.array(
          z.object({
            _key: z.string().default(() => nanoid()),
            date: z.string(),
            tableId: z.string(),
            _type: z.string(),
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
    _key: dayToUpdate._key,
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
          booked: undefined,
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

  const updatedVendors = parsedSanityMarket.data.vendors.map((vendor) => {
    for (const newVendor of vendors) {
      if (newVendor.vendorId === vendor.vendor._ref) {
        const dateBooked = vendor.datesBooked.find((date) =>
          areDatesSame(date.date, parsedData.data.date)
        );
        if (dateBooked?.tableId === newVendor.tableSelection) {
          return vendor;
        }

        const newDateBooked = {
          ...dateBooked,
          tableId: newVendor.tableSelection,
        };

        return {
          ...vendor,
          datesBooked: vendor.datesBooked.map((date) => {
            if (areDatesSame(date.date, parsedData.data.date)) {
              return newDateBooked;
            }
            return date;
          }),
        };
      }
    }

    return {
      ...vendor,
    };
  });

  // console.log({
  //   newDatesVendor: updatedVendors[3].datesBooked,
  //   oldDatesVendor: parsedSanityMarket.data.vendors[3].datesBooked,
  // });

  // console.log({newVendor: updatedVendors[1].datesBooked, oldVendor: parsedSanityMarket.data.vendors[1].datesBooked});

  // console.log({
  //   areTablesDifferent,
  //   updatedDaysWithTables,
  //   newTables: updatedDaysWithTables[0].tables,
  //   oldTables: dayToUpdate.tables,
  // });

  const sanityResp = await sanityWriteClient
    .patch(parsedSanityMarket.data._id)
    .set({
      daysWithTables: updatedDaysWithTables,
      vendors: updatedVendors,
    })
    .commit();

  if (sanityResp) {
    revalidatePath("/admin/dashboard/markets");
    revalidatePath("/dashboard/markets");

    return {
      success: true,
      error: "",
    };
  }

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

// const resetFormState = (
//   formState: {
//     success: boolean;
//     error: string;
//   },
//   formData: FormData
// ) => {
//   return {
//     success: false,
//     error: ""
//   }
// }
