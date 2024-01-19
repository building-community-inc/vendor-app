import { stripe } from "@/stripe";
import AddBookingToDb from "./_components/AddBookingToDb";
import { getMarketById } from "@/sanity/queries/admin/markets";
import { TPaymentItem } from "./api/route";
import { formatMarketDate } from "@/utils/helpers";
// import { Resend } from "resend";

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
  }

  // const resend = new Resend(process.env.RESEND_API_KEY);

  // const eResp = await resend.emails.send({
  //   from: "julian.m.bustos@gmail.com",
  //   to: "julian.m.bustos@gmail.com",
  //   subject: "Hello World",
  //   html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  // });

  // console.log({ eResp });

  const market = await getMarketById(paymentIntent.metadata.marketId);

  const items = JSON.parse(paymentIntent.metadata.items) as TPaymentItem[];

  // console.log({ items });

  return (
    <main className="pt-14 px-5 w-full min-h-screen max-w-3xl mx-auto w-[80%]">
      <AddBookingToDb paymentIntent={JSON.stringify({ paymentIntent })} />
      <h1 className="text-xl font-semibold">Subscribed to {market?.name}</h1>
      <h2>Payment Successful</h2>
      <h3 className="text-lg font-semibold">Items:</h3>
      <table className="w-full">
        <thead>
          <tr className="w-full">
            <th>Date</th>
            <th>Table ID</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="w-full">
              <td className="text-center">{formatMarketDate(item.date)}</td>
              <td className="text-center">{item.tableId}</td>
              <td className="text-center">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>
          <strong>Paid:</strong> ${paymentIntent.amount / 100}
        </p>
        <p>
          <strong>Order Id:</strong> {paymentIntent.id}
        </p>
      </div>
    </main>
  );
};

export default Page;
