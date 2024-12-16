"use client";

import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { saveNewMarketCoverAction } from "./saveNewMarketCoverAction";

const EditMarketCoverForm = ({ marketCover, marketId, marketName, marketCoverId }: {
  marketCover: string;
  marketId: string;
  marketName: string;
  marketCoverId: string;
}) => {
  const [newMarketCover, setNewMarketCover] = useState<File | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, formAction] = useFormState(saveNewMarketCoverAction, { errors: [], success: false })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setNewMarketCover(file);
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  }

  const handleCancel = () => {
    setNewMarketCover(null);
    toggleDialog();
  }

  const getImageUrl = () => {
    return newMarketCover ? URL.createObjectURL(newMarketCover) : marketCover;
  }

  useEffect(() => {
    if (formState.success) {
      setShowSuccessMessage(true);

      const timeout = setTimeout(() => {
        setShowSuccessMessage(false);
        formState.success = false; // Reset success state
        handleCancel();
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formState.success]);

  return (
    <>
      <Button onClick={toggleDialog} className="mx-auto">Edit Market Cover</Button>
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        <form action={formAction}>
          <input type="text" hidden defaultValue={marketId} name="marketId" />
          <img src={getImageUrl()} alt={marketName} className="max-w-[726px] mx-auto w-full object-cover" />

          <section className="flex justify-between py-5 gap-5">
            <Button type="button" onClick={handleButtonClick}>
              Upload New Cover
            </Button>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/jpeg, image/png"
              name="newMarketCover"
              onChange={handleImageUpload}
            />
            <input type="text" hidden name="oldMarketCoverId" defaultValue={marketCoverId} />
            <SubmitButton disabled={!newMarketCover} />
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </section>
          <footer className="flex justify-center">
            {showSuccessMessage && (
              <p className="text-green-500 text-sm">Market cover image updated successfully</p>
            )}
            {formState.errors && formState.errors.length > 0 && formState.errors.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </footer>
        </form>
      </Dialog>
    </>
  );
}

export default EditMarketCoverForm;

const SubmitButton = ({ disabled }: {
  disabled: boolean;
}) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? "Saving..." : "Save new market cover"}
    </Button>
  );
};