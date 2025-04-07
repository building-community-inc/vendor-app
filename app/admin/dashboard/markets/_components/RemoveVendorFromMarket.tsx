import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { removeVendorFromMarket } from "./removeVendorFromMarketAction";
import { formatDateWLuxon } from "@/utils/helpers";

const RemoveVendorFromMarket = ({
  marketId,
  date,
  vendorId,
  tableId,
  vendorBusinessName,
  vendorContactName,
  vendorEmail,
  vendorInsta,
  marketName
}: {
  marketId: string;
  date: string;
  vendorId: string;
  tableId: string;
  marketName: string;
  vendorBusinessName: string;
  vendorContactName: string;
  vendorEmail: string;
  vendorInsta: string;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formState, formAction] = useActionState(removeVendorFromMarket, { errors: undefined, success: false })


  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close()
    } else {
      dialogRef.current.showModal();
    }
  }

  const onCancel = () => {
    toggleDialog();
  };
  return (
    <>
      <button
        type="button"
        onClick={toggleDialog}
        className=" flex items-center"
      >
        <FaRegTrashAlt className="text-2xl" />
      </button>
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        <form action={formAction} className="flex flex-col gap-4">
          <input name="marketId" defaultValue={marketId} readOnly hidden />
          <input name="date" defaultValue={date} readOnly hidden />
          <input name="vendorId" defaultValue={vendorId} readOnly hidden />
          <input name="tableId" value={tableId} readOnly hidden />
          <section className="flex flex-col gap-2">
            <h2 className="font-bold">Are you sure you want to remove the following vendor?</h2>
            <p>
              <strong>Date: </strong>
              {formatDateWLuxon(date)}
            </p>
            <p>
              <strong>Market: </strong>
              {marketName}
            </p>
            <p>
              <strong>Business Name: </strong>
              {vendorBusinessName}
            </p>
            <p>
              <strong>Business Contact: </strong>
              {vendorContactName}
            </p>
            <p>
              <strong>Business Contact: </strong>
              {vendorEmail}
            </p>
            <p>
              <strong>Business Contact: </strong>
              {vendorInsta}
            </p>
            <p>
              <strong>Table: </strong>
              {tableId}
            </p>
          </section>
          <footer>
            <div className="flex justify-between max-w-lg mx-auto">
              <Button onClick={onCancel}>
                Cancel
              </Button>
              <SubmitButton />
            </div>
            {formState.errors && formState.errors.map(err => (
              <p key={err} className="text-red-600">{err}</p>
            ))}
          </footer>
        </form>
      </Dialog>
    </>
  );
}

export default RemoveVendorFromMarket;

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Removing..." : "Remove Vendor"}
    </Button>
  );
};