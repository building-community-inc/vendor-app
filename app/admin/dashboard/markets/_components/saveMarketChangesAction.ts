"use server";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { zodVendorSchema } from "@/sanity/queries/admin/markets/zods";
import { getAllPaymentsForAMarket } from "@/sanity/queries/admin/payments";
import { areDatesSame } from "@/utils/helpers";
import { DateTime } from "luxon";
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
  deletedVendors: z
    .array(
      z
        .string()
        .transform((str) => JSON.parse(str))
        .refine(
          (vendor) => zodVendorSchema.safeParse(vendor).success,
          "Invalid vendor object"
        )
    )
    .optional()
    .nullable(),
});

export const saveMarketChanges = async (
  formState: {
    success: boolean;
    error: string;
  },
  formData: FormData
) => {
  const rawData = {
    reset: formData.get("reset"),
    date: formData.get("date"),
    vendorIds: formData.getAll("vendorId"),
    tableSelections: formData.getAll("tableSelection"),
    marketId: formData.get("marketId"),
    deletedVendors: formData.getAll("deletedVendors"),
  };

  if (rawData.reset) {
    return {
      success: false,
      error: "",
    };
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
          "_type": "day"
        }
        
      }
    }`
  );

  if (!sanityMarket)
    return {
      success: false,
      error: "Error finding market",
    };

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

  const daysThatChanged: TDaySchema[] = [];
  const oldDays: TDaySchema[] = [];
  const updatedDaysWithTables = parsedSanityMarket.data.daysWithTables.map(
    (day) => {
      if (areDatesSame(day.date, dayWithTables.date)) {
        daysThatChanged.push(dayWithTables);
        oldDays.push(day);
        return dayWithTables;
      } else {
        return day;
      }
    }
  );

  const updatedVendors = vendors
    .map((newVendor) => {
      const vendor = parsedSanityMarket.data.vendors.find(
        (vendor) => newVendor.vendorId === vendor.vendor._ref
      );

      if (!vendor) {
        // Handle the case where the vendor is not found in the Sanity data
        return null;
      }

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
    })
    .filter(Boolean); // Remove null values

  // update the vendor payments to reflect the new values if a booking got deleted...

  // get all payment records

  const paymentRecords = await getAllPaymentsForAMarket(
    parsedData.data.marketId
  );

  if (!paymentRecords) {
    return {
      success: false,
      error: "Error finding payment records",
    };
  }

  // find the right payment record to update with the right market vendor and table information
  const deletedVendorPayments = paymentRecords.filter((record) => {
    // Check if the vendor is in the list of deleted vendors
    const isDeletedVendor = parsedData.data.deletedVendors?.some(
      (deletedVendor) => deletedVendor.vendor._ref === record.vendor._id
    );

    // Check if there's an item for the target date
    const hasTargetDate = record.items.some(
      (item) => item.date === parsedData.data.date
    );

    const isPaymentNotReturned = !record.paymentReturned;

    return isDeletedVendor && hasTargetDate && isPaymentNotReturned;
  });

  // add anotation to payment record

  for (const deletedPayment of deletedVendorPayments) {
    try {
      const vendor = await sanityWriteClient.fetch(
        `*[_type == "user" && _id == $vendorId][0]`,
        { vendorId: deletedPayment.vendor._id }
      );

      // Add the payment value to the vendor's credits

      const updatedUserCredits =
        Number(vendor.credits) +
        (deletedPayment.amount.paid);
      // add payment value to credits

      await sanityWriteClient
        .patch(vendor._id)
        .set({ credits: updatedUserCredits })
        .commit();

      await sanityWriteClient
        .patch(deletedPayment._id)
        .set({ paymentReturned: true })
        .commit();

      // add the transaction to the credit transactions array
      await sanityWriteClient
        .create({
          _type: "creditTransaction",
          date: DateTime.now().toISO(), // Use the current date or the date of the transaction
          market: { _ref: parsedSanityMarket.data._id, _type: "reference" }, // Reference to the market
          vendor: { _ref: vendor._id, _type: "reference" }, // Reference to the vendor
          amount: updatedUserCredits, // The amount of the transaction
          reason: "Payment returned by admin", // The reason for the transaction
        })
        .catch((err) => console.error(err));
    } catch (err) {
      return {
        success: false,
        error: "Error updating payment record",
      };
    }
  }

  const sanityResp = await sanityWriteClient
    .patch(parsedSanityMarket.data._id)
    .set({
      daysWithTables: updatedDaysWithTables,
      vendors: updatedVendors,
    })
    .commit();


    // TODO update payment record with new table when table has changed

    // find the tables that changed between the daysThatChanged and the oldDays
    const changedTables = daysThatChanged.flatMap((newDay, index) => {
      const oldDay = oldDays[index];
      return newDay.tables.filter((newTable) => {
        const oldTable = oldDay.tables.find((t) => t.table.id === newTable.table.id);
        return oldTable && oldTable.booked?._ref !== newTable.booked?._ref;
      });
    });
    
    
    for (const newTable of changedTables) {
      if (newTable.booked && newTable.booked._ref) {
        // find the users payments for the table
        const userPayments = paymentRecords.filter((record) => {
            return record.vendor._id === newTable.booked?._ref;
        });

        const paymentToUpdate = userPayments.find((record) => record.market._id === parsedData.data.marketId);

        if (paymentToUpdate) {

          // const itemToUpdate = paymentToUpdate.items.find((item) => {
          //   console.log({itemTableId: item.tableId, newTable: newTable.table.id})
          //   return item.tableId === newTable.table.id;
          // });

         for (const day of daysThatChanged) {
          const itemToChange = paymentToUpdate.items.find((item) => item.date === day.date);
          

          const newItem ={
            ...itemToChange,
            tableId: newTable.table.id,
            _key: nanoid(),
          }

          const newPaymentRecord = {
            ...paymentToUpdate,
            items: paymentToUpdate.items.map((item) => {
              if (item.date === day.date) {
                return newItem;
              }

              return item;
            }),
          }

          try {
            await sanityWriteClient.patch(paymentToUpdate._id).set({
              items: newPaymentRecord.items,
            }).commit();

            
          } catch (error) {
            return {
              success: false,
              error: "Error updating payment record",
            }
          }
          
         }
        }

      };
    }

  if (sanityResp) {
    revalidatePath("/admin/dashboard/markets/[id]", "page");
    revalidatePath("/dashboard/markets/[id]", "page");
    revalidatePath("/dashboard/vendors/[id]", "page");
    revalidatePath("/admin/dashboard/vendors/[id]", "page");

    return {
      success: true,
      error: "",
    };
  }

  return {
    success: false,
    error: "something went wrong",
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
      return true; // newTable is not in oldTable
    }

    if (oldTable.booked?._ref !== newTable.booked?._ref) {
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
