"use client";
import {
  TDayWithTable,
  TSanityMarket,
  TTableInDay,
} from "@/sanity/queries/admin/markets";
import SelectDates from "./SelectDates";
import ContinueButton from "../../_components/ContinueButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodBookMarketOptionsSchema, zodCheckoutStateSchemaRequired, zodShortMarketSchema } from "@/zod/checkout";
import { useCheckoutStore } from "@/app/dashboard/checkout/_components/checkoutStore";
// import { useRouter } from "next/navigation";
export type TSelectedTableType = {
  date: string;
  table: TTableInDay;
};
export type TDateType = {
  date: string;
  tables: TTableInDay[];
};
const SelectOptions = ({ market }: { market: TSanityMarket }) => {
  const { push } = useRouter();

  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [selectedTables, setSelectedTables] = useState<TSelectedTableType[]>(
    []
  );

  const [isPayNowSelected, setIsPayNowSelected] = useState<boolean>(true);

  const [newSelectedDates, setNewSelectedDates] = useState<TDayWithTable[]>([]);

  const { setCheckoutItems, setAllCheckoutData } = useCheckoutStore();
  const totalToPay = selectedTables.reduce(
    (total, table) => total + table.table.table.price,
    0
  );

  const dueNow = isPayNowSelected ? totalToPay : selectedTables.length * 50;

  const options = {
    selectedTables,
    totalToPay,
    specialRequest,
    market,
    dueNow
  };

  const handleNewDateSelect = (date: TDayWithTable) => {
    if (newSelectedDates.some(d => d.date === date.date)) {
      setNewSelectedDates((prev) => prev.filter((d) => d.date !== date.date));
      setSelectedTables((prevTables) => prevTables.filter((t) => t.date !== date.date));
    } else {
      setNewSelectedDates((prev) => [...prev, date]);
    }
  };

  const handleOnTableChange = (table: TTableInDay, date: TDateType) => {
    setSelectedTables((prevTables) => {
      // Check if the date is already in the selected tables
      const existingDate = prevTables.find((t) => t.date === date.date);
      if (existingDate) {
        // If the date is already in the selected tables, replace its table with the new table
        return prevTables.map((t) =>
          t.date === date.date ? { ...t, table } : t
        );
      } else {
        // If the date is not in the selected tables, add a new entry with the date and table
        return [...prevTables, { date: date.date, table }];
      }
    });
  };

  const handleProceedToCheckout = async (event: React.FormEvent) => {
    event.preventDefault();


    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    const selects = document.querySelectorAll<HTMLSelectElement>('select');

    let uncheckedTableDate = '';
    const isAnyCheckboxCheckedWithoutSelect = Array.from(checkboxes).some((checkbox, index) => {
      const correspondingSelect = selects[index];
      if (checkbox.checked && (!correspondingSelect || correspondingSelect.value === null || correspondingSelect.value === undefined || correspondingSelect.value === 'null')) {
        uncheckedTableDate = checkbox.nextSibling?.textContent || '';
        return true;
      }
      return false;
    });

    if (isAnyCheckboxCheckedWithoutSelect) {
      alert(`Please select a table for the date ${uncheckedTableDate} before proceeding to checkout.`);
      return;
    }


    if (!options.selectedTables || options.selectedTables.length === 0) {
      alert("Please select tables before proceeding to checkout.");
      return;
    }

    try {
      // const res = await fetch("/dashboard/checkout/api/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(options),
      // });

      const parsedOptions = zodBookMarketOptionsSchema.safeParse(options);
      // const params = new URLSearchParams();

      if (!parsedOptions.success) {
        console.error(parsedOptions.error);
        return;
      }

      const items = selectedTables.map((table: TSelectedTableType) => {
        return {
          price: table.table.table.price,
          tableId: table.table.table.id,
          name: `${market.name} at ${market.venue.title} in ${market.venue.city} on ${table.date}}`,
          date: table.date,
        };
      });

      // setCheckoutItems(items);
      const parsedMarket = zodShortMarketSchema.safeParse(market);
      if (!parsedMarket.success) {
        console.error(parsedMarket.error);
        return;
      }

      const parsedCheckoutState = zodCheckoutStateSchemaRequired.safeParse({
        market: parsedMarket.data,
        items,
        specialRequest,
        dueNow,
        totalToPay,
        paymentType: isPayNowSelected ? 'full' : 'partial',
      })

      if (!parsedCheckoutState.success) {
        console.error(parsedCheckoutState.error);
        return;
      }

      setAllCheckoutData(parsedCheckoutState.data)

      push(`/dashboard/checkout`);
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <form
      onSubmit={handleProceedToCheckout}
      className="w-full lg:w-[40%] min-w-[250px] flex flex-col gap-5 md:p-5 pb-10"
    >
      <header>
        <h1>Select Table Location preference</h1>
        <span>Note: Table selection is not guaranteed</span>
      </header>
      <SelectDates
        market={market}
        handleDateSelect={handleNewDateSelect}
        selectedDates={newSelectedDates}
        totalToPay={totalToPay}
        handleOnTableChange={handleOnTableChange}
        dueNow={dueNow}
      />
      <section className="flex flex-col text-zinc-400">
        <h2 className="text-white font-bold">Select Payment Option</h2>
        <label htmlFor="pay-now" className="flex gap-2">
          <input type="radio" name="pay-now" id="pay-now" checked={isPayNowSelected} onChange={() => setIsPayNowSelected(true)} />
          <span>Pay in Full</span>
        </label>
        <label htmlFor="pay-later" className="flex gap-2">
          <input type="radio" name="pay-later" id="pay-later" checked={!isPayNowSelected} onChange={() => setIsPayNowSelected(false)} />
          <span>Deposit</span>
        </label>
        <p>Vendors can pay a $50/day non-refundable deposit to secure their table reservation. The remaining amount of the booking is due 60 days before the first day of the market</p>
        {/* {!isPayNowSelected && ( */}
        {/* )} */}
        {typeof totalToPay === "number" ? (
          totalToPay < 1 ? (

            <span className="">Please select at least one date and a table</span>
          ) : (
            <>
              <h2 className="text-white font-bold">Total To Booking Cost:</h2>
              <span>$ {totalToPay}</span>
              <div className="w-full">
                <h2 className="text-white font-bold">Due Now:</h2>
                <span> ${dueNow}</span>
              </div>
              <div>
                <h2 className="text-white font-bold">Amount Owing:</h2>
                <p>$
                  {totalToPay - dueNow}</p>
              </div>

            </>
          )
        ) : (
          <span className="text-red-400">Something went wrong</span>
        )}

      </section>
      <textarea
        rows={2}
        placeholder="Special Requests"
        className="rounded-3xl py-5 px-3 text-black"
        value={specialRequest}
        onChange={(e) => setSpecialRequest(e.target.value)}
      />
      {/* <ContinueButton type="button" onClick={() => setIsPayNowSelected(!isPayNowSelected)}>
        {isPayNowSelected ? "Pay Now" : "Pay Later"}
      </ContinueButton> */}


      <ContinueButton type="submit">Checkout</ContinueButton>
      {/* {JSON.stringify(options)} */}
    </form>
  );
};

export default SelectOptions;
