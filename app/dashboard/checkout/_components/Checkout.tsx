"use client";
import React, { useEffect, useState } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { TPaymentItem } from "../success/api/route";
import { formatMarketDate } from "@/utils/helpers";
import { useCheckoutStore } from "./checkoutStore";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");


  const {items, market, specialRequest, totalToPay, dueNow, paymentType} = useCheckoutStore();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/dashboard/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, market, specialRequest, totalToPay, dueNow, paymentType }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance: Appearance = {
    theme: "night",
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <main className="pt-14 px-5 w-full min-h-screen max-w-3xl mx-auto">
      {clientSecret && (
        <section className="flex flex-col md:flex-row">
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
          <section>

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
                {items?.map((item: TPaymentItem, index: number) => (
                  <tr key={index} className="w-full">
                    <td className="text-center">{formatMarketDate(item.date)}</td>
                    <td className="text-center">{item.tableId}</td>
                    <td className="text-center">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              <strong>Market:</strong>
              {market?.name}
            </p>
            <p>
              <strong>Amount Being Paid Now:</strong>
              ${dueNow}
            </p>
            <p>
              <strong>Amount Owed:</strong>
              ${totalToPay - dueNow}
            </p>
            <p>
              <strong>Total:</strong>
              ${totalToPay}
            </p>

            {specialRequest && (
              <p>
                <strong>Special Request:</strong>
                {specialRequest}
              </p>
            )}
          </section>
        </section>
      )}
    </main>
  );
}
