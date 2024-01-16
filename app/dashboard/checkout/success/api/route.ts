import { sanityWriteClient } from "@/sanity/lib/client";
import { metadata } from "./../../../../layout";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { TShortMarketSchema } from "@/zod/checkout";
import { currentUser } from "@clerk/nextjs";
import { Stripe } from "stripe";
import { nanoid } from "nanoid";

export const POST = async (req: Request, res: Response) => {
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

  const { paymentIntent } = (await req.json()) as {
    paymentIntent: Stripe.PaymentIntent;
  };

  const items = JSON.parse(paymentIntent.metadata.items) as {
    price: number;
    name: string;
    date: string;
    tableId: string;
  }[];
  const market = JSON.parse(
    paymentIntent.metadata.market
  ) as TShortMarketSchema;

  const marketDocument = await sanityWriteClient.fetch(
    "*[_id == $id][0]{...}",
    { id: market._id }
  );

  // Find the day and table to update
  const updatedTables = [];

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
        updatedTables.push({ table, day: day.date });
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
      _ref: market._id,
    },
    amount: paymentIntent.amount, // replace with the actual amount
    status: paymentIntent.status,
    stripePaymentIntendId: paymentIntent.id,
    items: items.map((item) => ({
      ...item,
      _key: nanoid(),
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const existingPayment = await sanityWriteClient.fetch(
    '*[_type == "payment" && stripePaymentIntendId == $paymentId][0]',
    { paymentId: paymentIntent.id }
  );

  // console.log({
  //   updatedTables,
  //   paymentIntent,
  //   payment,
  //   existingPayment,
  // });

  if (!existingPayment) {
    const createdPayment = await sanityWriteClient.create(payment);
    // Update the market document in the database

    const updatedMarket = await sanityWriteClient
      .patch(market._id)
      .set(marketDocument)
      .commit();
    console.log({ createdPayment, updatedMarket });
  }

  // console.log({ updatedMarket });
  return Response.json({
    message: "success",
  });
};
