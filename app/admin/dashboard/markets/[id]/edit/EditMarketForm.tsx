"use client";
import Button from "@/app/_components/Button";
import { TSanityMarket } from "@/sanity/queries/admin/markets/zods";
import { ChangeEvent, ComponentPropsWithoutRef, useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { editMarketNameAction } from "./editMarketNameAction";
import { redirect } from "next/navigation";
import { addZerosToDate } from "@/utils/helpers";
import Link from "next/link";

const EditMarketForm = ({ market }: {
  market: TSanityMarket
}) => {

  const [marketNameFormState, marketNameFormAction] = useActionState(editMarketNameAction, { errors: [], success: false });
  const [marketName, setMarketName] = useState(market.name);
  const [showMarketNameSuccessMessage, setShowMarketNameSuccessMessage] = useState(false);
  const [lastDayToBook, setLastDayToBook] = useState<string | null>(market.lastDayToBook ? addZerosToDate(market.lastDayToBook) : null);
  const [formChanged, setFormChanged] = useState(false);
  const [allDaysMandatory, setAllDaysMandatory] = useState(market.allDaysMandatory ?? false)


  const onAllDaysMandatoryChange = () => {
    setAllDaysMandatory(!allDaysMandatory)
    setFormChanged(true)
  };
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
    const marketValue = Boolean(market.allDaysMandatory);

    if (allDaysMandatory === marketValue) {
      setFormChanged(false);
    } else {
      setFormChanged(true);
    }
  }, [allDaysMandatory, market.allDaysMandatory]); 


  useEffect(() => {
    if (marketName !== market.name) {
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  }, [marketName]);

  useEffect(() => {
    if (lastDayToBook !== (market.lastDayToBook ? addZerosToDate(market.lastDayToBook) : null)) {
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  }, [lastDayToBook]);
  return (
    <>
      <form action={marketNameFormAction} className="flex gap-5 justify-between items-end">
        <div className="flex flex-col gap-5 w-full">
          <Input label="Market Name" inputName="marketName" value={marketName} onChange={(e) => setMarketName(e.target.value)} />
          <Input type="date" label="Last Day To Book" inputName="lastDayToBook" value={lastDayToBook || ""} onChange={(e) => setLastDayToBook(e.target.value)} />
          <input type="hidden" name="oldAllDaysMandatory" readOnly defaultValue={`${market.allDaysMandatory ?? false}`} />
          <input type="hidden" name="oldMarketName" readOnly defaultValue={market.name} />
          <input type="hidden" name="oldLastDayToBook" readOnly defaultValue={market.lastDayToBook ?? ""} />
          <input type="hidden" name="marketId" readOnly defaultValue={market._id} />
          <label className="inline-flex items-center mb-5 cursor-pointer">
            <input name="allDaysMandatory" type="checkbox" onChange={onAllDaysMandatoryChange} checked={allDaysMandatory} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 ">Make All Dates Mandatory</span>
          </label>
          <footer className="flex">
            <SubmitButton formChanged={formChanged} />
            <Link href={`/admin/dashboard/markets/${market._id}`} className="mx-auto">
              <Button className="w-fit text-sm">
                Back to market
              </Button>
            </Link>
          </footer>
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
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="text-sm px-4 flex justify-center items-center mx-auto py-0 w-[120px] whitespace-nowrap h-10 disabled:text-gray-500" disabled={!formChanged || pending}>
      Save
    </Button>
  )
}