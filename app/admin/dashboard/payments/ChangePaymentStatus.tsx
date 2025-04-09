"use client";
import Button from "@/app/_components/Button";
import { useFormStatus } from "react-dom";
import { changeStatusAction } from "./changeStatusAction";
import { useEffect, useRef, useState, useActionState } from "react";
import Dialog from "@/app/_components/Dialog/Dialog";

const ChangePaymentStatus = ({ status, paymentRecordId, amountPaid, marketName, contactName, vendorName }: {
  status: string;
  paymentRecordId: string;
  amountPaid: number;
  marketName: string;
  contactName: string;
  vendorName: string;
}) => {
  const [formState, formAction] = useActionState(changeStatusAction, {
    success: false,
    errors: null
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const newStatus = status === "pending" ? "paid" : "pending";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [requestOrigin, setRequestOrigin] = useState<string | null>(null);

  useEffect(() => {
    if (formState.success) {
      setShowSuccessMessage(true);
    }

    const timeout = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [formState.success])

  useEffect(() => {
    if (formState.errors) {
      setShowErrorMessage(true);
    }

    const timeout = setTimeout(() => {
      setShowErrorMessage(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [formState.errors])

  useEffect(() => {
    if (window) {
      setRequestOrigin(window.location.origin);
    }
  }, [])
  function toggleDialog() {


    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  return (
    <>
      <Button onClick={toggleDialog}>
        Confirm Payment
      </Button>
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        <form action={formAction} className="flex flex-col gap-2">
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
          <input type="hidden" name="requestOrigin" value={requestOrigin || ""} readOnly />
          <input type="hidden" name="amountPaid" value={amountPaid} readOnly />
          <input type="hidden" name="paymentRecordId" value={paymentRecordId} readOnly />
          <input type="hidden" name="newStatus" value={newStatus} readOnly />
          <footer className="flex flex-col gap-2">
            <div className="flex gap-4">
              <Button type="button" onClick={toggleDialog} className="w-fit">Go Back</Button>
              <SubmitButton newStatus={newStatus} />
            </div>
            {formState.errors && showErrorMessage && (
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
            )}            {formState.success && showSuccessMessage && (
              <p className="text-green-500">
                ✔️ Status changed successfully
              </p>
            )}
          </footer>
        </form>
      </Dialog>
    </>
  );
}

export default ChangePaymentStatus;


const SubmitButton = ({ newStatus }: {
  newStatus: string;
}) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-fit">
      {pending ? "changing status" : `Set as ${newStatus}`}
    </Button>
  )
};