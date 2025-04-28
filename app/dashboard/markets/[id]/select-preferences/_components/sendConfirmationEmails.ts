"use server"
import { BookingCreatedEmail, ClientConfirmationEmail } from '@/app/_components/email/NewEmailBooking';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "accounting@buildingcommunityinc.com"; 
export const sendBookingDetailsToAdmin = async (bookingUrl: string, vendorName: string, vendorLogoUrl?: string) => {
  if (!resend) {
    throw new Error("Resend client is not initialized. Check your API key.");
  }

  if (!bookingUrl || !vendorName) {
    throw new Error("Missing required parameters: bookingUrl or vendorName.");
  }

  console.log("sending admin email");
  try {
    const eResp = await resend.emails.send({
      from: "no-reply@buildingcommunityinc.com",
      to: ADMIN_EMAIL,
      subject: "Booking",
      react: BookingCreatedEmail({
        bookingUrl,
        vendorName,
        vendorLogoUrl,
      }),
    });


    console.log("sending email", {eResp});
  } catch (error) {
    console.error(error)
  }  
};

export const sendConfirmationEmailToVendor = async (
  marketCoverUrl: string,
  marketName: string,
  vendorName: string,
  marketDate: string,
  vendorEmail: string,
  bookingUrl: string,
) => {
  
  if (!resend) {
    throw new Error("Resend client is not initialized. Check your API key.");
  }

  if (!bookingUrl || !marketCoverUrl || !marketName || !vendorName || !marketDate || !vendorEmail) {
    throw new Error("Missing required parameters: marketCoverUrl, marketName, vendorName, marketDate or vendorEmail.");
  }

  console.log("sending client confirmation email");
  try {
    const eResp = await resend.emails.send({
      from: "no-reply@buildingcommunityinc.com",
      to: vendorEmail,
      subject: "Booking",
      react: ClientConfirmationEmail({
        marketCoverUrl,
        marketName,
        vendorName,
        marketDate,
        bookingUrl
      }),
    });


    console.log("sending email", {eResp});
  } catch (error) {
    console.error(error)
  }  
};