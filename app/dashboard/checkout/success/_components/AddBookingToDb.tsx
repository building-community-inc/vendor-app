"use client";

import { getExistingPayment } from "@/sanity/queries/payments";
import { useEffect } from "react";

const AddBookingToDb = ({ paymentIntent, paymentIntentId }: { paymentIntent: string, paymentIntentId: string }) => {

  useEffect(() => {
    const localUrl = window.location.href.split("/dashboard")[0];

    const addBookingToBackend = async () => {
      const existingPayment = await getExistingPayment(paymentIntentId);

      if (existingPayment) {
        return;
      }

      const response = await fetch(
        `${localUrl}/dashboard/checkout/success/api`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: paymentIntent,
        }
      );

      return response;
    };
    const res = addBookingToBackend();
  }, []);
  return <div className="hidden" />;
};

export default AddBookingToDb;
