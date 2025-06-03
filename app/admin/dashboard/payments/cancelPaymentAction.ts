"use server";
import { currentUser } from "@clerk/nextjs/server";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { z } from "zod";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { FormState } from "@/app/types";
import { sendCancelEmail } from "./sendCancelEmail";
const dataSchema = z.object({
  returnedCredits: z.string().transform((v) => parseFloat(v)),
  paymentRecordId: z.string(),
  vendorEmail: z.string(),
});
export const cancelPaymentAction = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      errors: ["Unauthorized"],
    };
  }

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );
  if (!sanityUser || sanityUser.role !== "admin") {
    return {
      success: false,
      errors: ["Unauthorized"],
    };
  }

  const rawData = {
    returnedCredits: formData.get("returnedCredits"),
    paymentRecordId: formData.get("paymentRecordId"),
    vendorEmail: formData.get("vendorEmail"),
  };

  const { success, data, error } = dataSchema.safeParse(rawData);
  if (!success) {
    console.log(error.formErrors.fieldErrors);
    return {
      success: false,
      errors: ["something went wrong!"],
    };
  }

  const sanityVendor = await getSanityUserByEmail(data.vendorEmail);

  if (!sanityVendor) {
    return {
      success: false,
      errors: ["no vendor found"],
    };
  }

  const paymentRecord = await sanityClient.getDocument(data.paymentRecordId);

  if (!paymentRecord) {
    return {
      success: false,
      errors: ["payment record not found"],
    };
  }

  // update payment record
  // update the status
  // update the returned payment

  const market = await sanityClient.getDocument(paymentRecord.market._ref);

  if (!market) {
    return {
      success: false,
      errors: ["market not found"],
    };
  }
  // find vendor in the vendors array
  const vendor = market.vendors?.find(
    (vendor: { vendor: { _ref: string } }) =>
      vendor.vendor._ref === paymentRecord.user._ref
  );

  if (!vendor) {
    return {
      success: false,
      errors: ["vendor not found"],
    };
  }

  // console.log({vendor, items: paymentRecord.items})
  for (const item of paymentRecord.items) {
    const indexToRemove = vendor?.datesBooked?.findIndex(
      // Note: Vendor date removal seems separate to market update
      (table: { date: string }) => table.date === item.date
    );

    if (indexToRemove !== undefined && indexToRemove !== -1) {
      vendor.datesBooked.splice(indexToRemove, 1); // Vendor date removal
    }

    const dayWithTable = market.daysWithTables.find(
      (day: { date: string }) => day.date === item.date
    );

    if (dayWithTable) {
      const tableToUpdate = dayWithTable.tables.find(
        // Renamed 'table' to 'tableToUpdate' for clarity
        (table: { table: { id: string } }) => table.table.id === item.tableId
      );
      if (tableToUpdate) {
        tableToUpdate.booked = undefined; // Unbook the table in the original market object
      }
    }
  }

  // create new vendors
  const newVendors = [
    ...market.vendors?.filter(
      (vendor: { vendor: { _ref: string } }) =>
        vendor.vendor._ref !== paymentRecord.vendorId
    ),
  ];

  try {
    await sanityWriteClient
      .patch(paymentRecord._id)
      .set({
        status: "cancelled",
        paymentReturned: true,
      })
      .commit();

    // update vendor credits
    if (data.returnedCredits && data.returnedCredits > 0) {
      await sanityWriteClient
        .patch(sanityVendor._id)
        .set({
          credits: Number(
            +((sanityVendor.credits ?? 0) + data.returnedCredits).toFixed(2)
          ),
        })
        .commit();
    }

    // update market
    await sanityWriteClient
      .patch(market._id)
      .set({
        vendors: newVendors,
        daysWithTables: market.daysWithTables,
      })
      .commit();

    revalidatePath("/admin/", "layout");
    revalidatePath("/dashboard/", "layout");
    // console.log({ sanityVendor });
    await sendCancelEmail(sanityVendor.email);
    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: ["something went wrong"],
    };
  }
};
