"use client"

import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { useRef } from "react";
import { cancelMarket } from "./cancelMarketAction";
import { useFormState } from "react-dom";

const CancelMarketButton = ({marketId}: {
  marketId: string
}) => {
  const [formState, formAction] = useFormState(cancelMarket, { errors: null, success: false })

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  console.log({formState})
  return (
    <>
      <Button onClick={toggleDialog} className="bg-red-600 px-5 py-2 text-lg w-fit mx-auto text-white">Cancel Market</Button>
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        <form action={formAction}>
          Are you sure you want to cancel this market?
          <input hidden name="marketId" type="text" value={marketId} />
          <footer className="flex gap-2 justify-center mt-2">
            <Button type="button" onClick={toggleDialog} className="px-5 text-lg border border-black">Go Back</Button>
            <Button type="submit" className="bg-red-600 px-5 py-2 text-lg w-fit text-white">Cancel Market</Button>

          </footer>
        </form>
      </Dialog>
    </>
  );
}

export default CancelMarketButton;