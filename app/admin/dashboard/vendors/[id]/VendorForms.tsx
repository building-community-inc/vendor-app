"use client";
import Button from "@/app/_components/Button";
import { approveVendor, disapproveVendor } from "../actions";
import { useActionState } from "react";
import FormErrorDisplay from "@/app/_components/FormErrorDisplay";

export const ApproveVendorForm = ({ vendorId }: {
  vendorId: string;
}) => {
  const [formState, formAction, isPending] = useActionState(approveVendor, {
    success: false,
    errors: null
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="vendorId" value={vendorId} />
      <Button disabled={isPending}>  {isPending ? "Approving" : "Approve"}</Button>
      {formState.errors && (
        <FormErrorDisplay errors={formState.errors} />
      )}
    </form>
  )
};

export const DisapproveVendorForm = ({ vendorId }: {
  vendorId: string;
}) => {
  const [formState, formAction, isPending] = useActionState(disapproveVendor, {
    success: false,
    errors: null
  });
  return (
    <form action={formAction}>
      <input type="hidden" name="vendorId" value={vendorId} />
      <Button disabled={isPending}> {isPending ? "Archiving" : "Archive Vendor"}</Button>
      {formState.errors && (
        <FormErrorDisplay errors={formState.errors} />
      )}
    </form>
  )
}