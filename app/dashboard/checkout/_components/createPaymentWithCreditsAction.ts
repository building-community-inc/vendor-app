"use server";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { TPaymentItem } from "../success/api/route";
import { currentUser } from "@clerk/nextjs";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { unstable_noStore } from "next/cache";

export const createPaymentWithCredits = async (formData: FormData) => {
  unstable_noStore();
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return {
      errors: ["User not found"],
      success: false,
    };
  }

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (!user) {
    return {
      errors: ["User not found"],
      success: false,
    };
  }

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

  // get market to update
  const marketDocument = await sanityClient.getDocument(rawData.marketId);

  if (!marketDocument) {
    return {
      errors: ["Market not found"],
      success: false,
    };
  }

  const datesBooked = rawData.items.map((item: TPaymentItem) => ({
    date: item.date,
    tableId: item.tableId,
    _key: nanoid(),
  }));

  const vendorDetails = {
    vendor: {
      _type: "reference",
      _ref: user._id, // The ID of the vendor
    },
    specialRequests: rawData.specialRequest, // Any special requests
    datesBooked: datesBooked,
    _key: nanoid(),
  };

  // Find the day and table to update
  for (const item of rawData.items) {
    // Find the day with the correct date
    const day = marketDocument?.daysWithTables.find(
      (day: { date: string }) => day.date === item.date
    );

    if (day) {
      // Find the table with the correct ID
      const table = day.tables.find(
        (table: { table: { id: string } }) => table.table.id === item.tableId
      );

      if (table) {
        // Update the booked field
        table.booked = {
          _type: "reference",
          _ref: user._id,
        };
      }
    }
  }

  const paymentRecord = {
    _type: "paymentRecord",
    // _id: idForPaymentRecord, // generate a unique ID
    user: {
      _type: "reference",
      _ref: user._id,
    },
    market: {
      _type: "reference",
      _ref: marketDocument?._id,
    },
    amount: {
      _type: "object",
      total: +rawData.totalToPay,
      paid: +rawData.creditsApplied,
      owed: (+rawData.totalToPay + +rawData.hst) - +rawData.creditsApplied,
      hst: +rawData.hst,
    },
    items: rawData.items.map((item: TPaymentItem) => ({
      price: item.price,
      tableId: item.tableId,
      date: item.date,
      _key: nanoid(),
    })),
    payments: [
      {
        _type: "payment",
        stripePaymentIntentId: undefined,
        amount: +rawData.creditsApplied,
        paymentDate: new Date().toISOString(),
        paymentType: "credits",
        _key: nanoid(),
      },
      // add more payments as needed
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // const vendors = new Set(...(marketDocument.vendors || []), vendorDetails);
  const vendors = [...(marketDocument.vendors || [])];
  vendors.push(vendorDetails);

  const vendorsSet = new Set(vendors);

  const updatedMarket = {
    ...marketDocument,
    vendors: [...vendors],
  };

  try {
    await sanityWriteClient
      .patch(marketDocument._id)
      .set(updatedMarket)
      .commit();

    const createdPaymentRecord = await sanityWriteClient.create(paymentRecord);

    const creditsLeft = user.credits && user.credits - +rawData.creditsApplied;

    await sanityWriteClient
      .patch(user._id)
      .set({ credits: creditsLeft })
      .commit();


    return {
      success: true,
      errors: null,
      paymentRecordId: createdPaymentRecord._id,
    };
  } catch (error) {
    console.log({ error });
    return {
      errors: ["An unknown error occurred"],
      success: false,
    };
  }
};
