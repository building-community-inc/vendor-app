import {
  zodCheckoutStateSchemaRequired,
  zodPaymentIntentSchema,
} from "@/zod/checkout";
import { currentUser } from "@clerk/nextjs";
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
  console.log("in crreate-payment-intetn", { body });

  const parsedBody = zodCheckoutStateSchemaRequired.safeParse(body);

  console.log({ parsedBody });

  if (!parsedBody.success) {
    return Response.json({
      status: 400,
      body: { message: parsedBody.error },
    });
  }

  const paymentObj = {
    amount: parsedBody.data.dueNow * 100,
    currency: "cad",
    metadata: {
      items: JSON.stringify(parsedBody.data.items),
      userEmail: user.email,
      business: user.business?.businessName,
      specialRequest: parsedBody.data.specialRequest,
      marketId: parsedBody.data.market._id,
      amountOwing: parsedBody.data.totalToPay - parsedBody.data.dueNow,
      totalToPay: parsedBody.data.totalToPay,
      paidNow: parsedBody.data.dueNow,
      paymentType: parsedBody.data.paymentType,
    },
  };

  const parsedPaymentObj = zodPaymentIntentSchema.safeParse(paymentObj);

  if (!parsedPaymentObj.success) {
    return Response.json({
      status: 400,
      body: { message: parsedPaymentObj.error },
    });
  }

  const paymentIntent = await stripe.paymentIntents.create(
    parsedPaymentObj.data
  );
  // Create a PaymentIntent with the order amount and currency
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: dueNow * 100,
  //   currency: "cad",
  //   metadata: {
  //     items: JSON.stringify(items),
  //     userEmail: user.email,
  //     business: user.business?.businessName,
  //     specialRequest,
  //     marketId: market._id,
  //     amountOwing: totalToPay - dueNow,
  //     totalToPay,
  //     paidNow: dueNow,
  //   },
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  // automatic_payment_methods: {
  //   enabled: true,
  // },
  // });

  // console.log({ paymentIntent , items })

  return Response.json({
    clientSecret: paymentIntent.client_secret,
  });
};
