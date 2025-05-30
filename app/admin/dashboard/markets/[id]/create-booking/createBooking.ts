"use server";

import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
import {
  TPaymentRecord,
  zodPaymentRecordSchemaSanityReady,
  zodSanityMarket,
  zodSanityMarketWithOptionalVendors,
} from "@/sanity/queries/admin/markets/zods";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
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
      const [tableId, tablePrice] = (
        rawFormData[`table-${date}`] as string
      ).split("-");

      bookings.push({
        date,
        tableId: tableId === "null" ? null : tableId,
        tablePrice,
      });
    }
  }

  const data = {
    marketId: formData.get("marketId"),
    vendorId: formData.get("vendorId"),
    stripePaymentId: formData.get("stripePaymentId"),
    paymentOption: formData.get("payment-option"),
    paymentType: formData.get("payment-type"),
    bookings,
    paid: formData.get("paid"),
    total: formData.get("total"),
    owed: formData.get("owed"),
    hst: formData.get("hst"),
  };

  const parsedData = zodRawDataSchema.safeParse(data);

  if (!parsedData.success) {
    const errors = parsedData.error.errors.map((error) => {
      const message = error.message;
      return `${message}`;
    });

    console.log({ errors });

    return {
      errors,
      success: false,
    };
  }

  const newPaymentRecord: TPaymentRecordWithouMarketId = {
    _type: "paymentRecord",
    user: {
      _type: "reference",
      _ref: parsedData.data.vendorId,
    },
    payments: [
      {
        _key: "nanoid()",
        paymentDate: new Date().toISOString(),
        stripePaymentIntentId: parsedData.data.stripePaymentId,
        amount: parsedData.data.paid,
        paymentType: parsedData.data.paymentType,
      },
    ],
    amount: {
      paid: parsedData.data.paid,
      total: parsedData.data.total,
      owed: parsedData.data.owed,
      hst: parsedData.data.hst,
    },
    items: parsedData.data.bookings.map((booking) => {
      return {
        _key: nanoid(),
        tableId: booking.tableId,
        date: booking.date,
        price: booking.tablePrice,
      };
    }),
    market: {
      _type: "reference",
      _ref: parsedData.data.marketId,
    },
    status: parsedData.data.owed > 0 ? "pending" : "paid"
  };

  const parsedPaymentRecord =
    zodPaymentRecordSchemaSanityReady.safeParse(newPaymentRecord);
  if (!parsedPaymentRecord.success) {
    const errors = parsedPaymentRecord.error.errors.map((error) => {
      const message = error.message;
      return `${message}`;
    });
    console.log({ errors });

    return {
      errors,
      success: false,
    };
  }

  const sanityPaymentResponse = await sanityWriteClient.create(
    parsedPaymentRecord.data
  );

  const sanityMarket = await sanityClient.fetch(`
  *[_type == 'market' && _id == "${parsedData.data.marketId}"][0]{
    _id,
    daysWithTables,
    "vendors": vendors[] {
     ...,
      _key,
      datesBooked[] {
        _key,
        date,
        tableId,
        "_type": "day"
      }
    }
  }`);

  const parsedSanityMarket =
    zodSanityMarketWithOptionalVendors.safeParse(sanityMarket);

  if (!parsedSanityMarket.success) {
    const errors = parsedSanityMarket.error.errors.map((error) => {
      const message = error.message;
      return `${message}`;
    });
    console.log({ errors, parsedSanityMarket });

    return {
      errors,
      success: false,
    };
  }

  const updatedMarket: TSanityMarket = {
    _id: parsedSanityMarket.data._id,
    daysWithTables: parsedSanityMarket.data.daysWithTables.map((day) => {
      const booking = parsedData.data.bookings.find(
        (booking) => booking.date === day.date
      );

      return {
        _key: day._key,
        date: day.date,
        tables: booking
          ? day.tables.map((table) => {
              if (table.table.id === booking.tableId) {
                return {
                  ...table,
                  booked: {
                    _type: "reference",
                    _ref: parsedData.data.vendorId,
                  },
                };
              }
              return table;
            })
          : day.tables,
      };
    }),
    vendors: [
      ...(parsedSanityMarket.data.vendors ?? []).map((vendor) => {
        if (vendor.vendor._ref === parsedData.data.vendorId) {
          return {
            ...vendor,
            datesBooked: [
              ...vendor.datesBooked,
              ...parsedData.data.bookings.map((booking) => {
                return {
                  date: booking.date,
                  tableId: booking.tableId,
                  _key: nanoid(),
                  _type: "day" as "day",
                };
              }),
            ],
          };
        }
        return vendor;
      }),
      ...(!(parsedSanityMarket.data.vendors ?? []).some(
        (vendor) => vendor.vendor._ref === parsedData.data.vendorId
      )
        ? [
            {
              _key: nanoid(),
              vendor: {
                _type: "reference" as "reference",
                _ref: parsedData.data.vendorId,
              },
              datesBooked: parsedData.data.bookings.map((booking) => {
                return {
                  date: booking.date,
                  tableId: booking.tableId,
                  _key: nanoid(),
                  _type: "day" as "day",
                };
              }),
            },
          ]
        : []),
    ],
  };

  const sanityMarketResponse = await sanityWriteClient
    .patch(parsedSanityMarket.data._id)
    .set(updatedMarket)
    .commit();
  // console.log({parsedPaymentRecord: parsedPaymentRecord.data, updatedMarket})
  if (!sanityPaymentResponse || !sanityMarketResponse) {
    return {
      errors: ["Error creating booking"],
      success: false,
    };
  }
  revalidatePath("/admin/dashboard", "layout");
  revalidatePath("/dashboard", "layout");

  return {
    errors: null,
    success: true,
  };
};

const bookingSchema = z.object({
  date: z.string(),
  tableId: z.string({
    invalid_type_error: "Please select a table for the selected date",
    required_error: "Please select a table for the selected date",
  }),
  tablePrice: z.preprocess((val) => parseFloat(val as string), z.number()),
});

const zodRawDataSchema = z
  .object({
    marketId: z.string({ invalid_type_error: "Error with the market id" }),
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
    hst: z.string().transform(Number),
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

type TSanityMarket = z.infer<typeof zodSanityMarket>;

type TPaymentRecordWithouMarketId = Omit<
  TPaymentRecord,
  "marketId" | "vendorId"
>;
