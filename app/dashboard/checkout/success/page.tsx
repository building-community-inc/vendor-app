import { stripe } from "@/stripe";
import AddBookingToDb from "./_components/AddBookingToDb";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const paymentIntentId =
  typeof searchParams.payment_intent === "string"
  ? searchParams.payment_intent
  : "";
  
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  // console.log({ searchParams, paymentIntent });

  if (!paymentIntent || paymentIntent.status !== "succeeded") {
    return (
      <main>
        <h1>Payment Failed</h1>
      </main>
    );
  };

  return (
    <main>
      <h1>Successful Payment</h1>
      <AddBookingToDb paymentIntent={JSON.stringify({ paymentIntent })} />
    </main>
  );
};

export default Page;
