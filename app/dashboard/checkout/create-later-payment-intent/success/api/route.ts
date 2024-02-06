import { sanityWriteClient } from "@/sanity/lib/client";
import {
  TLatePaymentSchema,
  getPaymentById,
  zodLatePaymentSchema,
} from "@/sanity/queries/payments";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { stripe } from "@/stripe";
import { currentUser } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { HST } from "../../../_components/checkoutStore";

export const GET = async (req: Request) => {
  // console.log("in create-later-payment-intent", { req });

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
  let paymentId = null;

  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);

  // Get a specific parameter
  const paymentIntentId = params.get("payment_intent");
  const paymentStatus = params.get("redirect_status");
  const userPaymentParam = params.get("userPayment");
  let userPayment = null;

  if (userPaymentParam) {
    userPayment = JSON.parse(decodeURIComponent(userPaymentParam));
  }
  // console.log({paymentIntentId, paymentStatus, userPayment})

  if (paymentIntentId && paymentStatus === "succeeded") {
    const sanityPayment = await getPaymentById(userPayment._id);

    const stripePayment = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (stripePayment.status !== "succeeded") {
      return Response.json({
        message: "Payment not successful",
      });
    }

    const amountPaid = stripePayment.amount_received / 100;

    const amountPaidWithoutHst = +(amountPaid / (1 + HST)).toFixed(2);
  
    if (sanityPayment.amount.owed !== amountPaidWithoutHst) {
      return Response.json({
        message: "Payment amount does not match",
      });
    } else {
      const paymentDate = new Date(stripePayment.created * 1000).toISOString();
      const newSanityDocument: TLatePaymentSchema = {
        _id: sanityPayment._id,
        payments: [
          ...sanityPayment.payments,
          {
            _key: nanoid(),
            paymentDate,
            stripePaymentIntentId: stripePayment.id,
            amount: amountPaid,
            _type: "payment",
          },
        ],
        amount: {
          ...sanityPayment.amount,
          paid: sanityPayment.amount.paid + amountPaid,
          owed: sanityPayment.amount.owed - amountPaidWithoutHst,
          hst: sanityPayment.amount.hst + +stripePayment.metadata.hstPaid,
        },
      };

      const parsedPaymentSchema =
        zodLatePaymentSchema.safeParse(newSanityDocument);

      if (!parsedPaymentSchema.success) {
        return Response.json({
          message: parsedPaymentSchema.error,
        });
      }

      const patch = await sanityWriteClient
        .patch(sanityPayment._id)
        .set(parsedPaymentSchema.data)
        .commit() // Perform the update
        .then((updatedDocument) => {
          console.log("updated document", updatedDocument);
          paymentId = updatedDocument._id;
        })
        .catch((err) => {
          console.error("Oh no, the update failed: ", err.message);
        });
    }
  }

  if (paymentId) {
    const localUrl = req.url.split("/dashboard")[0];
    return Response.redirect(
      `${localUrl}/dashboard/checkout/create-later-payment-intent/success?paymentId=${paymentId}`
    );
  }

  return Response.json({
    status: 200,
    body: { message: "Payment not successful" },
  });
};
