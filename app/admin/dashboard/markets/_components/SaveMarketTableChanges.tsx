import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { useActionState, useEffect, useRef, useState } from "react";
import { useChangesStore } from "./changesStore";
import { getVendorBusinessNameById } from "@/sanity/queries/admin/vendors";
import FormErrorDisplay from "@/app/_components/FormErrorDisplay";
import { saveMarketTablesUpdateAction } from "./saveMarketTables-1";

const SaveMarketTableChanges = ({
  marketId
}: {
  marketId: string
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { changes } = useChangesStore()
  const [vendorBusinessNames, setVendorBusinessNames] = useState<{ [key: string]: string }>({});
  const [formState, formAction, isPending] = useActionState(saveMarketTablesUpdateAction, { errors: null, success: false })
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const onDialogOpen = () => {
    if (!changes || changes.length === 0) return alert("No changes to save")
    toggleDialog();
  };

  useEffect(() => {
    const fetchVendorBusinessNames = async () => {
      if (!changes) return;
      const names: { [key: string]: string } = {};
      for (const change of changes) {
        if (change.type === "update" || change.type === "delete") {
          const vendorId = change.vendorId;
          if (!names[vendorId]) {
            const vendorName = await getVendorBusinessNameById(vendorId);
            names[vendorId] = vendorName || "Unknown Vendor";
          }
        }
      }
      setVendorBusinessNames(names);
    };

    fetchVendorBusinessNames();
  }, [changes])

  useEffect(() => {
    if (formState.errors) {
      setShowError(true);

      const timeout = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      setShowError(false);
    }
  }, [formState.errors])

  useEffect(() => {
    if (formState.success) {
      setShowSuccess(true);
      const timeout = setTimeout(() => {
        setShowSuccess(false);
        toggleDialog();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [formState.success])


  console.log({ formState })
  return (
    <>
      <Button onClick={onDialogOpen}>
        Save Changes
      </Button>
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        <form action={formAction}>
          <div className="flex flex-col gap-4">
            <input type="text" hidden readOnly defaultValue={marketId} name="marketId" />
            <h2 className="text-2xl font-bold">Save Changes</h2>
            <p className="text-lg">Are you sure you want to save the changes?</p>

            <ul>
              {changes?.map((change, i) => {
                const vendorBusinessName = vendorBusinessNames[change.vendorId] || "Unknown Vendor";
                return (
                  <li key={i} className="flex flex-col gap-2 border-b border-slate-400 py-2">
                    <input type="text" hidden readOnly defaultValue={change.vendorId} name="vendorId" />
                    <input type="text" hidden readOnly defaultValue={change.date} name="date" />
                    <input type="text" hidden readOnly defaultValue={change.oldTableId} name="oldTableId" />
                    {/* <input type="text" hidden readOnly defaultValue={change.} name="newTableId" /> */}
                    <input type="text" hidden readOnly defaultValue={change.type} name="type" />

                    <h3 className="text-lg capitalize font-bold">{change.type === "delete" ? "deleting" : "updating"}: {vendorBusinessName}</h3>
                    <p className="text-lg">Date: {change.date}</p>
                    <p className="text-lg">Table ID: {change.oldTableId}</p>
                    <>
                      <input type="text" hidden readOnly defaultValue={change.type === "update" ? change.newTableId : "undefined"} name="newTableId" />
                      {change.type === "update" && (
                        <p className="text-lg">New Table ID: {change.newTableId}</p>
                      )}
                    </>
                  </li>
                )
              }
              )}
            </ul>
          </div>
          <footer className="flex flex-col gap-4 mt-4">
            <div className="flex justify-center gap-4">
              <Button type="button" onClick={toggleDialog} className="bg-red-700 text-white">Cancel</Button>
              <Button disabled={isPending} type="submit" className="bg-green-600 text-white">{isPending ? "Saving..." : "Save"}</Button>
            </div>
            {showSuccess && formState.success && (
              <div className="text-green-600 text-center font-bold">
                Changes saved successfully!
              </div>
            )}
            <div className="text-center">
              {showError && formState.errors && (
                <FormErrorDisplay errors={formState.errors} />
              )}
            </div>
          </footer>
        </form>
      </Dialog >
    </>
  );
}

export default SaveMarketTableChanges;