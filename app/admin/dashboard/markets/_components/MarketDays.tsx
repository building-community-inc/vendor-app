"use client"
import Button from "@/app/_components/Button";
import { TTable, TVendor } from "@/sanity/queries/admin/markets";
import { areDatesSame, formatMarketDate } from "@/utils/helpers";
import Link from "next/link";
import { saveMarketChanges } from "./saveMarketChangesAction";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
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

  const [editTables, setEditTables] = useState(false);



  useEffect(() => {
    if (availableTablesForDay) {
      const sortedTables = [...availableTablesForDay].sort((a, b) => Number(a.table.id) - Number(b.table.id));
      setSortedAvailableTables(sortedTables);
    }
  }, [availableTablesForDay, selectedDay]);

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

  useEffect(() => {
    if (saveMarketFormState.success) {
      setEditTables(false);
    }
  }, [saveMarketFormState.success])

  return (
    <form action={saveMarketFormAction}>
      <div className="flex gap-4 w-fit mx-auto">
        {dates.map((date, i) => {
          return (
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
                  <tr key={`${nanoid()}`} className="text-center capitalize py-2">
                    <td>{vendor.vendor.businessName}</td>
                    <td>
                      {vendor.vendor.businessCategory}
                      <input readOnly type="text" hidden name="vendorId" value={vendor.vendor._ref} />
                    </td>
                    <td>
                      {bookedDateForSelectedDay && availableTablesForDay ? (
                        <>
                          {editTables ? (

                            <SelectTable onChange={e => {
                              setTableSelectionsChanged(true);
                            }}
                              originalValue={bookedDateForSelectedDay.tableId}
                              tables={sortedAvailableTables}
                              key={bookedDateForSelectedDay.tableId}
                            />
                          ) : (
                            <span>{bookedDateForSelectedDay.tableId}</span>
                          )}

                        </>
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
      {!saveMarketFormState.success && (
        <section className="flex max-w-md mx-auto gap-4">
          {!editTables && (

            <Button
              className="my-5 py-2 px-8 bg-black opacity-[1] text-white rounded-none mx-auto"
              onClick={() => setEditTables(true)}
              type="button"
            >
              edit tables
            </Button>
          )}
          <Button
            className="my-5 py-2 px-8 bg-black opacity-[1] text-white rounded-none mx-auto"
            type="button"
          >
            Create Booking
          </Button>
          {selectedDay && tableSelectionsChanged && (
            <>
              <input type="text" hidden name="date" readOnly value={selectedDay} />
              <input type="text" hidden name="marketId" readOnly value={marketId} />
              <Button
                className="my-5 py-2 px-8 bg-black opacity-[1] text-white rounded-none mx-auto"

                // className="my-5 py-2 bg-white border border-primary mx-auto"
                type="submit">
                save changes
              </Button>
            </>
          )}
        </section>
      )}
      {saveMarketFormState.error.length > 1 && (
        <p className="text-red-500 mx-auto w-fit">{saveMarketFormState.error}</p>
      )}
      {saveMarketFormState.success && (
        <section>

          <p className="text-green-500 mx-auto w-fit">Changes saved successfully!</p>
          <Button
            className="my-5 py-2 px-8 bg-black opacity-[1] text-white rounded-none mx-auto"
            onClick={() => {
              const formData = new FormData();
              formData.append("reset", "reset");
              saveMarketFormAction(formData);
              setEditTables(true)
            
            }}
            type="button"
          >
            edit tables
          </Button>
        </section>
      )}
    </form>
  );
};

export default MarketDays;


const SelectTable = ({ onChange, originalValue, tables }: {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  originalValue: string;
  tables: { table: TTable }[];
}) => {
  const [selectedValue, setSelectedValue] = useState(originalValue);

  return (
    <select
      name="tableSelection"
      value={selectedValue}
      onChange={(e) => {
        setSelectedValue(e.target.value);
        onChange(e)
      }}
    >
      <option key={originalValue} value={originalValue}>
        {originalValue}
      </option>
      {tables
        .map((table) => (
          <option key={table.table.id} value={table.table.id}>
            {table.table.id}
          </option>
        ))}
    </select>
  )
}