"use client";
import Button from "@/app/_components/Button";
import { useFormState, useFormStatus } from "react-dom";
import { archiveMarket } from "./archiveMarketAction";
import { useEffect, useState } from "react";

const ArchiveMarket = ({ marketId, archived }: {
  marketId: string;
  archived: boolean | null | undefined;
}) => {
  const [formState, formAction] = useFormState(archiveMarket, { errors: [], success: false })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  useEffect(() => {
    if (formState.success) {
      setShowSuccessMessage(true);
      const timeout = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };

    }
  }, [formState.success])
  return (
    <form action={formAction}>
      <input type="hidden" name="marketId" value={marketId} />
      <input type="hidden" name="archive" value={archived ? "restore" : "archive"} />

      <SubmitButton archived={archived} />
      {formState.errors && formState.errors.length > 0 && formState.errors.map(error => (
        <div className="text-red-600">{error}</div>
      ))}
      {showSuccessMessage && (
        <div className="text-green-600">Update was successful</div>
      )}
    </form>
  );
}

export default ArchiveMarket;


const SubmitButton = ({ archived }: {
  archived: boolean | null | undefined;
}) => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-red-400 text-white hover:bg-red-800">
      {pending ? "Submitting Changes" : archived ? "Restore Market" : "Archive Market"}
    </Button>
  )
}