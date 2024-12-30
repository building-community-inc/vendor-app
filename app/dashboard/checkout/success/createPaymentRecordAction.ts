"use server";

import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import { type TPaymentItem } from "./api/route";

export const createPaymentRecord = async (
  paymentIntent: Stripe.Response<Stripe.PaymentIntent>
) => {
  console.log(`Creating payment record`);

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

  const marketDoc = await sanityClient.getDocument(
    paymentIntent.metadata.marketId
  );

  if (!marketDoc) {
    return {
      errors: ["Market not found"],
      success: false,
    };
  }

  const items = JSON.parse(paymentIntent.metadata.items) as TPaymentItem[];

  const datesBooked = items.map((item) => ({
    date: item.date,
    tableId: item.tableId,
    _key: nanoid(),
  }));
  
  const vendorDetails = {
    vendor: {
      _type: "reference",
      _ref: user._id, // The ID of the vendor
    },
    specialRequests: paymentIntent.metadata.specialRequest, // Any special requests
    datesBooked: datesBooked,
    _key: nanoid(),
  };
  for (const item of items) {
    // Find the day with the correct date
    const day = marketDoc.daysWithTables.find(
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
      _ref: marketDoc._id,
    },
    amount: {
      _type: "object",
      total: +paymentIntent.metadata.totalToPay,
      paid: paymentIntent.amount / 100,
      owed: +paymentIntent.metadata.amountOwing,
      hst: +paymentIntent.metadata.hst,
    },
    items: items.map((item) => ({
      ...item,
      _key: nanoid(),
    })),
    payments: [
      {
        _type: "payment",
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        paymentDate: new Date().toISOString(),
        _key: nanoid(),
      },
      // add more payments as needed
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const vendors = [
    ...(marketDoc.vendors || []).filter(
      (vendor: { vendor: { _ref: string } }) => vendor.vendor._ref !== user._id
    ),
    vendorDetails,
  ];

  const updatedMarket = {
    ...marketDoc,
    vendors,
  };

  // console.log({ paymentRecord, updatedMarket });
  try {
    const createdPaymentRecord = await sanityWriteClient.create(paymentRecord);
    // Update the market document in the database

    const sanityUpdatedMarketResp = await sanityWriteClient
      .patch(marketDoc._id)
      .set(updatedMarket)
      .commit();

    // console.log({ sanityUpdatedMarketResp, createdPaymentRecord });
  } catch (error) {
    return {
      errors: ["something went wrong"],
      success: false,
    };
  }
  // try {
  //   await sanityWriteClient.create(paymentRecord);
  // } catch (error) {
  //   console.error(`Failed to create payment record: ${error}`);
  //   throw new Error(`Failed to create payment record: ${error}`);
  // }
};
