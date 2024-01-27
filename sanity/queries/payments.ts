import { sanityClient } from "../lib/client";

export const getExistingPayment = async (paymentIntentId: string) => {
  const result = await sanityClient.fetch(
    '*[_type == "paymentRecord" && payments[].stripePaymentIntentId match $paymentId][0]',
    { paymentId: paymentIntentId }
  );

  return result;
};
