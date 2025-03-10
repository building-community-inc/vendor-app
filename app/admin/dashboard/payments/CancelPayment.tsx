"use client";

import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { cancelPaymentAction } from "./cancelPaymentAction";

const CancelPayment = ({ amountPaid, paymentRecordId }: {
  amountPaid: number;
  paymentRecordId: string;
}) => {
  const [returnedCredits, setReturnedCredits] = useState<number>(amountPaid);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formState, formAction] = useFormState(cancelPaymentAction, {
    success: false,
    errors: undefined
  });

  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  useEffect(() => {
    if (formState.errors) {
      setShowErrors(true);
    }

    const timeout = setTimeout(() => {
      setShowErrors(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [formState.errors]);

  useEffect(() => {
    let timeout = null;

    if (formState.success) {
      setShowSuccessMessage(true);
      timeout = setTimeout(() => {
        setShowSuccessMessage(false);
        toggleDialog();
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [formState.success]);


  return (
    <>
      <Button onClick={() => {
        toggleDialog()

      }}
        className="bg-red-600 px-5 py-2 w-fit text-white">
        Cancel Booking
      </Button>
      <Dialog toggleDialog={() => {
        toggleDialog()

      }}
        ref={dialogRef}>
        <form action={formAction}>
          <p>
            Are you sure you want to cancel this booking?
          </p>
          <div className="flex flex-col">
            <label htmlFor="returnedCredits">
              Do you want to return credits to vendor?
            </label>
            <input type="number" value={returnedCredits} onChange={e => setReturnedCredits(+e.target.value)} name="returnedCredits" className="border border-black rounded-full px-2 py-1" />
          </div>
          <input type="hidden" name="paymentRecordId" readOnly value={paymentRecordId} />
          <footer className="flex gap-2 justify-center mt-2">
            <Button onClick={toggleDialog}>
              Go Back
            </Button>
            <SubmitButton />
          </footer>
          {formState.errors && showErrors && formState.errors.map(error => (
            <p key={error} className="text-red-500 text-center">{error}</p>
          ))}
        </form>
      </Dialog>
    </>
  );
}

export default CancelPayment;

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-fit">
      {pending ? "Cancelling..." : "Cancel Booking"}
    </Button>
  )
};