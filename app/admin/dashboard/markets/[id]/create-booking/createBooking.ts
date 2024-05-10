"use server";

import { zodLatePaymentWithMarketSchema } from "@/sanity/queries/payments";
import { z } from "zod";

export const createBooking = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const rawFormData = Object.fromEntries(formData);
  const bookings = [];

  for (const key in rawFormData) {
    if (key.startsWith("date-")) {
      const date = key.split("date-")[1];
      const tableId = rawFormData[`table-${date}`];

      bookings.push({
        date,
        tableId: tableId === "null" ? null : tableId,
      });
    }
  }

  const data = {
    vendorId: formData.get("vendorId"),
    stripePaymentId: formData.get("stripePaymentId"),
    paymentOption: formData.get("payment-option"),
    paymentType: formData.get("payment-type"),
    bookings,
    paid: formData.get("paid"),
    total: formData.get("total"),
    owed: formData.get("owed"),
  };

  const parsedData = zodRawDataSchema.safeParse(data);

  if (!parsedData.success) {
    console.log({ bookings: data.bookings });
    const errors = parsedData.error.errors.map((error) => {
      console.log({ error });
      const message = error.message;
      return `${message}`;
    });

    return {
      errors,
      success: false,
    };
  }

  // TODO GENERATE PAYMENT RECORD

  const newPaymentRecord: TPaymentRecord = {
    _type: "paymentRecord",
    payments: [
      {
        _key: "nanoid()",
        paymentDate: new Date().toISOString(),
        stripePaymentIntentId: parsedData.data.stripePaymentId,
        amount: 0,
        paymentType: parsedData.data.paymentType,
        _type: "payment",
      },
    ],
    amount: {
      paid: 0,
      total: 0,
      owed: 0,
      hst: 0,
    },
    items: [],
    market: {
      _type: "reference",
      _ref: "marketName",
    },
  };

  // TODO UPDATE MARKET DAY WITH TABLES AND VENDORS ARRAYS

  return {
    errors: ["q paso rick?"],
    success: false,
  };
};

const bookingSchema = z.object({
  date: z.string(),
  tableId: z.string({
    invalid_type_error: "Please select a table for the selected date",
    required_error: "Please select a table for the selected date",
  }),
});

const zodRawDataSchema = z
  .object({
    vendorId: z.string({ invalid_type_error: "Please select a vendor" }),
    paymentOption: z.string({
      invalid_type_error: "Please select a payment option",
    }),
    stripePaymentId: z.string().optional().nullable(),
    paymentType: z.union([z.literal("cash"), z.literal("stripe")], {
      errorMap: (error) => {
        console.log("Zod Literal Error", error.code);

        if (error.code === "invalid_literal") {
          return {
            message: "Please select a payment type",
          };
        }

        return {
          message: error.message ?? "Please select a payment type",
        };
      },
    }),
    bookings: z
      .array(bookingSchema)
      .min(1, "Please select at least 1 day and table"),
    total: z.string().transform(Number),
    paid: z.string().transform(Number),
    owed: z.string().transform(Number),
  })
  .refine(
    (data) => {
      // If paymentOption is 'stripe', stripePaymentId must be present
      if (
        data.paymentType === "stripe" &&
        (!data.stripePaymentId || data.stripePaymentId.length < 1)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Stripe Payment Id is required when payment type is Stripe",
      path: ["stripePaymentId"],
    }
  );

const zodSanityReferenceSchema = z.object({
  _type: z.literal("reference"),
  _ref: z.string(),
  _key: z.string().optional().nullable(),
});

const zodPaymentRecordSchemaSanityReady = zodLatePaymentWithMarketSchema.merge(
  z.object({
    market: zodSanityReferenceSchema,
    _type: z.literal("paymentRecord"),
    _id: z.string().optional().nullable(),
  })
);

type TPaymentRecord = z.infer<typeof zodPaymentRecordSchemaSanityReady>;
