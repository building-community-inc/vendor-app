"use server"

import { sanityWriteClient } from "@/sanity/lib/client";

type PaymentRecordToUpdate = {
  _id: string;
  payments: {
      paymentType?: string | null | undefined;
      _key: string;
      paymentDate: string;
      amount: number;
      _type: string;
      stripePaymentIntentId?: string | null | undefined;
  }[];
  amount: {
      paid: number;
      total: number;
      owed: number;
      hst: number;
  };
};

export const updatePaymentRecord = async (updatedPaymentRecord: PaymentRecordToUpdate) => {
  // console.log(`Updating payment record}`);
  try {
    await sanityWriteClient.patch(updatedPaymentRecord._id).set(updatedPaymentRecord).commit();
  } catch (error) {
    console.error(`Failed to update payment record: ${error}`);
    throw new Error(`Failed to update payment record: ${error}`);
  }
};