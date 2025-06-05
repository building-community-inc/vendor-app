"use server";

import { CancelledBookingEmail } from "@/emails/CancelledBookingEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCancelEmail = async (vendorEmail: string) => {
  try {
    console.log("sending cancellation email", vendorEmail);
    const resendResp = await resend.emails.send({
      from: "applications@buildingcommunityinc.com",
      to: vendorEmail,
      subject: "❌ Your BCI Booking has been Cancelled",
      react: CancelledBookingEmail(),
    });

    console.log({ resendResp });
  } catch (error) {
    console.error(error);
    throw new Error("Error sending cancellation email");
  }
};

// emailsubject: ❌ Your BCI Booking has been Cancelled.
