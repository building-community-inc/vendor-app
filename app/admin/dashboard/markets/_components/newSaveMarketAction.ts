"use server";

import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { z } from "zod";
import { FormState } from "../../payments/changeStatusAction";
import { currentUser } from "@clerk/nextjs/server";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { Mutation } from "next-sanity";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { paymentRecordQuery, PaymentRecordsSchema, updateMarketQuery, updateMarketSchema } from "./zodAndQueries";

// Define the Zod schema for the input data
const UpdateTableBookingSchema = z.object({
  marketId: z.string(),
  date: z.string(), // Expecting date as a string (e.g., "YYYY-MM-DD")
  tableId: z.string(),
  vendorId: z.string(),
  oldTableId: z.string(),
});

export const updateTableBooking = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      errors: ["unauthorized"],
    };
  }

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser || sanityUser.role !== "admin") {
    return {
      success: false,
      errors: ["unauthorized"],
    };
  }

  const rawData = {
    marketId: formData.get("marketId"),
    date: formData.get("date"),
    tableId: formData.get("tableId"),
    oldTableId: formData.get("oldTableId"),
    vendorId: formData.get("vendorId"),
  };
  // Validate the input data using the Zod schema
  const validationResult = UpdateTableBookingSchema.safeParse(rawData);

  if (!validationResult.success) {
    console.error(
      "Invalid input data:",
      validationResult.error.formErrors.fieldErrors
    );
    return { success: false, errors: ["Invalid input data"] };
  }

  const { marketId, date, tableId, vendorId, oldTableId } =
    validationResult.data;

  if (tableId === oldTableId) {
    return {
      success: false,
      errors: ["No changes detected"],
    };
  }
  try {

    const marketRaw = await sanityClient.fetch(updateMarketQuery(marketId));

    const { data: market, success, error } = updateMarketSchema.safeParse(marketRaw);

    if (!market || !success) {
      console.error(error.message);
      return { success: false, errors: ["Market not found"] };
    }


    const paymentRecordsRaw = await sanityClient.fetch(paymentRecordQuery(vendorId, marketId));

    const {
      success: paymentRecordsSuccess,
      data: paymentRecords,
      error: paymentRecordsError,
    } = PaymentRecordsSchema.safeParse(paymentRecordsRaw);

    if (!paymentRecordsSuccess) {
      console.error(paymentRecordsError.message);
      return {
        success: false,
        errors: ["Error Finding The Payment Record"],
      };
    }

    // Find the correct day
    const dayIndex = market.daysWithTables?.findIndex(
      (day: { date: string }) => day.date === date
    );

    if (dayIndex === undefined || dayIndex === -1) {
      return {
        success: false,
        errors: [`Date "${date}" not found for this market`],
      };
    }

    // Find the index of the newly booked table within the day
    const newTableIndex = market.daysWithTables[dayIndex]?.tables?.findIndex(
      (tableGroup: { table: { id: string } }) => tableGroup.table.id === tableId
    );

    if (newTableIndex === undefined || newTableIndex === -1) {
      return {
        success: false,
        errors: [`Table with ID "${tableId}" not found for date "${date}"`],
      };
    }

    const patches: Mutation<Record<string, unknown>>[] &
      Mutation<Record<string, unknown>>[] = [];

    // Unbook the old table
    if (oldTableId && oldTableId !== "null") {
      const oldTableIndex = market.daysWithTables[dayIndex]?.tables?.findIndex(
        (tableGroup: { table: { id: string } }) =>
          tableGroup.table.id === oldTableId
      );

      if (oldTableIndex !== undefined && oldTableIndex !== -1) {
        patches.push({
          patch: {
            id: marketId,
            set: {
              [`daysWithTables[${dayIndex}].tables[${oldTableIndex}].booked`]:
                null,
            },
          },
        });
      }

      // Remove the old booking from the vendor's datesBooked array
      const existingVendorIndexForOld = market.vendors?.findIndex(
        (vendorEntry: { vendor: { _ref: string } }) =>
          vendorEntry.vendor._ref === vendorId
      );

      if (
        existingVendorIndexForOld !== undefined &&
        existingVendorIndexForOld !== -1
      ) {
        const bookingToRemoveIndex = market.vendors[
          existingVendorIndexForOld
        ]?.datesBooked?.findIndex(
          (booking: { date: string; tableId: string }) =>
            booking.date === date && booking.tableId === oldTableId
        );

        if (bookingToRemoveIndex !== undefined && bookingToRemoveIndex !== -1) {
          const bookingToRemoveKey =
            market.vendors[existingVendorIndexForOld].datesBooked[
              bookingToRemoveIndex
            ]?._key;
          if (bookingToRemoveKey) {
            patches.push({
              patch: {
                id: marketId,
                unset: [
                  `vendors[${existingVendorIndexForOld}].datesBooked[_key == "${bookingToRemoveKey}"]`,
                ],
              },
            });
          }
        }
      }
    }

    // Book the new table
    patches.push({
      patch: {
        id: marketId,
        set: {
          [`daysWithTables[${dayIndex}].tables[${newTableIndex}].booked`]:
            vendorId ? { _type: "reference", _ref: vendorId } : null,
        },
      },
    });

    const existingVendorIndexNew = market.vendors?.findIndex(
      (vendorEntry: { vendor: { _ref: string } }) =>
        vendorEntry.vendor._ref === vendorId
    );
    if (existingVendorIndexNew !== undefined && existingVendorIndexNew !== -1) {
      // Vendor exists, add the date and tableId if not already present
      const existingBookingIndexNew = market.vendors[
        existingVendorIndexNew
      ]?.datesBooked?.findIndex(
        (booking: { date: string; tableId: string }) =>
          booking.date === date && booking.tableId === tableId
      );

      if (
        existingBookingIndexNew === undefined ||
        existingBookingIndexNew === -1
      ) {
        patches.push({
          patch: {
            id: marketId,
            insert: {
              before: `vendors[${existingVendorIndexNew}].datesBooked[0]`, // Insert at the beginning
              items: [
                {
                  date,
                  tableId,
                  _key: nanoid(),
                  _type: "day",
                },
              ],
            },
          },
        });
      }
    } else {
      // Vendor doesn't exist, add a new vendor entry
      patches.push({
        patch: {
          id: marketId,
          insert: {
            before: `vendors[0]`, // Insert at the beginning
            items: [
              {
                _type: "vendorDetails",
                vendor: { _type: "reference", _ref: vendorId },
                datesBooked: [{ _type: "day", date, tableId, _key: nanoid() }],
                _key: nanoid(),
              },
            ],
          },
        },
      });
    }

    if (paymentRecords && paymentRecords.length > 0) {
      paymentRecords.forEach((record) => {
        record.items.forEach((item, index) => {
          if (item.date === date && item.tableId === oldTableId) {
            patches.push({
              patch: {
                id: record._id,
                set: {
                  [`items[_key == "${item._key}"].tableId`]: tableId,
                },
              },
            });
          }
        });
      });
    }

    await sanityWriteClient.transaction(patches).commit();

    revalidatePath("/admin/dashboard/", "layout");
    revalidatePath("/dashboard/", "layout");

    return {
      success: true,
      errors: undefined,
    };

  } catch (error) {
    console.error("Error updating table booking:", error);
    return { success: false, errors: ["Failed to update table booking"] };
  }
  
};

