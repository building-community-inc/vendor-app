"use client"
import Button from "@/app/_components/Button";
import { TTable, TVendor } from "@/sanity/queries/admin/markets";
import { areDatesSame, formatMarketDate } from "@/utils/helpers";
import Link from "next/link";
import { saveMarketChanges } from "./saveMarketChangesAction";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
export type TDayWithTable = {
  date: string;
  tables: {
    table: TTable;
    booked?:
    | {
      _type: string;
      _ref: string;
    }
    | null
    | undefined;
  }[];
};
const MarketDays = ({
  dates,
  vendorsForSelectedDay,
  marketId,
  selectedDay,
  availableTablesForDay,
  daysWithTables
}: {
  marketId: string;
  dates: string[];
  vendorsForSelectedDay: TVendor[];
  selectedDay: string | null;
  availableTablesForDay: { table: TTable }[] | null;
  daysWithTables: TDayWithTable[] | null | undefined;
}) => {
  const [saveMarketFormState, saveMarketFormAction] = useFormState(saveMarketChanges, { error: "", success: false });
  const [sortedVendors, setSortedVendors] = useState(vendorsForSelectedDay);
  const [sortedAvailableTables, setSortedAvailableTables] = useState<{ table: TTable }[]>([]);

  const [tableSelectionsChanged, setTableSelectionsChanged] = useState(false);


  useEffect(() => {
    if (availableTablesForDay) {
      const sortedTables = [...availableTablesForDay].sort((a, b) => Number(a.table.id) - Number(b.table.id));
      setSortedAvailableTables(sortedTables);
    }
  }, [availableTablesForDay]);

  useEffect(() => {
    if (!selectedDay) return;
    const sorted = [...vendorsForSelectedDay].sort((a, b) => {
      const aBookedDate = a.datesBooked.find(
        (bookedDate) => areDatesSame(bookedDate.date, selectedDay)
      );
      const bBookedDate = b.datesBooked.find(
        (bookedDate) => areDatesSame(bookedDate.date, selectedDay)
      );

      if (!aBookedDate) {
        return 1;
      }

      if (!bBookedDate) {
        return -1;
      }

      const aTableId = Number(aBookedDate.tableId);
      const bTableId = Number(bBookedDate.tableId);

      if (isNaN(aTableId) || isNaN(bTableId)) {
        return 0;
      }

      return aTableId - bTableId;
    });

    setSortedVendors(sorted);
  }, [selectedDay, vendorsForSelectedDay]);

  return (
    <form action={saveMarketFormAction}>
      <div className="flex gap-4 w-fit mx-auto">
        {dates.map((date, i) => {
          return (
            // <button
            //   type="button"
            //   // onClick={() => setSelectedDay(date)}
            // >
            <Link
              key={date + i}
              className={`flex flex-col justify-center gap-4 w-fit border-4 border-black p-2 rounded-[20px] ${selectedDay === date ? "border-black" : "border-slate-200"
                } `}
              href={`${marketId}?selectedDay=${date}`}
              scroll={false}
            >
              <h2 className="font-bold text-xl max-w-[8ch] text-center">
                {formatMarketDate(date).replace(",", "")}
              </h2>
            </Link>
            // </button>
          );
        })}
      </div>

      {selectedDay && vendorsForSelectedDay && vendorsForSelectedDay.length > 0 && (
        <table className="my-10">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Table Selection</th>
            </tr>
          </thead>
          <tbody>
            {sortedVendors
              .map((vendor) => {
                const bookedDateForSelectedDay = vendor.datesBooked.find(
                  (bookedDate) => areDatesSame(bookedDate.date, selectedDay)
                );

                return (
                  <tr key={vendor.vendor.businessName} className="text-center capitalize py-2">
                    <td>{vendor.vendor.businessName}</td>
                    <td>
                      {vendor.vendor.businessCategory}
                      <input readOnly type="text" hidden name="vendorId" value={vendor.vendor._ref} />
                    </td>
                    <td>
                      {bookedDateForSelectedDay && availableTablesForDay ? (
                        <select
                          name="tableSelection"
                          defaultValue={bookedDateForSelectedDay.tableId}
                          // onChange={e => changeTheTableForBooking(selectedDay, e.currentTarget.value, vendor.vendor._ref)}

                          onChange={e => {
                            setTableSelectionsChanged(true);
                          }}
                        >
                          <option key={bookedDateForSelectedDay.tableId} value={bookedDateForSelectedDay.tableId}>
                            {bookedDateForSelectedDay.tableId}
                          </option>
                          {sortedAvailableTables
                            .map((table) => (
                              <option key={table.table.id} value={table.table.id}>
                                {table.table.id}
                              </option>
                            ))}
                        </select>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      {selectedDay && tableSelectionsChanged && (
        <>
          <input type="text" hidden name="date" readOnly value={selectedDay} />
          <input type="text" hidden name="marketId" readOnly value={marketId} />
          <Button className="my-5 py-2 bg-white border border-primary mx-auto" type="submit">
            save changes
          </Button>
          {saveMarketFormState.error.length > 1 && (
            <p className="text-red-500 mx-auto w-fit">{saveMarketFormState.error}</p>
          )}
        </>
      )}
    </form>
  );
};

export default MarketDays;
