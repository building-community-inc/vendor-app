"use client";
import Button from "@/app/_components/Button";
import { useActionState } from "react";
import { setUserStatus } from "./actions";
import FormErrorDisplay from "@/app/_components/FormErrorDisplay";

const StatusUpdateButton = ({
  buttonText,
  buttonClassName,
  status,
  vendorId,
  pendingText
}: {
  vendorId: string;
  status: "approved" | "suspended" | "archived" | "pending";
  buttonText: string;
  pendingText: string;
  buttonClassName?: string;
}) => {
  const [formState, formAction, isPending] = useActionState(
    setUserStatus,
    {
      success: false,
      errors: null
    });
  return (
    <form action={formAction}>
      <input type="hidden" name="vendorId" value={vendorId} />
      <input type="hidden" name="status" value={status} />
      <Button className={buttonClassName} disabled={isPending}>{isPending ? pendingText : buttonText}</Button>
      {formState.errors && (
        <FormErrorDisplay errors={formState.errors} />
      )}
    </form>
  );
}

export default StatusUpdateButton;