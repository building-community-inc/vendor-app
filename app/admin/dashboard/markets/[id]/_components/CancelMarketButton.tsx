"use client"

import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { useEffect, useRef, useState } from "react";
// import { cancelMarket } from "./cancelMarketAction";
import { useFormState, useFormStatus } from "react-dom";
import { cancelMarketWithLambda } from "./cancelMarketWithLambda";

const CancelMarketButton = ({ marketId }: {
  marketId: string
}) => {
  const [formState, formAction] = useFormState(cancelMarketWithLambda, { errors: null, success: false })
  // const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState<string>("")

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {

    if (window.location.href) {
      setCurrentUrl(window.location.href.split("/dashboard")[0])
    }
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  useEffect(() => {
    if (formState.success) {
      toggleDialog()
    }
  }, [formState.success])


  return (
    <>
      {!formState.success && (
        <Button onClick={toggleDialog} className="bg-red-600 px-5 py-2 text-lg w-fit mx-auto text-white">Cancel Market</Button>
      )}
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        <form action={formAction}>
          Are you sure you want to cancel this market?
          <input hidden name="marketId" type="text" value={marketId} />
          <input hidden name="url" type="text" value={currentUrl} />
          <footer className="flex gap-2 justify-center mt-2">
            <Button type="button" onClick={toggleDialog} className="px-5 text-lg border border-black">Go Back</Button>
            <SubmitButton />
          </footer>
        </form>
      </Dialog>
    </>
  );
}

export default CancelMarketButton;

const SubmitButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-red-600 px-5 py-2 text-lg w-fit text-white">{pending ? "Cancelling..." : "Cancel Market"}</Button>
  )
}