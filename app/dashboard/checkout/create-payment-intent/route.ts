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
  // console.log("in create-later-payment-intent", { body });

  const parsedBody = zodCheckoutStateSchemaRequired.safeParse(body);
  
  if (!parsedBody.success) {
    return Response.json({
      status: 400,
      body: { message: parsedBody.error },
    });
  }
  // console.log({data: parsedBody.data})

  const paymentObj = {
    amount: parsedBody.data.dueNowWithHst * 100,
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
      hst: parsedBody.data.hst,
      dueNowWithHst: parsedBody.data.dueNowWithHst,
    },
  };

  const parsedPaymentObj = zodPaymentIntentSchema.safeParse(paymentObj);


  console.log({parsedPaymentObj, metadata: paymentObj.metadata})
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
