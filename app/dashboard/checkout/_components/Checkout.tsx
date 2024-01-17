"use client";
import React, { useEffect, useState } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { TShortMarketSchema } from "@/zod/checkout";
import { TSelectedTableType } from "../../markets/[id]/select-preferences/_components/SelectOptions";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function Checkout({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [clientSecret, setClientSecret] = useState("");

  console.log({ searchParams: searchParams });
  const selectedTables =
    typeof searchParams.selectedTables === "string"
      ? JSON.parse(searchParams.selectedTables)
      : [];
  const specialRequest =
    typeof searchParams.specialRequest === "string"
      ? JSON.parse(searchParams.specialRequest)
      : "";
  const totalToPay =
    typeof searchParams.totalToPay === "string"
      ? Number(searchParams.totalToPay)
      : 0;
  const market: TShortMarketSchema =
    typeof searchParams.market === "string"
      ? JSON.parse(searchParams.market)
      : {};


  const items = selectedTables.map((table: TSelectedTableType) => {
    return {
      price: table.table.table.price,
      tableId: table.table.table.id,
      name: `${market.name} at ${market.venue.title} in ${market.venue.city} on ${table.date}}`,
      date: table.date,
    };
  });
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/dashboard/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, market, specialRequest, totalToPay }),
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
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}
