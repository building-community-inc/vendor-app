"use client";

import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cancelPaymentAction } from "./cancelPaymentAction";

const CancelPayment = ({ amountPaid, paymentRecordId, contactName, marketName, vendorName }: {
  amountPaid: number;
  paymentRecordId: string;
  contactName: string;
  vendorName: string;
  marketName: string;
}) => {
  const [returnedCredits, setReturnedCredits] = useState<number>(amountPaid);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formState, formAction] = useActionState(cancelPaymentAction, {
    success: false,
    errors: null
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
    let timeout: NodeJS.Timeout | null = null;

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
        <form action={formAction} className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">
            Are you sure you want to cancel this booking?
          </h3>
          <div className="">
            <div className="flex gap-2">
              <h2 className="font-bold">Contact Name:</h2>
              <p className="">{contactName}</p>
            </div>
            <div className="flex gap-2">
              <h2 className="font-bold">Vendor Name:</h2>
              <p className="">{vendorName}</p>
            </div>
            <div className="flex gap-2">
              <h2 className="font-bold">Market:</h2>
              <p className="">{marketName}</p>
            </div>
            <div className="flex gap-2">
              <h2 className="font-bold">Amount:</h2>
              <p className="">${amountPaid}</p>
            </div>
          </div>

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
          {formState.errors && showErrors && (
            Array.isArray(formState.errors) ? (
              formState.errors.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))
            ) : (
              // Handle the case where formState.errors is a ZodError
              formState.errors.issues.map((issue) => (
                <p key={issue.path.join('.')} className="text-red-500">
                  {issue.message}
                </p>
              ))
            )
          )}
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