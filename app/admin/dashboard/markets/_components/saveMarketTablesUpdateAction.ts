"use server";
import { FormState } from "@/app/types";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { defineQuery, Mutation } from "next-sanity";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MARKET_UPDATE_QUERY =
  defineQuery(`*[_type == "market" && _id == $marketId] [0] {
  vendors,
  daysWithTables
}`);

const PAYMENT_RECORD_UPDATE_QUERY =
  defineQuery(`*[_type == "paymentRecord" && market._ref == $marketId && user._ref == $vendorId] {
  items,
  status,
  _id
}`);

export const saveMarketTablesUpdateAction = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  console.log("Saving market tables update action");

  const marketId = formData.get("marketId") as string;
  const vendorIds = formData.getAll("vendorId") as string[];
  const dates = formData.getAll("date") as string[];
  const oldTableIds = formData.getAll("oldTableId") as string[];
  const types = formData.getAll("type") as string[];
  const newTableIds = formData.getAll("newTableId") as string[];

  const changesToValidate = vendorIds.map((vendorId, index) => ({
    vendorId: vendorId,
    date: dates[index],
    oldTableId: oldTableIds[index],
    type: types[index],
    newTableId: types[index] === "update" ? newTableIds[index] : undefined, // Only include if type is update
  }));

  if (!marketId || marketId.length === 0) {
    return {
      errors: ["Market ID is required"],
      success: false,
    };
  }

  const {
    success,
    error,
    data: changes,
  } = changesSchema.safeParse(changesToValidate);
  if (!success) {
    console.log("Form validation failed", { error });
    return {
      errors: error.errors.map((err) => err.message),
      success: false,
    };
  }

  // console.log({changesToValidate})
  try {
    const market = await sanityClient.fetch(MARKET_UPDATE_QUERY, { marketId });
    // console.log({market})
    const patches: Mutation<Record<string, unknown>>[] &
      Mutation<Record<string, unknown>>[] = [];
    if (!market) {
      return {
        errors: ["Market not found"],
        success: false,
      };
    }
    // TODO prepare the patches array, with the patches for:
    for (const change of changes) {
      // --- Find Objects and Keys instead of Indices ---

      // Find vendor details object and its key using vendorId from change
      const targetVendorDetails = market.vendors?.find(
        (vendorEntry) => vendorEntry.vendor?._ref === change.vendorId
      );
      const vendorKey = targetVendorDetails?._key;

      // Find the specific date booked object and its key using date from change
      // Note: Assumes date is unique per vendor. If not, 'change' needs a better ID.
      const targetDateBooked = targetVendorDetails?.datesBooked?.find(
        (dateEntry) => dateEntry.date === change.date
      );
      const dateKey = targetDateBooked?._key;

      // Find the day object and its key in daysWithTables using date from change
      const targetDay = market.daysWithTables?.find(
        (day) => day.date === change.date
      );

      console.log({targetDay})
      const dayKey = targetDay?._key;

      // Find the old table group object and its key using oldTableId from change
      const oldTableGroup = targetDay?.tables?.find(
        (tableGroup) => tableGroup.table?.id === change.oldTableId
      );
      const oldTableKey = oldTableGroup?._key;

      // Find the new table group object and its key (only if update) using newTableId from change
      let newTableKey: string | undefined;
      if (change.type === "update") {
        const newTableGroup = targetDay?.tables?.find(
          (tableGroup) => tableGroup.table?.id === change.newTableId
        );
        newTableKey = newTableGroup?._key;
      }

      // --- Validation Checks (Now check if keys were found) ---
      if (!vendorKey || !dateKey || !dayKey || !oldTableKey) {
        console.error("Error finding necessary keys for change:", change, {
          vendorKey,
          dateKey,
          dayKey,
          oldTableKey,
        });
        continue; // Skip if any required key is missing
      }
      if (change.type === "update" && !newTableKey) {
        console.error("Error finding new table key for update change:", change);
        continue; // Skip if new table key needed but not found
      }
      const finalSetOps: { [key: string]: unknown } = {}; // Operations that set/update values
      const finalUnsetOps: string[] = []; // Paths to unset/remove

      // --- Logic for Operations ---

      // 1. Always plan to unset the old table's booking reference
      //    We add the path to the unset list regardless of update/delete initially.
      finalUnsetOps.push(
        `daysWithTables[_key=="${dayKey}"].tables[_key=="${oldTableKey}"].booked`
      );

      if (change.type === "update") {
        // 2. Set the new table's booking reference
        const newBookingRef = { _type: "reference", _ref: change.vendorId };
        finalSetOps[
          `daysWithTables[_key=="${dayKey}"].tables[_key=="${newTableKey}"].booked`
        ] = newBookingRef;

        // 3. Update the vendor's datesBooked entry to reflect the new tableId
        if (targetDateBooked) {
          // Important: Include the _key when updating an item in a keyed array
          // to ensure Sanity updates the correct object rather than replacing based on position.
          const updatedVendorDate = {
            ...targetDateBooked, // Keep existing data in the date entry if any
            _key: dateKey, // Specify the key of the object to update
            tableId: change.newTableId, // Update the tableId
            date: change.date, // Ensure date is correct/preserved
          };
          finalSetOps[
            `vendors[_key=="${vendorKey}"].datesBooked[_key=="${dateKey}"]`
          ] = updatedVendorDate;
        } else {
          // This case should ideally not happen if keys were validated correctly
          console.error(
            "Consistency Error: Could not find vendor date entry object for update:",
            change,
            { vendorKey, dateKey }
          );
          continue; // Skip this problematic change
        }
      } else if (change.type === "delete") {
        // 4. For delete, also remove the entry from the vendor's datesBooked array
        finalUnsetOps.push(
          `vendors[_key=="${vendorKey}"].datesBooked[_key=="${dateKey}"]`
        );
      }

      // --- Assemble the final patch payload for this change ---
      const patchPayload: {
        id: string;
        set?: { [key: string]: unknown };
        unset?: string[];
      } = {
        id: marketId, // Make sure marketId is defined in the outer scope
      };

      if (Object.keys(finalSetOps).length > 0) {
        patchPayload.set = finalSetOps;
      }
      if (finalUnsetOps.length > 0) {
        patchPayload.unset = finalUnsetOps;
      }

      // Add the generated payload to the list if it contains any operations
      if (patchPayload.set || patchPayload.unset) {
        patches.push({ patch: patchPayload }); // Assuming 'patches' is defined in the outer scope
      }

      // const setOperations: { [key: string]: unknown } = {};
      // let pathToRemoveInVendorDates: string | null = null;

      // setOperations[
      //   `daysWithTables[_key=="${dayKey}"].tables[_key=="${oldTableKey}"].booked`
      // ] = undefined;
      // if (change.type === "update") {
      //   const newBookingRef = { _type: "reference", _ref: change.vendorId };
      //   setOperations[
      //     `daysWithTables[_key=="${dayKey}"].tables[_key=="${newTableKey}"].booked`
      //   ] = newBookingRef;
      // }

      // if (change.type === "update") {
      //   if (targetDateBooked) {
      //     const updatedVendorDate = {
      //       ...targetDateBooked,
      //       tableId: change.newTableId,
      //     };
      //     // Update item using key-based path in 'set'
      //     setOperations[
      //       `vendors[_key=="${vendorKey}"].datesBooked[_key=="${dateKey}"]`
      //     ] = updatedVendorDate;
      //   } else {
      //     console.error(
      //       "Could not find vendor date entry object to update, though key was found:",
      //       change
      //     );
      //     continue;
      //   }
      // } else if (change.type === "delete") {
      //   pathToRemoveInVendorDates = `vendors[_key=="${vendorKey}"].datesBooked[_key=="${dateKey}"]`;
      // }

      // // const patchPayload: {
      // //   id: string;
      // //   set?: { [key: string]: unknown };
      // //   unset?: string[];
      // // } = {
      // //   id: marketId,
      // // };
      // if (Object.keys(setOperations).length > 0) {
      //   patchPayload.set = setOperations;
      // }
      // if (pathToRemoveInVendorDates) {
      //   patchPayload.unset = [pathToRemoveInVendorDates];
      // }
      // if (patchPayload.set || patchPayload.unset) {
      //   patches.push({ patch: patchPayload });
      // }

      // PATCH paymentRecords.items

      const paymentRecords = await sanityClient.fetch(
        PAYMENT_RECORD_UPDATE_QUERY,
        {
          marketId,
          vendorId: change.vendorId,
        }
      );

      if (!paymentRecords || paymentRecords.length === 0) {
        console.error("No payment record found for vendor:", change.vendorId);
        return {
          success: false,
          errors: [
            `No payment record found for vendor ${change.vendorId} on table ${change.oldTableId} on ${change.date}`,
          ],
        };
      }

      for (const paymentRecord of paymentRecords) {
        const itemToUpdate = paymentRecord.items?.find(
          (item) =>
            item.date === change.date && item.tableId === change.oldTableId
        );

        if (!itemToUpdate) {
          // console.error("No matching item found in payment record:", change, paymentRecord);
          continue;
        }

        if (itemToUpdate) {
          console.log("found Item", itemToUpdate, paymentRecord._id);
        }

        const newItem =
          change.type === "update"
            ? {
                ...itemToUpdate,
                tableId: change.newTableId,
              }
            : undefined;

        const setPaymentItem = newItem
          ? {
              [`items[_key == "${itemToUpdate._key}"]`]: newItem,
            }
          : undefined;

        const unsetPaymentItem =
          change.type === "delete"
            ? [`items[_key == "${itemToUpdate._key}"]`]
            : undefined;

        const paymentPatchPayload: {
          id: string;
          set?: { [key: string]: unknown };
          unset?: string[];
        } = {
          id: paymentRecord._id,
        };

        if (setPaymentItem) {
          paymentPatchPayload.set = setPaymentItem;
        }
        if (unsetPaymentItem) {
          paymentPatchPayload.unset = unsetPaymentItem;
        }

        if (change.type === "delete" && paymentRecord.items?.length === 1) {
          // Set the status to cancelled if there are no items left
          if (!paymentPatchPayload.set) {
            paymentPatchPayload.set = paymentPatchPayload.set || {};
          }
          paymentPatchPayload.set.status = "cancelled";
        }

        if (paymentPatchPayload.set || paymentPatchPayload.unset) {
          patches.push({ patch: paymentPatchPayload });
        }
      }
    }

    // for (const patch of patches) {
    //   console.log({patch: patch.patch})
    // }

    try {
      if (patches.length > 0) {
        for (const patchItem of patches) {
          // const {} = patchItem
          // console.log({patch: JSON.stringify(patchItem.patch, 2, null)})
        }
      }
      // await sanityWriteClient.transaction(patches).commit();

      revalidatePath("/admin/dashboard/", "layout");
      revalidatePath("/dashboard/", "layout");
      return {
        success: true,
        errors: undefined,
      };
    } catch (error) {
      console.error("Error saving market tables update action", error);
      return {
        errors: ["Error saving market tables update action"],
        success: false,
      };
    }
  } catch (error) {
    console.error("Error saving market tables update action", error);
    return {
      errors: ["Error saving market tables update action"],
      success: false,
    };
  }
};

const updateChangeSchema = z.object({
  type: z.literal("update"),
  vendorId: z.string().min(1, "Vendor ID is required"),
  date: z.string().min(1, "Date is required"),
  oldTableId: z.string().min(1, "Old Table ID is required"),
  newTableId: z.string().min(1, "New Table ID is required"),
});

const deleteChangeSchema = z.object({
  type: z.literal("delete"),
  vendorId: z.string().min(1, "Vendor ID is required"),
  date: z.string().min(1, "Date is required"),
  oldTableId: z.string().min(1, "Old Table ID is required"),
});

const changeSchema = z.discriminatedUnion("type", [
  updateChangeSchema,
  deleteChangeSchema,
]);

const changesSchema = z
  .array(changeSchema)
  .min(1, "At least one change is required");
