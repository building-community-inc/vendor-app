"use client";
import React, { useEffect } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { usePayLaterStore } from "./store";
import CheckoutLateForm from "./CheckoutLateForm";
import { TPaymentItem } from "../../success/api/route";
import { formatDateWLuxon } from "@/utils/helpers";
import Spinner from "@/app/_components/Spinner";
import { HST } from "../../_components/checkoutStore";
// import CheckoutForm from "./CheckoutForm";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE || ""
);

export default function CheckoutLate() {
  // const [clientSecret, setClientSecret] = useState("");



  const { userPayment, clientSecret, setClientSecret } = usePayLaterStore();
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/dashboard/checkout/create-later-payment-intent/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPayment }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error("Error:", error));
  }, []);

  const appearance: Appearance = {
    theme: "night",
  };
  const options: StripeElementsOptions = {
    clientSecret: clientSecret ? clientSecret : undefined,
    appearance,
  };

  if (!userPayment) {
    return (
      <main>
        <h1>Payment Not Found</h1>
      </main>
    );
  }

  const { market, items } = userPayment;
  return (
    <section className={`pt-14 px-5 w-full min-h-screen max-w-3xl mx-auto ${clientSecret ? "" : "grid place-content-center"}`}>
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
            <p>
              <strong className="mr-[1ch]">Amount Paid:</strong>
              ${userPayment?.amount.paid && userPayment.amount.paid - userPayment.amount.hst}
            </p>
            <p>
              <strong className="mr-[1ch]">Amount Owed:</strong>
              ${userPayment?.amount.owed && userPayment.amount.owed}
            </p>
            <p>
              <strong className="mr-[1ch]">Amount Being Paid Now:</strong>
              ${userPayment?.amount.owed && userPayment.amount.owed}
            </p>
            <p>
              <strong className="mr-[1ch]">HST:</strong>
              ${userPayment?.amount.owed && (userPayment.amount.owed * HST).toFixed(2)}
            </p>

            <p>
              <strong className="mr-[1ch]">Total:</strong>
              ${userPayment?.amount.owed && (userPayment.amount.owed + userPayment.amount.owed * HST).toFixed(2)}
            </p>

            {/* {userPayment.specialRequest && (
            <p>
              <strong className="mr-[1ch]">Special Request:</strong>
              {specialRequest}
            </p>
          )} */}
          </section>
          <div className="">

            <Elements options={options} stripe={stripePromise}>
              <CheckoutLateForm />
            </Elements>
          </div>
        </section>
      ) : (
        <Spinner />
      )}
    </section>
  );
}
