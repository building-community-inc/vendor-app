"use client";
import "./checkbox.css"
import {
  TDayWithTable,
  TSanityMarket,
  TTableInDay,
} from "@/sanity/queries/admin/markets/zods";
import SelectDates from "./SelectDates";
import ContinueButton from "../../_components/ContinueButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodBookMarketOptionsSchema, zodCheckoutStateSchemaRequired, zodShortMarketSchema } from "@/zod/checkout";
import { useCheckoutStore } from "@/app/dashboard/checkout/_components/checkoutStore";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { DateTime } from "luxon";
import Box from "./Box";
import PaymentOptions from "./PaymentOptions";
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

  // const [specialRequest, setSpecialRequest] = useState<string>("");
  const [selectedTables, setSelectedTables] = useState<TSelectedTableType[]>(
    []
  );

  const [isPayNowSelected, setIsPayNowSelected] = useState<boolean>(true);

  const [newSelectedDates, setNewSelectedDates] = useState<TDayWithTable[]>([]);

  const [useCredits, setUseCredits] = useState<boolean>(false);

  const [creditsToUse, setCreditsToUse] = useState<number>(0);

  const { setAllCheckoutData, } = useCheckoutStore();

  const totalToPay = selectedTables.reduce(
    (total, table) => total + table.table.table.price,
    0
  );

  const dueNow = isPayNowSelected ? totalToPay : selectedTables.length * 50;

  const totalWithHst = (dueNow + dueNow * 0.13) - (useCredits ? creditsToUse : 0);

  const options = {
    selectedTables,
    totalToPay,
    // specialRequest,
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


    const allCheckboxesElems = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );

    const payWithCreditsCheckbox = document.getElementById('pay-with-credits') as HTMLInputElement;

    const checkboxesWithoutCredits = Array.from(allCheckboxesElems).filter(checkbox => checkbox !== payWithCreditsCheckbox);

    const selects = document.querySelectorAll<HTMLSelectElement>('select');

    let uncheckedTableDate = '';

    const isAnyCheckboxCheckedWithoutSelect = function () {
      const checkboxes = Array.from(checkboxesWithoutCredits);

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

    if (useCredits && creditsToUse <= 0) {
      alert("Please enter a valid credit amount to use.");
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
        items,
        paymentType: isPayNowSelected ? 'full' : 'partial',
        market: parsedMarket.data,
        price: totalToPay,
        creditsApplied: useCredits ? creditsToUse : 0,
        depositAmount: dueNow,
        hst: +(dueNow * 0.13).toFixed(2),
        totalToPay: totalWithHst,
        // specialRequest,
        dueNowWithHst: dueNow + dueNow * 0.13,
      })

      if (!parsedCheckoutState.success) {
        alert("Something went wrong. Please try again.");
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
      className="w-full items-center min-w-[250px] flex flex-col gap-5 pb-10"
    >
      <SelectDates
        market={market}
        handleDateSelect={handleNewDateSelect}
        selectedDates={newSelectedDates}
        totalToPay={totalToPay}
        handleOnTableChange={handleOnTableChange}
        dueNow={dueNow}
        businessCategory={user?.business?.industry || ''}
      />

      <PaymentOptions
        dueNow={dueNow}
        totalToPay={totalToPay}
        isEventInLessThan60Days={isEventInLessThan60Days}
        isPayNowSelected={isPayNowSelected}
        setIsPayNowSelected={setIsPayNowSelected}
        credits={user?.credits}
        areTablesSelected={selectedTables.length > 0}
        useCredits={useCredits}
        setUseCredits={setUseCredits}
        creditsToUse={creditsToUse}
        setCreditsToUse={setCreditsToUse}
        totalWithHst={totalWithHst}
      />
      {/* <textarea
        rows={2}
        placeholder="Special Requests"
        className="rounded-lg py-5 px-3 text-black border border-black w-full max-w-[544px]"
        value={specialRequest}
        onChange={(e) => setSpecialRequest(e.target.value)}
      /> */}

      <ContinueButton type="submit" className="max-w-[544px]">Complete Booking</ContinueButton>
    </form>
  );
};

export default SelectOptions;


