import { stripe } from "@/stripe";
import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import { TPaymentItem } from "./api/route";
import { formatDateWLuxon } from "@/utils/helpers";
import { sanityClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
// import { Resend } from "resend";
import ContinueButton from "../../markets/[id]/_components/ContinueButton";
import Link from "next/link";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { getPaymentById } from "@/sanity/queries/payments";
import { unstable_noStore } from "next/cache";
import { updatePaymentRecord } from "./updatePaymentRecordAction";
import { createPaymentRecord } from "./createPaymentRecordAction";
import { updateUserCredits } from "./updateUserCreditsAction";
import { currentUser } from "@clerk/nextjs/server";
import { getSanityUserByEmail } from "@/sanity/queries/user";

const Page = async (
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  unstable_noStore();

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <div>Not authorized</div>;
  }

  const user = await getSanityUserByEmail(clerkUser.emailAddresses[0].emailAddress);

  if (!user) {
    return <div>Not authorized</div>;
  }


  const paymentIntentId =
    typeof searchParams.payment_intent === "string"
      ? searchParams.payment_intent
      : "";

  const paymentRecordId = searchParams.paymentRecordId as string;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    return (
      <main>
        <h1>Payment Failed</h1>
      </main>
    );
  }


  const partialCreditPayment = paymentRecordId && (await getPaymentById(paymentRecordId));

  // console.log({partialCreditPayment, paymentRecordId})

  const existingStripePayment = await sanityClient.fetch(
    '*[_type == "paymentRecord" && payments[].stripePaymentIntentId match $paymentId][0]',
    { paymentId: paymentIntent.id }
  );

  if (partialCreditPayment && partialCreditPayment.amount.owed && partialCreditPayment.amount.owed > 0) {
    const updatedPaymentRecord = {
      _id: partialCreditPayment._id,
      amount: {
        ...partialCreditPayment.amount,
        paid: partialCreditPayment.amount.paid + paymentIntent.amount / 100,
        owed: partialCreditPayment.amount.owed - (paymentIntent.amount / 100),
      },
      payments: [
        ...(partialCreditPayment.payments || []),
        {
          _key: nanoid(),
          _type: "payment",
          paymentType: "stripe" as string,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          paymentDate: new Date().toISOString(),
        },
      ],
    };

    try {
      // console.log("updating payment record", {updatePaymentRecord})
      await updatePaymentRecord(updatedPaymentRecord);
      // const creditsLeft = +paymentIntent.metadata.creditsLeft;
      // if (creditsLeft) {
      //   // console.log({creditsLeft})
      //   // await updateUserCredits(creditsLeft, user._id);
      // }
      // await updateUserCredits(paymentIntent.metadata.creditsLeft, user._id);
    } catch (error) {
      console.error(`Failed to update payment record: ${error}`);
    }
  }

  if (!existingStripePayment && !partialCreditPayment && paymentIntent) {
    try {
      // console.log("creating payment record", {paymentIntent})
      await createPaymentRecord(paymentIntent);
      if (user.credits !== +paymentIntent.metadata.creditsLeft) {
        await updateUserCredits(+paymentIntent.metadata.creditsLeft, user._id);
      }

    } catch (error) {
      console.error(`Failed to create payment record: ${error}`);
    }
  }

  // const resend = new Resend(process.env.RESEND_API_KEY);

  // const eResp = await resend.emails.send({
  //   from: "julian.m.bustos@gmail.com",
  //   to: "julian.m.bustos@gmail.com",
  //   subject: "Hello World",
  //   html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  // });


  const market = await getMarketById(paymentIntent.metadata.marketId);

  const items = JSON.parse(paymentIntent.metadata.items) as TPaymentItem[];


  return (
    <main className="pt-14 px-5 w-full min-h-screen max-w-3xl mx-auto flex flex-col items-center gap-6">

      <IoMdCheckmarkCircleOutline className="text-[#35d124] border-2 w-24 h-24 border-secondary rounded-full" />
      <h1 className="text-xl font-semibold">Payment Success!</h1>
      <p className="">Vendor Table has been reserved for:</p>
      <h2 className="text-lg font-semibold">{market?.name}</h2>
      <section className="w-fit flex flex-col gap-24">

        <table className="w-full text-left">
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
                <td className="">{formatDateWLuxon(item.date)}</td>
                <td className="">{item.tableId}</td>
                <td className="">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="w-full">
          <p>
            <strong>Order Id:</strong> {paymentIntent.id}
          </p>
          <p>
            <strong>Paid:</strong> ${paymentIntent.amount / 100}
          </p>
          {/* <p>
            <strong>Still Owing:</strong> ${paymentIntent.metadata.amountOwing}
          </p> */}
          {/* <p>
            <strong>Price before tax:</strong> ${paymentIntent.metadata.totalToPay}
          </p> */}
        </section>
        <footer className="flex gap-10 flex-wrap">

          <Link href="/dashboard/">
            <ContinueButton>
              Back to Profile
            </ContinueButton>
          </Link>
          <Link href="/dashboard/explore">
            <ContinueButton>
              Book Another Market
            </ContinueButton>
          </Link>
        </footer>
      </section>
    </main>
  );
};

export default Page;
