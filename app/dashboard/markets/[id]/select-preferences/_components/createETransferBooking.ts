"use server";

import { TPaymentItem } from "@/app/dashboard/checkout/success/api/route";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const itemSchema = z.object({
  price: z.number(),
  name: z.string(),
  date: z.string(),
  tableId: z.string(),
});
const dataParser = z.object({
  items: z.array(itemSchema),
  marketId: z.string(),
  specialRequest: z.string(),
  totalToPay: z.number(),
  depositAmount: z.number(),
  paymentType: z.string(),
  hst: z.number(),
  price: z.number(),
  creditsApplied: z.number(),
});

export const createETransferBooking = async (formData: FormData): Promise<{
  success: true;
  paymentRecordId: string;
} | {
  success: false;
  errors: string[]
}> => {
  console.log("creating booking");
  const user = await currentUser();

  if (!user)
    return {
      success: false,
      errors: ["access denied"],
    };

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  const rawData = {
    items: JSON.parse(formData.get("items") as string),
    marketId: JSON.parse(formData.get("marketId") as string),
    specialRequest: formData.get("specialRequest") as string,
    totalToPay: parseFloat(formData.get("totalToPay") as string),
    depositAmount: parseFloat(formData.get("depositAmount") as string),
    paymentType: formData.get("paymentType") as string,
    hst: parseFloat(formData.get("hst") as string),
    price: parseFloat(formData.get("price") as string),
    creditsApplied: parseFloat(formData.get("creditsApplied") as string),
  };

  const { data, success, error } = dataParser.safeParse(rawData);

  if (!success) {
    console.log({ errors: error.formErrors.fieldErrors });

    return {
      success: false,
      errors: ["something went wrong"],
    };
  }

  const payments = data.creditsApplied > 0 ? [
    {
      _type: "payment",
      amount: data.creditsApplied,
      paymentType: "credit",
      _key: nanoid(),
      paymentDate: new Date().toISOString(),
    },
  ] : [];


  const newPaymentRecord = {
    _type: "paymentRecord",
    status: "pending",
    user: {
      _ref: sanityUser._id,
      _type: "reference",
    },
    market: {
      _type: "reference",
      _ref: data.marketId,
    },
    amount: {
      _type: "object",
      total: +data.totalToPay,
      paid: +data.creditsApplied,
      owed: +data.totalToPay + +data.hst - +data.creditsApplied,
      hst: +data.hst,
    },
    items: data.items.map((item: TPaymentItem) => ({
      price: item.price,
      tableId: item.tableId,
      date: item.date,
      _key: nanoid(),
    })),
    payments,
    specialRequest: data.specialRequest,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const market = await sanityClient.getDocument(rawData.marketId);

  if (!market) {
    return {
      success: false,
      errors: ["market not found"],
    };
  }


  // update days with tables
  let daysWithTables = market?.daysWithTables;
  if (!daysWithTables) {
    return {
      success: false,
      errors: ["Market daysWithTables not found"],
    };
  }

  // for (const item of data.items) {
  //   const dayToUpdate = daysWithTables?.find(day => day.date === item.date)

  //   if (!dayToUpdate) {
  //     return {
  //       success: false,
  //       errors: "day not found"
  //     }
  //   }

  //   const tableToUpdate = dayToUpdate.tables.find(table => table.table.id === item.tableId)

  //   const newTable = {
  //     ...tableToUpdate,
  //     booked: {
  //       _type: "reference",
  //       _ref: user.id
  //     }
  //   }

  //   const newDayObject = {
  //     ...dayToUpdate,
  //     tables: dayToUpdate.tables.map(table => {
  //       if (table.table.id === tableToUpdate?.table.id) {
  //         return newTable
  //       } else  {
  //         return table;
  //       }
  //     })
  //   }

  // }

  for (const item of data.items) {
    const dayToUpdateIndex = daysWithTables.findIndex(
      (day: { date: string }) => day.date === item.date
    );

    if (dayToUpdateIndex === -1) {
      return {
        success: false,
        errors: [`Day with date ${item.date} not found`], // More informative error
      };
    }

    const dayToUpdate = daysWithTables[dayToUpdateIndex];
    const tableToUpdateIndex = dayToUpdate.tables.findIndex(
      (table: { table: { id: string } }) => table.table.id === item.tableId
    );

    if (tableToUpdateIndex === -1) {
      return {
        success: false,
        errors: [
          `Table with id ${item.tableId} not found for date ${item.date}`,
        ], // More informative error
      };
    }

    const tableToUpdate = dayToUpdate.tables[tableToUpdateIndex];

    // Create a new table object with updated booked info - more direct and clear
    const updatedTable = {
      ...tableToUpdate,
      booked: {
        _type: "reference",
        _ref: sanityUser._id,
      },
    };

    // Create a new tables array for the day, replacing the old table with the updated one
    const updatedTables = [...dayToUpdate.tables]; // Create a copy to avoid direct mutation
    const zodTables = z.array(
      z.object({
        _key: z.string().optional(),
        table: z.object({
          price: z.number(),
          id: z.string(),
        }),
        booked: z
          .object({
            _type: z.string(),
            _ref: z.string(),
          })
          .optional()
          .nullable(),
      }).transform(data => ({
        ...data,
        _key: data._key || nanoid()
      }))
    );

    const parsedUpdatedTables = zodTables.safeParse(updatedTables);

    if (!parsedUpdatedTables.success) {
      return {
        success: false,
        errors: ["something went wrong with the tables"],
      };
    }
    // updatedTables[tableToUpdateIndex] = updatedTable;
    parsedUpdatedTables.data[tableToUpdateIndex] = updatedTable;

    // Create a new day object with the updated tables array
    const updatedDay = {
      ...dayToUpdate,
      tables: parsedUpdatedTables.data,
    };

    // Create a new daysWithTables array, replacing the old day with the updated day
    // const parsedDaysWithTables = zodTables.safeParse(daysWithTables)
    daysWithTables = [...daysWithTables]; // Create a copy of the daysWithTables array
    daysWithTables[dayToUpdateIndex] = updatedDay;

    // console.log({ updated: daysWithTables[dayToUpdateIndex] });
  }

  // After the loop, update the market object with the new daysWithTables
  market.daysWithTables = daysWithTables; // Important: Update the market object

  // console.log({ market });
  // Update vendors List

  const vendors = market.vendors;

  // console.log({ vendorsLeng: vendors.length, userid: sanityUser._id });

  // find vendor to update if not found create one

  const vendorToUpdateIndex = vendors.findIndex(
    (vendor: { vendor: { _ref: string } }) =>
      vendor.vendor._ref === sanityUser._id
  );

  let newDatesBooked = [];

  if (vendors[vendorToUpdateIndex]) {
    // console.log("adding to existing vendor", {vendor: vendors[vendorToUpdateIndex]})
    newDatesBooked = [
      ...vendors[vendorToUpdateIndex].datesBooked,
      ...data.items.map((item) => ({
        _key: nanoid(),
        _type: "day",
        date: item.date,
        tableId: item.tableId,
      })),
    ];
    vendors[vendorToUpdateIndex].datesBooked = newDatesBooked;
  } else {
    // console.log("creating new vendor")
    vendors.push({
      _key: nanoid(),
      datesBooked: data.items.map((item) => ({
        _key: nanoid(),
        _type: "day",
        date: item.date,
        tableId: item.tableId,
      })),
      vendor: { _ref: sanityUser._id, _type: "reference" },
    });
  }
  // console.log({ vendors });

  market.vendors = vendors;

  try {
    const paymentRecordResp = await sanityWriteClient.create(newPaymentRecord);
    const marketResp = await sanityWriteClient.patch(market._id).set(market).commit()
    console.log({ paymentRecordResp, marketResp });
    // console.log({ newPaymentRecord, payments: newPaymentRecord.payments });
    revalidatePath("/dashboard/", "layout");
    revalidatePath("/admin/dashboard/", "layout");

    return {
      success: true,
      // errors: ["something went wrong"],
      paymentRecordId: paymentRecordResp._id
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      errors: ["something went wrong"]
    }
  }

};
