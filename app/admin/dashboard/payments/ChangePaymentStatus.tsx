"use client";
import Button from "@/app/_components/Button";
import { useFormState, useFormStatus } from "react-dom";
import { changeStatusAction } from "./changeStatusAction";
import { useEffect, useState } from "react";

const ChangePaymentStatus = ({ status, paymentRecordId }: {
  status: string;
  paymentRecordId: string;
}) => {
  const [formState, formAction] = useFormState(changeStatusAction, {
    success: false,
    errors: undefined
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const newStatus = status === "pending" ? "paid" : "pending";

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
  return (
    <form action={formAction}>
      <input type="hidden" name="paymentRecordId" value={paymentRecordId} readOnly />
      <input type="hidden" name="newStatus" value={newStatus} readOnly />
      <SubmitButton newStatus={newStatus} />
      {formState.errors && formState.errors.map((error) => (
        <p key={error} className="text-red-500">
          {error}
        </p>
      ))}
      {formState.success && showSuccessMessage && (
        <p className="text-green-500">
          ✔️ Status changed successfully
        </p>
      )}
    </form>
  );
}

export default ChangePaymentStatus;


const SubmitButton = ({ newStatus }: {
  newStatus: string;
}) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "changing status" : `Set as ${newStatus}`}
    </Button>
  )
};