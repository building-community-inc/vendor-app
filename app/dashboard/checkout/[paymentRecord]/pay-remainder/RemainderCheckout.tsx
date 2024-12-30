"use client";

import { zodCheckoutStateSchemaRequired } from "@/zod/checkout";
import { Appearance, loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { TPaymentItem } from "../../success/api/route";
import { formatDateWLuxon } from "@/utils/helpers";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../_components/CheckoutForm";
import Spinner from "@/app/_components/Spinner";

const appearance: Appearance = {
  theme: "stripe",
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE || ""
);
const RemainderCheckout = ({ userEmail, items, market, price, owed, totalWithHst, paymentRecordId }: {
  items: {
    price: number;
    tableId: string;
    date: string;
    name: string;
  }[];
  market: {
    name: string;
    _id: string;
    venue: {
      title: string;
      address: string;
      city: string;
      phone?: string | null | undefined;
    };
  };
  price: number;
  owed: number;
  totalWithHst: number;
  // specialRequest: string;
  paymentRecordId: string;
  userEmail: string;
}) => {
  const [clientSecret, setClientSecret] = useState("");

  // const { setAllCheckoutData, creditsApplied } = useCheckoutStore();

  const parsedCheckoutState = zodCheckoutStateSchemaRequired.safeParse({
    items,
    paymentType: 'partial',
    market: market,
    price,
    creditsApplied: 0,
    depositAmount: owed,
    hst: +(owed * 0.13).toFixed(2),
    totalToPay: owed,
    // specialRequest,
    dueNowWithHst: owed + owed * 0.13,
  })



  const createPaymentIntent = async (body: string) => {
    try {
      const response = await fetch("/dashboard/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message}`);
      }

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        console.log({ data })
        throw new Error("Client secret not found in response");
      }
    } catch (error) {
      console.error("Error during payment intent creation:", error);
      // Optionally, you can display an error message to the user
    }
  };


  useEffect(() => {
    // setAllCheckoutData(parsedCheckoutState.data)
    if (!parsedCheckoutState.success) {
      return;
    }
  
    const body = JSON.stringify({
      items,
      market,
      specialRequest: "",
      totalToPay: owed,
      depositAmount: owed,
      paymentType: "full",
      hst: parsedCheckoutState.data.hst,
      price: parsedCheckoutState.data.price,
      creditsApplied: 0
    });

    createPaymentIntent(body);

  }, [])
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };
  if (!parsedCheckoutState.success) {
    alert("Something went wrong. Please try again.");
    console.error(parsedCheckoutState.error);
    return;
  }


  return (
    <section className={`text-black pt-14 px-5 w-full min-h-screen max-w-3xl mx-auto ${clientSecret ? "" : "grid place-content-center"}`}>
      {clientSecret ? (
        <section className="flex flex-col">
          <section className="px-10 py-5">

            <h1 className="text-lg font-semibold">Complete Your Vendor Table Reservation</h1>
            <h2 className="font-semibold ">
              {market?.name}
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr className="w-full">
                  <th>Date</th>
                  <th>Table ID</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item: TPaymentItem, index: number) => (
                  <tr key={index} className="w-full">
                    <td className="">{formatDateWLuxon(item.date)}</td>
                    <td className="">{item.tableId}</td>
                    <td className="">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <section className="flex flex-col gap-2 font-darker-grotesque">
              <h3 className="font-bold">Price:</h3>
              <span>${price}</span>
         
              <div className="w-full">
                <h3 className="font-bold">Deposit Amount:</h3>
                <span>${parsedCheckoutState.data.depositAmount}</span>
              </div>
              <div>
                <h3 className="font-bold">HST:</h3>
                <p>${parsedCheckoutState.data.hst}</p>
              </div>
              <div>
                <h3 className="font-bold">Total Deposit:</h3>
                <p>$
                  {parsedCheckoutState.data.totalToPay}</p>
              </div>
              <div>
                <h3 className="font-bold">Amount Owing:</h3>
                <p>$
                  {parsedCheckoutState.data.depositAmount}</p>
              </div>

            </section>
          </section>

          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm userEmail={userEmail} paymentRecordId={paymentRecordId} />
          </Elements>
        </section>
      ) : (
        <div className="w-fit mx-auto ">

          <Spinner />
        </div>
      )}
    </section>
  );
}

export default RemainderCheckout;