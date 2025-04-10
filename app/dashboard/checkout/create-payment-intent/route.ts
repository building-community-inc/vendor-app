import {
  zodCheckoutStateSchemaRequired,
  zodPaymentIntentSchema,
} from "@/zod/checkout";
import { currentUser } from "@clerk/nextjs/server";
import { getSanityUserByEmail } from "@/sanity/queries/user";
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: Request) => {
  const body = await req.json();

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

  if (!body.items) {
    return Response.json({ status: 400, body: { message: "No items" } });
  }

  const parsedBody = zodCheckoutStateSchemaRequired.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({
      status: 400,
      body: { message: parsedBody.error },
    });
  }

  const paymentObj = {
    amount: parseInt(`${parsedBody.data.totalToPay * 100}`),
    currency: "cad",
    metadata: {
      items: JSON.stringify(parsedBody.data.items.map((item) => ({
        date: item.date,
        tableId: item.tableId,
        price: item.price,
      }))),
      creditsApplied: parsedBody.data.creditsApplied,
      creditsLeft: (user.credits ?? 0) - (parsedBody.data.creditsApplied ?? 0),
      userEmail: user.email,
      business: user.business?.businessName,
      specialRequest: parsedBody.data.specialRequest,
      marketId: parsedBody.data.market._id,
      totalToPay: parsedBody.data.totalToPay,
      paidNow: parsedBody.data.depositAmount,
      paymentType: parsedBody.data.paymentType,
      hst: parsedBody.data.hst,
      dueNowWithHst: parsedBody.data.totalToPay,
    },
  };

// console.log({amount: parseInt(`${parsedBody.data.totalToPay * 100}`)})

  const parsedPaymentObj = zodPaymentIntentSchema.safeParse(paymentObj);

  if (!parsedPaymentObj.success) {
    return Response.json({
      status: 400,
      body: { message: parsedPaymentObj.error },
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(paymentObj);

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log({error})
    return Response.json({
      status: 400,
      body: { message: error },
    });
  }
};
