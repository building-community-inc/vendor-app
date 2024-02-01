import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import ContinueButton from "@/app/dashboard/markets/[id]/_components/ContinueButton";
import { usePayLaterStore } from "./store";

export default function CheckoutLateForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const {clientSecret, userPayment} = usePayLaterStore();
  
  React.useEffect(() => {
    if (!stripe) {
      return;
    }


    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Please fill in your information.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    
    const localUrl = window.location.href.split("/dashboard")[0];

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${localUrl}/dashboard/checkout/create-later-payment-intent/success/api?userPayment=${encodeURIComponent(JSON.stringify(userPayment))}`,
        receipt_email: "julian.m.bustos@gmail.com",
        // save_payment_method: true,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "auto",

  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col px-10">
      <PaymentElement id="payment-element" options={paymentElementOptions} className="" />
      <ContinueButton disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner">paying...</div> : "Pay now"}
        </span>
      </ContinueButton>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-red-300 mt-3 mx-auto">{message}</div>}
    </form>
  );
}
