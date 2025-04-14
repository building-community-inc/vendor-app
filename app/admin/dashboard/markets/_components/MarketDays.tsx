"use client"
import Button from "@/app/_components/Button";
import { areDatesSame, formatDateWLuxon } from "@/utils/helpers";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState, useActionState } from "react";
import { nanoid } from "nanoid";
import Dialog from "@/app/_components/Dialog/Dialog";
import { TTable } from "@/sanity/queries/admin/markets/zods";
import { TMarketVendor } from "../[id]/page";
import { updateTableBooking } from "./newSaveMarketAction";
import RemoveVendorFromMarket from "./RemoveVendorFromMarket";
import EditMarketTables from "./EditMarketTables";
import { Change } from "./changesStore";
import SaveMarketTableChanges from "./SaveMarketTableChanges";

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
  cancelled,
  marketName,
}: {
  marketName: string;
  marketId: string;
  dates: string[];
  vendorsForSelectedDay: {
    vendor: TMarketVendor;
    datesBooked: {
      date: string;
      tableId: string;
    }[];
  }[]
  selectedDay: string | null;
  availableTablesForDay?: { table: TTable }[] | null;
  // daysWithTables: TDayWithTable[] | null | undefined;
  cancelled?: boolean | null | undefined;
}) => {
  const [sortedVendors, setSortedVendors] = useState(vendorsForSelectedDay);
  const [sortedAvailableTables, setSortedAvailableTables] = useState<{ table: TTable }[]>([]);
  const [changes, setChanges] = useState<Change[]>();

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
    console.log("Changes:", changes);
  }, [changes]);

  console.log({ changes })
  return (
    <section className="relative overflow-x-auto">
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
                {formatDateWLuxon(date)}
              </h2>
            </Link>
          );
        })}
      </div>

      {selectedDay && vendorsForSelectedDay && vendorsForSelectedDay.length > 0 && (
        <table className="w-full text-sm my-10 text-left rtl:text-right">
          <thead className="text-xs uppercase bg-gray-50 ">
            <tr className="">
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Table Selection</th>
            </tr>
          </thead>
          <tbody className="">
            {sortedVendors
              .map((vendor) => {
                const bookedDateForSelectedDay = vendor.datesBooked.find(
                  (bookedDate) => areDatesSame(bookedDate.date, selectedDay)
                );
                const bookedDatesForSelectedDay = vendor.datesBooked.filter(
                  (bookedDate) => areDatesSame(bookedDate.date, selectedDay)
                );
                return (
                  <tr key={`${nanoid()}`} className="bg-white border-b border-gray-200">
                    <td className="px-6 py-4">
                      <Link href={`/admin/dashboard/vendors/${vendor.vendor._ref}`} target="_blank" rel="noreferrer">
                        {vendor.vendor.businessName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.vendor.businessCategory}
                      <input readOnly type="text" hidden name="vendorId" value={vendor.vendor._ref} />
                    </td>
                    <td className="px-6 py-4">
                      {bookedDateForSelectedDay && availableTablesForDay ? (
                        editTables ? (
                          <EditMarketTables
                            bookedDatesForSelectedDay={bookedDatesForSelectedDay}
                            sortedAvailableTables={sortedAvailableTables}
                            editTables={editTables}
                            vendor={vendor}
                            setChanges={setChanges}
                          />
                        ) : (
                          <span>{bookedDatesForSelectedDay.map(day => day.tableId).join(", ")}</span>
                        )
                        // <ul className="flex flex-col gap-2">
                        //   {editTables ?
                        //     bookedDatesForSelectedDay.map((date) => (
                        //       <li
                        //         className="flex"
                        //         key={date.tableId}
                        //       >
                        //         <SelectTable
                        //           vendorEmail={vendor.vendor.email}
                        //           vendorInsta={vendor.vendor.instagram || "no handle provided"}
                        //           vendorContactName={`${vendor.vendor.firstName} ${vendor.vendor.lastName}`}
                        //           vendorBusinessName={vendor.vendor.businessName}
                        //           marketName={marketName}
                        //           marketId={marketId}
                        //           vendorId={vendor.vendor._ref}
                        //           originalValue={date.tableId}
                        //           tables={sortedAvailableTables}
                        //           date={date.date}
                        //         />
                        //         <RemoveVendorFromMarket
                        //           vendorEmail={vendor.vendor.email}
                        //           vendorInsta={vendor.vendor.instagram || "no handle provided"}
                        //           vendorContactName={`${vendor.vendor.firstName} ${vendor.vendor.lastName}`}
                        //           vendorBusinessName={vendor.vendor.businessName}
                        //           marketName={marketName}
                        //           date={date.date}
                        //           tableId={date.tableId}
                        //           marketId={marketId}
                        //           vendorId={vendor.vendor._ref}
                        //         />
                        //       </li>

                        //     ))
                        //     : (
                        //       <span>{bookedDatesForSelectedDay.map(day => day.tableId).join(", ")}</span>
                        //       )}

                        // </ul>
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
      {selectedDay && !cancelled && (
        <section className="flex w-full justify-center gap-4">
          {/* {!editTables && ( */}
          <Button
            className="capitalize"
            // className="my-5 py-2 px-8 capitalize bg-black opacity-[1] text-white rounded-none mx-auto"
            onClick={() => setEditTables(!editTables)}
            type="button"
          >
            {editTables ? "cancel" : "edit tables"}
          </Button>
          {/* )} */}

          {editTables ? (
            <SaveMarketTableChanges marketId={marketId} />
          ) : (

            <Link href={`/admin/dashboard/markets/${marketId}/create-booking`}
            >
              <Button>
                Create Booking
              </Button>
            </Link>
          )}
        </section>
      )
      }
      {JSON.stringify(changes, null, 2)}
    </section >
  );
};

export default MarketDays;


// const SubmitButton = () => {
//   const { pending } = useFormStatus()

//   return (
//     <Button type="submit" disabled={pending}>
//       {pending ? "Saving..." : "Save Change"}
//     </Button>
//   );
// };