"use client";
import Button from "@/app/_components/Button";
import { TSanityMarket } from "@/sanity/queries/admin/markets/zods";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { editMarketNameAction } from "./editMarketNameAction";
import { redirect } from "next/navigation";

const EditMarketForm = ({ market }: {
  market: TSanityMarket
}) => {

  const [marketNameFormState, marketNameFormAction] = useFormState(editMarketNameAction, { errors: [], success: false });
  const [marketName, setMarketName] = useState(market.name);
  const [showMarketNameSuccessMessage, setShowMarketNameSuccessMessage] = useState(false);
  const [lastDayToBook, setLastDayToBook] = useState<string>(market.lastDayToBook || "");
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    if (marketNameFormState.success) {
      setShowMarketNameSuccessMessage(true);

      const timeout = setTimeout(() => {
        setShowMarketNameSuccessMessage(false);
        marketNameFormState.success = false; // Reset success state
      }, 3000);

      const timeoutPageRedir = setTimeout(() => {
        redirect(`/admin/dashboard/markets/${market._id}`);
      }, 4000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(timeoutPageRedir);
      };
    }
  }, [marketNameFormState.success]);

  useEffect(() => {
    if (marketName !== market.name) {
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  }, [marketName]);

  useEffect(() => {
    if (lastDayToBook !== (market.lastDayToBook || "")) {
      setFormChanged(true);
    } else {
      console.log("lastDayToBook did not");
      setFormChanged(false);
    }
  }, [lastDayToBook]);
  return (
    <>
      <form action={marketNameFormAction} className="flex gap-5 justify-between items-end">
        <div className="flex flex-col gap-5 w-full">
          <Input label="Market Name" inputName="marketName" value={marketName} onChange={(e) => setMarketName(e.target.value)} />
          <Input type="date" label="Last Day To Book" inputName="lastDayToBook" value={lastDayToBook} onChange={(e) => setLastDayToBook(e.target.value)} />
          <input type="hidden" name="marketId" defaultValue={market._id} />
          <SubmitButton formChanged={formChanged} />
        </div>
      </form>
      {marketNameFormState.errors && marketNameFormState.errors.length > 0 && (
        <ul className="flex flex-col w-fit mx-auto">
          {marketNameFormState.errors.map((error) => (
            <li key={error} className="text-red-500 text-sm">{error}</li>
          ))}
        </ul>
      )}
      {showMarketNameSuccessMessage && (
        <p className="text-green-500 text-sm text-center">Market updated successfully</p>
      )}
      {/* <img src={market.marketCover.url} alt={market.name} className="w-[200px] h-[200px] object-cover" /> */}
    </>
  );
}

export default EditMarketForm;



type InputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  inputName: string;
};
const Input = ({ label, inputName, ...rest }: InputProps) => {
  return (
    <div className="w-full">
      <label htmlFor={inputName} className="block mb-2 text-sm font-medium text-gray-900 ">{label}</label>
      <input name={inputName} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" {...rest} />
    </div>

  );
};


const SubmitButton = ({ formChanged }: {
  formChanged: boolean;
}) => {
  console.log({ formChanged });
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="text-sm px-4 flex justify-center items-center mx-auto py-0 w-[120px] whitespace-nowrap h-10 disabled:text-gray-500" disabled={!formChanged || pending}>
      Save
    </Button>
  )
}