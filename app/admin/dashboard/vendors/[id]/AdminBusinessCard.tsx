"use client"
import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { BusinessSection, DashboardSection } from "@/app/dashboard/_components/profileComps";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateCredits } from "./updateCredits";

export const AdminBusinessCard = ({ business, ownerName, credits, vendorId }: {
  business: TUserWithOptionalBusinessRef["business"];
  ownerName: string;
  credits: number;
  vendorId: string;
}) => {
  const [creditsValue, setCreditsValue] = useState<number>(credits);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showAreYouSureMessage, setShowAreYouSureMessage] = useState<boolean>(false);
  const [formState, formAction] = useFormState(updateCredits, { errors: [], success: false });


  function toggleDialog() {

    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  };

  // console.log({ formState })

  useEffect(() => {
    if (formState.success) {
      dialogRef.current?.close()
      setShowAreYouSureMessage(false)
    }
  }, [formState])


  return (
    <DashboardSection className="h-[514px]">
      {business?.logoUrl && (
        <BusinessSection className="flex justify-center">
          <Image src={business.logoUrl} alt={business.businessName} width={100} height={100} />
        </BusinessSection>
      )}

      <BusinessSection>
        <h1 className="text-3xl font-darker-grotesque text-title-color">{business?.businessName}</h1>
        <span className="font-segoe text-xl">{business?.industry}</span>
      </BusinessSection>
      <BusinessSection className="text-black flex flex-col gap-5">
        <div>
          <p className="text-xl font-segoe font-bold text-black">Owner Name:</p>
          <p className="font-segoe text-2xl">{ownerName}</p>
        </div>
        <div>
          <p className="text-xl font-segoe font-bold text-black">Instagram Handle:</p>
          <p className="font-segoe text-2xl">{business?.instagramHandle}</p>
        </div>
      </BusinessSection>
      <BusinessSection className="text-black border-none flex justify-between items-center py-5">
        <div>
          <p className="text-xl  font-segoe font-bold text-black">Credit Balance:</p>
          <p className="font-segoe text-2xl">${credits}</p>
        </div>
        <Button onClick={toggleDialog}>
          Edit Credits
        </Button>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {showAreYouSureMessage ? (
            <form action={formAction} className="flex flex-col gap-2">
              <p>Are you sure you want to update the credits from <strong>${credits}</strong> to <strong>${creditsValue}</strong> </p>
              <input hidden name="oldCredits" type="number" value={credits} />
              <input hidden name="newCredits" type="number" value={creditsValue} />
              <input hidden name="userId" type="text" value={vendorId} />
              <footer className="flex justify-center gap-5">
                <Button type="button" onClick={() => setShowAreYouSureMessage(false)} className="px-5 py-2 bg-red-300 ">No</Button>
                <SubmitButton />
              </footer>
              {formState.errors && formState.errors.length > 0 && formState.errors.map((error) => (
                <p key={error} className="text-red-500 text-center">{error}</p>
              ))}
            </form>
          ) : (

            <section className="flex flex-col gap-2">
              <section className="flex justify-between items-center">
                <span className="font-semibold text-lg">Credits: </span>
                <input type="number" name="newCredits" value={creditsValue} className="border border-black rounded-lg px-2 py-1" onChange={(e) => setCreditsValue(+e.currentTarget.value)} />
              </section>
              <footer className="flex justify-center gap-5">
                <Button type="button" onClick={() => {
                  toggleDialog()
                  setCreditsValue(credits)
                }} className="px-5 py-2 ">Cancel</Button>
                <Button type="button" onClick={() => setShowAreYouSureMessage(true)} className="px-5 py-2 ">Update Credits</Button>
              </footer>
            </section>
          )}

        </Dialog>
      </BusinessSection>
    </DashboardSection >
  )
};


const SubmitButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="px-5 py-2 bg-green-300 disabled:bg-green-100">{pending ? "Updating Credits..." : "Yes"}</Button>
  )
}