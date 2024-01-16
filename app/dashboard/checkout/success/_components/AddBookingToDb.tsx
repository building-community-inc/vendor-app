"use client";

import { useEffect } from "react";

const AddBookingToDb = ({ paymentIntent }: { paymentIntent: string }) => {
  useEffect(() => {
    const localUrl = window.location.href.split("/dashboard")[0];

    const addBookingToBackend = async () => {
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
