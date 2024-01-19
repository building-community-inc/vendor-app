import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { Stripe } from "stripe";
import { nanoid } from "nanoid";

export type TPaymentItem = {
  price: number;
  name: string;
  date: string;
  tableId: string;
}

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
  // console.log({rawBody});
  
  const { paymentIntent, specialRequest } = JSON.parse(rawBody) as {
    paymentIntent: Stripe.PaymentIntent;
    specialRequest: string;
  };

  if (!paymentIntent) {
    return Response.json({
      status: 400,
      body: { message: "No payment intent" },
    });
  }
  
  const existingPayment = await sanityWriteClient.fetch(
    '*[_type == "payment" && stripePaymentIntendId == $paymentId][0]',
    { paymentId: paymentIntent.id }
  );

  if (existingPayment) {
    console.log("exiting:", {existingPayment})
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
  const datesBooked = items.map(item => ({
    date: item.date,
    tableId: item.tableId,
    _key: nanoid()
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

  // console.log({ vendorDetails });

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
        // console.log({ table });

        // Add the updated table to the array
      }
    }
  }

  // Create the payment document
  const payment = {
    _type: "payment",
    _id: paymentIntent.id,
    user: {
      _type: "reference",
      _ref: user._id,
    },
    market: {
      _type: "reference",
      _ref: marketId,
    },
    amount: paymentIntent.amount, // replace with the actual amount
    status: paymentIntent.status,
    stripePaymentIntendId: paymentIntent.id,
    items: items.map((item) => ({
      ...item,
      _key: nanoid(),
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };


  // console.log({
  //   updatedTables,
  //   paymentIntent,
  //   payment,
  //   existingPayment,
  // });

  if (!existingPayment) {

    const updatedMarket = {
      ...marketDocument,
      vendors: [...marketDocument.vendors || [], vendorDetails],
    }
    console.log({updatedMarket})
    const createdPayment = await sanityWriteClient.create(payment);
    // Update the market document in the database

    const sanityUpdatedMarketResp = await sanityWriteClient
      .patch(marketId)
      .set(updatedMarket)
      .commit();
    // console.log({ createdPayment, sanityUpdatedMarketResp });
  }

  return Response.json({
    message: "success",
  });
};