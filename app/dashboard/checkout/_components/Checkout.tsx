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
import Spinner from "@/app/_components/Spinner";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE || ""
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");


  const { items, market, specialRequest, totalToPay, paymentType, hst, depositAmount, price, creditsApplied } = useCheckoutStore();

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
        console.log({data})
        throw new Error("Client secret not found in response");
      }
    } catch (error) {
      console.error("Error during payment intent creation:", error);
      // Optionally, you can display an error message to the user
    }
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads\
    const body = JSON.stringify({ items, market, specialRequest, totalToPay, depositAmount, paymentType, hst, price, creditsApplied });

    console.log({ body });


    createPaymentIntent(body);

    // fetch("/dashboard/checkout/create-payment-intent", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body,
    // })
    //   .then((res) => res.json())
    //   .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance: Appearance = {
    theme: "night",
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };
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
                    <td className="">{formatMarketDate(item.date)}</td>
                    <td className="">{item.tableId}</td>
                    <td className="">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <section className="flex flex-col gap-2 font-darker-grotesque">
              <h3 className="font-bold">Price:</h3>
              <span>${price}</span>
              {creditsApplied && creditsApplied > 0 && (

                <div className="">
                  <h3 className="font-bold">
                    Credits Applied
                  </h3>
                  <p>
                    ${creditsApplied}
                  </p>
                </div>
              )}
              <div className="w-full">
                <h3 className="font-bold">Deposit Amount:</h3>
                <span>${depositAmount}</span>
              </div>
              <div>
                <h3 className="font-bold">HST:</h3>
                <p>${hst}</p>
              </div>
              <div>
                <h3 className="font-bold">Total Deposit:</h3>
                <p>$
                  {totalToPay}</p>
              </div>
              <div>
                <h3 className="font-bold">Amount Owing:</h3>
                <p>$
                  {price - depositAmount}</p>
              </div>

            </section>

            {specialRequest && (
              <p>
                <strong className="mr-[1ch]">Special Request:</strong>
                {specialRequest}
              </p>
            )}
          </section>

          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
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
