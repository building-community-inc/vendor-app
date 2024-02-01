import { currentUser } from "@clerk/nextjs";
import { getSanityUserByEmail, zodUserPayment } from "@/sanity/queries/user";
import { zodLaterPaymentIntentSchema } from "@/zod/checkout";
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

  const parseUserPayment = zodUserPayment.safeParse(body.userPayment);

  if (!parseUserPayment.success) {
    return Response.json({
      status: 400,
      body: { message: parseUserPayment.error },
    });
  }

  const paymentObj = {
    amount: parseUserPayment.data.amount.owed * 100,
    currency: "cad",
    metadata: {
      items: JSON.stringify(parseUserPayment.data.items),
      userEmail: user.email,
      business: user.business?.businessName,
      marketId: parseUserPayment.data.market._id,
      amountOwing: 0,
      paymentType: "full",
    },
  };

  const parsedPaymentObj = zodLaterPaymentIntentSchema.safeParse(paymentObj);

  if (!parsedPaymentObj.success) {
    return Response.json({
      status: 400,
      body: { message: parsedPaymentObj.error },
    });
  }

  const paymentIntent = await stripe.paymentIntents.create(
    parsedPaymentObj.data
  );

  return Response.json({
    clientSecret: paymentIntent.client_secret,
  });
};
