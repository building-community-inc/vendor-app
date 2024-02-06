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
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { DateTime } from "luxon";
// import { useRouter } from "next/navigation";
export type TSelectedTableType = {
  date: string;
  table: TTableInDay;
};
export type TDateType = {
  date: string;
  tables: TTableInDay[];
};


const SelectOptions = ({ market, user }: { market: TSanityMarket, user: TUserWithOptionalBusinessRef }) => {
  const { push } = useRouter();

  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [selectedTables, setSelectedTables] = useState<TSelectedTableType[]>(
    []
  );

  const [isPayNowSelected, setIsPayNowSelected] = useState<boolean>(true);

  const [newSelectedDates, setNewSelectedDates] = useState<TDayWithTable[]>([]);

  const { setAllCheckoutData,  } = useCheckoutStore();
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


    const checkboxesElems = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    const selects = document.querySelectorAll<HTMLSelectElement>('select');

    let uncheckedTableDate = '';

    const isAnyCheckboxCheckedWithoutSelect = function () {
      const checkboxes = Array.from(checkboxesElems);
      
      const checkedBoxes = checkboxes.filter(checkbox => checkbox.checked);
      
      // for (let index = 0; index < checkboxes.length; index++) {
        for (const checkbox of checkedBoxes) {

          const indexOfCheckbox = checkedBoxes.indexOf(checkbox);
          const correspondingSelect = selects[indexOfCheckbox];
        // Check if the checkbox is checked and its corresponding select is unselected
        if (checkbox.checked && (!correspondingSelect || correspondingSelect.value === null || correspondingSelect.value === undefined || correspondingSelect.value === 'null')) {
          uncheckedTableDate = checkbox.nextSibling?.textContent || '';
          return true;
        }
      };

      return false;
    }

    if (isAnyCheckboxCheckedWithoutSelect()) {
      alert(`Please select a table for the date ${uncheckedTableDate} before proceeding to checkout.`);
      return;
    }


    if (!options.selectedTables || options.selectedTables.length === 0) {
      alert("Please select tables before proceeding to checkout.");
      return;
    }

    try {
      const parsedOptions = zodBookMarketOptionsSchema.safeParse(options);

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
        hst: +(dueNow * 0.13).toFixed(2),
        dueNowWithHst: dueNow + dueNow * 0.13,
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

  const sortedDates = market.dates
    .map(date => {
      const [year, month, day] = date.split('-').map(Number);
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const newDate = DateTime.fromISO(formattedDate, { zone: 'America/Toronto' }).startOf('day');
      return newDate;
    })
    .sort((a, b) => a.toMillis() - b.toMillis());

  // Get today's date at midnight for comparison
  const today = DateTime.local().setZone('America/Toronto').startOf('day');

  // Find the next event date that is after today
  const nextEventDate = sortedDates.find(date => date > today);
  // Calculate the difference between today and the next event date
  let diffInDays = null;
  if (nextEventDate) {
    diffInDays = Math.ceil((nextEventDate.toMillis() - today.toMillis()) / (1000 * 60 * 60 * 24));
  }

  const isEventInLessThan60Days = diffInDays && diffInDays <= 60;
  const isItTooLateToBook = diffInDays && diffInDays <= 0;
  if (isItTooLateToBook) {
    return (
      <div>
        <h1>It&apos;s the day before the event</h1>
        <p>Sorry, you can&apos;t book a table the day before the event.</p>
      </div>
    )
  }

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
        businessCategory={user?.business?.industry || ''}
      />
      <section className="flex flex-col gap-2 text-zinc-400">
        <h2 className="text-white font-bold">Select Payment Options</h2>
        <label htmlFor="pay-now" className="flex text-[19px] items-center gap-2 relative z-10">
          <input type="radio" name="pay-now" className="pointer-events-none relative z-[2]" id="pay-now" checked={isPayNowSelected} onChange={() => setIsPayNowSelected(true)} />
          <span>Pay in Full</span>
        </label>
        {!isEventInLessThan60Days && (
          <>
            <label htmlFor="pay-later" className="flex text-[19px] items-center gap-2 relative z-10" onClick={() => setIsPayNowSelected(false)}>
              <input type="radio" name="pay-later" id="pay-later" className="pointer-events-none relative z-[2]" checked={!isPayNowSelected} onChange={() => setIsPayNowSelected(false)} />
              <span>Deposit</span>
            </label>
            <p>Vendors can pay a $50/day non-refundable deposit to secure their table reservation. The remaining amount of the booking is due 60 days before the first day of the market</p>
          </>
        )}
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
              <div>
                <h2 className="text-white font-bold">HST:</h2>
                <p>${(dueNow * .13).toFixed(2)}</p>
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
