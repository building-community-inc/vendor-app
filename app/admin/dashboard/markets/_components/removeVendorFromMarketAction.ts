"use server";
import {
  paymentRecordQuery,
  PaymentRecordsSchema,
  updateMarketQuery,
  updateMarketSchema,
} from "./zodAndQueries";
import { currentUser } from "@clerk/nextjs/server";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { z } from "zod";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { Mutation } from "next-sanity";
import { revalidatePath } from "next/cache";
import { FormState } from "@/app/types";

const RemoveTableBookingSchema = z.object({
  marketId: z.string(),
  date: z.string(), // Expecting date as a string (e.g., "YYYY-MM-DD")
  tableId: z.string(),
  vendorId: z.string(),
});

export const removeVendorFromMarket = async (
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
    vendorId: formData.get("vendorId"),
    tableId: formData.get("tableId"),
  };
  const validationResult = RemoveTableBookingSchema.safeParse(rawData);

  if (!validationResult.success) {
    console.error(
      "Invalid input data:",
      validationResult.error.formErrors.fieldErrors
    );
    return { success: false, errors: ["Invalid input data"] };
  }

  const { marketId, date, tableId, vendorId } = validationResult.data;

  try {
    const marketRaw = await sanityClient.fetch(updateMarketQuery(marketId));
    const {
      data: market,
      success,
      error,
    } = updateMarketSchema.safeParse(marketRaw);

    if (!market || !success) {
      console.error(error.message);
      return { success: false, errors: ["Market not found"] };
    }

    const paymentRecordsRaw = await sanityClient.fetch(
      paymentRecordQuery(vendorId, marketId)
    );

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

    if (tableId && tableId !== "null") {
      const oldTableIndex = market.daysWithTables[dayIndex]?.tables?.findIndex(
        (tableGroup: { table: { id: string } }) =>
          tableGroup.table.id === tableId
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
      const existingVendorIndex = market.vendors?.findIndex(
        (vendorEntry: { vendor: { _ref: string } }) =>
          vendorEntry.vendor._ref === vendorId
      );

      if (existingVendorIndex !== undefined && existingVendorIndex !== -1) {
        const bookingToRemoveIndex = market.vendors[
          existingVendorIndex
        ]?.datesBooked?.findIndex(
          (booking: { date: string; tableId: string }) =>
            booking.date === date && booking.tableId === tableId
        );

        if (bookingToRemoveIndex !== undefined && bookingToRemoveIndex !== -1) {
          const bookingToRemoveKey =
            market.vendors[existingVendorIndex].datesBooked[
              bookingToRemoveIndex
            ]?._key;
          if (bookingToRemoveKey) {
            patches.push({
              patch: {
                id: marketId,
                unset: [
                  `vendors[${existingVendorIndex}].datesBooked[_key == "${bookingToRemoveKey}"]`,
                ],
              },
            });
          }
        }
      }
    }

    paymentRecords.forEach((record) => {
      const matchingItems = record.items.filter(
        (item) => item.date === date && item.tableId === tableId
      );

      if (matchingItems.length > 0) {
        const itemsToRemoveKeys = matchingItems.map((item) => item._key);
        patches.push({
          patch: {
            id: record._id,
            unset: itemsToRemoveKeys.map((key) => `items[_key == "${key}"]`),
          },
        });
      }
    });

    // After removing the items, check if any record's 'items' array is now empty
    // and set their status to 'cancelled'
    paymentRecords.forEach((record) => {
      const remainingItems = record.items.filter(
        (item) => !(item.date === date && item.tableId === tableId)
      );
      if (remainingItems.length === 0) {
        patches.push({
          patch: {
            id: record._id,
            set: { status: "cancelled" },
          },
        });
      }
    });
    if (patches.length > 0) {
      await sanityWriteClient.transaction(patches).commit();
    }

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
