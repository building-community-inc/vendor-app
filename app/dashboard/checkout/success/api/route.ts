import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { Stripe } from "stripe";
import { nanoid } from "nanoid";
import { getExistingPayment } from "@/sanity/queries/payments";

export type TPaymentItem = {
  price: number;
  name: string;
  date: string;
  tableId: string;
};

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({
      status: 405,
      body: { message: "Method not allowed" },
    });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (!user) {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  const rawBody = await req.text();

  const { paymentIntent, specialRequest, idForPaymentRecord } = JSON.parse(
    rawBody
  ) as {
    paymentIntent: Stripe.PaymentIntent;
    specialRequest: string;
    idForPaymentRecord: string;
  };

  if (!paymentIntent) {
    return Response.json({
      status: 400,
      body: { message: "No payment intent" },
    });
  }

  const existingPayment = await getExistingPayment(paymentIntent.id);

  if (existingPayment) {
    // console.log("exiting:", { existingPayment });
    return Response.json({
      status: 400,
      body: { message: "Payment already exists" },
    });
  }

  const items = JSON.parse(paymentIntent.metadata.items) as TPaymentItem[];
  const marketId = paymentIntent.metadata.marketId as string;

  const marketDocument = await sanityWriteClient.fetch(
    "*[_id == $id][0]{...}",
    { id: marketId }
  );

  // Find the day and table to update
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
    specialRequests: specialRequest, // Any special requests
    datesBooked: datesBooked,
    _key: nanoid(),
  };

  // Find the day and table to update
  for (const item of items) {
    // Find the day with the correct date
    const day = marketDocument.daysWithTables.find(
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
    _id: idForPaymentRecord, // generate a unique ID
    user: {
      _type: "reference",
      _ref: user._id,
    },
    market: {
      _type: "reference",
      _ref: marketId,
    },
    amount: {
      _type: "object",
      total: +paymentIntent.metadata.totalToPay,
      paid: paymentIntent.amount / 100,
      owed: +paymentIntent.metadata.totalToPay - paymentIntent.amount / 100,
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

  if (!existingPayment) {
    const updatedMarket = {
      ...marketDocument,
      vendors: [...(marketDocument.vendors || []), vendorDetails],
    };
    // console.log({ updatedMarket });
    const createdPaymentRecord = await sanityWriteClient.create(paymentRecord);
    // Update the market document in the database

    const sanityUpdatedMarketResp = await sanityWriteClient
      .patch(marketId)
      .set(updatedMarket)
      .commit();
    return Response.json({
      message: "success",
    });
  }
};
