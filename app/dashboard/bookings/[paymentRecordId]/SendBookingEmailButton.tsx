"use client";
import Button from "@/app/_components/Button";
import { useActionState, useEffect, useState } from "react";
import { sendPaymentInfoEmail } from "./sendPaymentInfoEmail";

const SendBookingEmailButton = ({
  email,
  bookingInfo,
}: {
  email: string;
  bookingInfo: {
    bookingId: string;
    marketName: string;
    marketDates: string;
    bookedDays: {
      date: string;
      price: number;
      tableId: string;
    }[];
    subtotal: number;
    hst: number;
    total: number;
    hours: string;
    phone: string;
    loadInInstructions: string;
    venueAddress: string;
  };
}) => {
  const [showErrors, setShowErrors] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formState, formAction, isPending] = useActionState(
    sendPaymentInfoEmail,
    {
      errors: null,
      success: false,
    }
  );

  useEffect(() => {
    if (formState.errors) {
      setShowErrors(true);

      const timeout = setTimeout(() => {
        setShowErrors(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formState.errors]);

  useEffect(() => {
    if (formState.success) {
      setShowSuccessMessage(true);

      const timeout = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formState.success]);
  return (
    <form action={formAction}>
      <input type="hidden" name="email" defaultValue={email} hidden readOnly />
      <input
        type="hidden"
        name="bookingId"
        defaultValue={bookingInfo.bookingId}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="marketName"
        defaultValue={bookingInfo.marketName}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="marketDates"
        defaultValue={bookingInfo.marketDates}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="bookedDays"
        defaultValue={JSON.stringify(bookingInfo.bookedDays)}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="subtotal"
        defaultValue={bookingInfo.subtotal}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="hst"
        defaultValue={bookingInfo.hst}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="total"
        defaultValue={bookingInfo.total}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="hours"
        defaultValue={bookingInfo.hours}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="phone"
        defaultValue={bookingInfo.phone}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="loadInInstructions"
        defaultValue={bookingInfo.loadInInstructions}
        hidden
        readOnly
      />
      <input
        type="hidden"
        name="venueAddress"
        defaultValue={bookingInfo.venueAddress}
        hidden
        readOnly
      />
      {!formState.success && (
        <Button disabled={isPending}>Send booking receipt to {email}</Button>
      )}
      {showSuccessMessage && <p className="text-green-600">Receipt sent!</p>}
      {showErrors &&
        formState.errors &&
        (Array.isArray(formState.errors)
          ? formState.errors.map((error) => (
              <p key={error} className="text-red-500">
                {error}
              </p>
            ))
          : // Handle the case where formState.errors is a ZodError
            formState.errors.issues.map((issue) => (
              <p key={issue.path.join(".")} className="text-red-500">
                {issue.message}
              </p>
            )))}
    </form>
  );
};

export default SendBookingEmailButton;
