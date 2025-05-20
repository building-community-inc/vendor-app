"use server";
import { FormState } from "@/app/types";
import { BookingInfoEmail } from "@/emails/BookingInfoEmail";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);
const bookedDaySchema = z.object({
  date: z.string(),
  price: z.number(),
  tableId: z.string(),
});
const dataParser = z.object({
  vendorEmail: z.string(),
  bookingId: z.string(),
  marketName: z.string(),
  marketDates: z.string(),
  bookedDays: z.string().transform((val) => {
    try {
      const parsedArray = JSON.parse(val);
      return parsedArray.map((item: any) => bookedDaySchema.parse(item));
    } catch (error) {
      console.error("Error parsing bookedDays:", error);
      return []; // Or throw an error if you want to halt processing
    }
  }),
  subtotal: z.string().transform((val) => parseFloat(val)),
  hst: z.string().transform((val) => parseFloat(val)),
  total: z.string().transform((val) => parseFloat(val)),
  hours: z.string(),
  phone: z.string(),
  loadInInstructions: z.string(),
  venueAddress: z.string(),
});

export const sendPaymentInfoEmail = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  const rawData = {
    vendorEmail: formData.get("email"),
    bookingId: formData.get("bookingId"),
    marketName: formData.get("marketName"),
    marketDates: formData.get("marketDates"),
    bookedDays: formData.get("bookedDays"),
    subtotal: formData.get("subtotal"),
    hst: formData.get("hst"),
    total: formData.get("total"),
    hours: formData.get("hours"),
    phone: formData.get("phone"),
    loadInInstructions: formData.get("loadInInstructions"),
    venueAddress: formData.get("venueAddress"),
  };

  const { data, success, error } = dataParser.safeParse(rawData);

  if (!success) {
    console.error(error);
    return {
      success: false,
      errors: ["something went wrong with the data"],
    };
  }
  try {
    await resend.emails.send({
      from: "applications@buildingcommunityinc.com",
      to: data.vendorEmail,
      subject:
        "☑️ Here are your BCI Booking Details - Payment Required within 24 hr",
      react: BookingInfoEmail({
        bookingId: data.bookingId,
        marketName: data.marketName,
        marketDates: data.marketDates,
        bookedDays: data.bookedDays,
        subtotal: data.subtotal,
        hst: data.hst,
        total: data.total,
        hours: data.hours,
        phone: data.phone,
        loadInInstructions: data.loadInInstructions,
        venueAddress: data.venueAddress,
      }),
    });

    return {
      success: true,
      // errors: ["not implemented"],
    };
    // return {
    //   success: true,
    // };
  } catch (error) {
    return {
      success: false,
      errors: ["something went wrong"],
    };
  }
};
