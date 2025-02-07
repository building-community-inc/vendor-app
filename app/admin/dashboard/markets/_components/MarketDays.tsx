"use client"
import Button from "@/app/_components/Button";
import { areDatesSame, formatDateWLuxon } from "@/utils/helpers";
import Link from "next/link";
import { saveMarketChanges } from "./saveMarketChangesAction";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import Dialog from "@/app/_components/Dialog/Dialog";
import { TTable, TVendor } from "@/sanity/queries/admin/markets/zods";
import { FaRegTrashAlt } from "react-icons/fa";
import { TMarketVendor } from "../[id]/page";


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
  cancelled
}: {
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
  availableTablesForDay: { table: TTable }[] | null;
  daysWithTables: TDayWithTable[] | null | undefined;
  cancelled?: boolean | null | undefined;
}) => {
  const [saveMarketFormState, saveMarketFormAction] = useFormState(saveMarketChanges, { error: "", success: false });
  const [sortedVendors, setSortedVendors] = useState(vendorsForSelectedDay);
  const [sortedAvailableTables, setSortedAvailableTables] = useState<{ table: TTable }[]>([]);

  const [tableSelectionsChanged, setTableSelectionsChanged] = useState(false);

  const [editTables, setEditTables] = useState(false);

  const [deletedVendors, setDeletedVendors] = useState<TVendor[]>([]);

  const deleteVendor = (vendorId: string) => {
    setSortedVendors(prevVendors => {
      const vendorToDelete = prevVendors.find(vendor => vendor.vendor._ref === vendorId);
      if (vendorToDelete) {
        setDeletedVendors(prevDeletedVendors => {
          if (!prevDeletedVendors.some(vendor => vendor.vendor._ref === vendorId)) {
            return [...prevDeletedVendors, vendorToDelete];
          }
          return prevDeletedVendors;
        });
      }
      return prevVendors.filter(vendor => vendor.vendor._ref !== vendorId);
    });
  };



  const dialogRef = useRef<HTMLDialogElement>(null);

  const formRef = useRef<HTMLFormElement>(null);




  // const deleteVendor = (vendorId: string) => {
  //   setSortedVendors(prevVendors => prevVendors.filter(vendor => vendor.vendor._ref !== vendorId));
  // };


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
      const timeout = setTimeout(() => {
        const formData = new FormData();
        formData.append("reset", "reset");
        saveMarketFormAction(formData);
        // formRef.current?.reset();
      }, 4000);
      return () => clearTimeout(timeout);
    }


  }, [saveMarketFormState.success])


  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  return (
    <form action={saveMarketFormAction} ref={formRef}>
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
        <table className="my-10 mx-auto">
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
                const bookedDatesForSelectedDay = vendor.datesBooked.filter(
                  (bookedDate) => areDatesSame(bookedDate.date, selectedDay)
                );

                return (
                  <tr key={`${nanoid()}`} className="text-center capitalize py-2">
                    <td>
                      <Link href={`/admin/dashboard/vendors/${vendor.vendor._ref}`} target="_blank" rel="noreferrer">
                        {vendor.vendor.businessName}
                      </Link>
                    </td>
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
                            <span>{bookedDatesForSelectedDay.map(day => day.tableId).join(", ")}</span>
                          )}

                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    {editTables && (
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            deleteVendor(vendor.vendor._ref)
                            setTableSelectionsChanged(true);
                          }}
                          className=" flex items-center"
                        >
                          <FaRegTrashAlt className="text-2xl" />

                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      {selectedDay && !cancelled && (
        <section className="flex max-w-md mx-auto gap-4">
          {!editTables && (

            <Button
              className="my-5 py-2 px-8 capitalize bg-black opacity-[1] text-white rounded-none mx-auto"
              onClick={() => setEditTables(true)}
              type="button"
            >
              edit tables
            </Button>
          )}
          <Link href={`/admin/dashboard/markets/${marketId}/create-booking`}
            className="my-5 py-2 px-8 bg-black opacity-[1] text-white rounded-none mx-auto"
          >

            Create Booking
          </Link>
          {selectedDay && tableSelectionsChanged && (
            <>
              <div className="flex flex-col">

                {deletedVendors.map(vendor => (
                  <input key={vendor.vendor._ref} type="text" name="deletedVendors" hidden readOnly value={JSON.stringify(vendor)} />
                ))}
              </div>
              <input type="text" hidden name="date" readOnly value={selectedDay} />
              <input type="text" hidden name="marketId" readOnly value={marketId} />
              <Button
                className="my-5 capitalize py-2 px-8 bg-black opacity-[1] text-white rounded-none mx-auto"
                type="button"
                onClick={() => toggleDialog()}
              >
                save changes
              </Button>
            </>
          )}
        </section>
      )
      }
      {
        saveMarketFormState.error.length > 1 && (
          <p className="text-red-500 mx-auto w-fit">{saveMarketFormState.error}</p>
        )
      }
      {
        saveMarketFormState.success && (
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
        )
      }

      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        <div>
          Are you sure you want to save the changes?
          <footer className="flex gap-2 justify-center mt-2">

            <Button type="button" onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
              toggleDialog();
            }}>
              Save changes
            </Button>
            <Button type="button" onClick={toggleDialog}>
              Cancel
            </Button>
          </footer>
        </div>
      </Dialog>
    </form >
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