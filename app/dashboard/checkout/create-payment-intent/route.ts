import { TShortMarketSchema } from "./../../../../zod/checkout";
import { currentUser } from "@clerk/nextjs";
import { metadata } from "./../../../layout";
import { getSanityUserByEmail } from "@/sanity/queries/user";

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: Request) => {
  const { items, market, specialRequest, totalToPay } = await req.json();

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

  if (!items)
    return Response.json({ status: 400, body: { message: "No items" } });

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalToPay * 100,
    currency: "cad",
    metadata: {
      items: JSON.stringify(items),
      userEmail: user.email,
      business: user.business?.businessName,
      specialRequest,
      marketId: market._id,
    },
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });

  // console.log({ paymentIntent , items })

  return Response.json({
    clientSecret: paymentIntent.client_secret,
  });
};
