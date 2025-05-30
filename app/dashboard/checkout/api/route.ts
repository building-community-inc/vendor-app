import { zodBookMarketOptionsSchema } from "@/zod/checkout";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // apiVersion: "2023-10-16",
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parsedData = zodBookMarketOptionsSchema.safeParse(body);
    
    if (!parsedData.success) {
      return Response.json({
        status: 400,
        body: parsedData.error,
      });
    }

    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Your Product Name",
            },
            unit_amount: 2000, // This is the price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    const charge = await stripe.charges.retrieve(session.payment_intent as string);

  } catch (error) {
    console.error(error);
  }
};
