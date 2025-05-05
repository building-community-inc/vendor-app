"use client";

import { TTable } from "@/sanity/queries/admin/markets/zods";
import RemoveVendorFromMarket from "./RemoveVendorFromMarket";
import { Dispatch, memo, SetStateAction, useState } from "react";
import { TMarketVendor } from "../[id]/page";
import { Change, useChangesStore } from "./changesStore";
import { FaRegTrashAlt } from "react-icons/fa";

const EditMarketTables = ({
  setChanges,
  bookedDatesForSelectedDay,
  editTables,
  sortedAvailableTables,
  vendor,
}: {
  editTables: boolean;
  bookedDatesForSelectedDay: { date: string; tableId: string }[];
  sortedAvailableTables: {
    table: TTable;
  }[];
  vendor: {
    vendor: TMarketVendor;
    datesBooked: {
      date: string;
      tableId: string;
    }[];
  };
  setChanges: Dispatch<SetStateAction<Change[] | undefined>>;
}) => {
  const { addChange, changes } = useChangesStore();

  const onDelete = (date: string, oldTableId: string) => {
    addChange({
      type: "delete",
      date,
      oldTableId,
      vendorId: vendor.vendor._ref,
    });
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {editTables
          ? bookedDatesForSelectedDay.map((date, index) => {
              const deletedItem = changes?.find(
                (change) =>
                  change.type === "delete" &&
                  change.oldTableId === date.tableId &&
                  change.date === date.date
              );
              console.log({ deletedItem });
              return (
                <li
                  className={`flex relative items-center`}
                  key={`${date.date}-${date.tableId}`} // Combine date and original tableId for uniqueness
                >
                  <div className="">{date.date}</div>
                  <div
                    className={`w-full bg-red-600 h-1.5 absolute top-1/2 -translate-y-1/2 left-0 opacity-80 ${
                      deletedItem ? "" : "hidden"
                    } `}
                  ></div>
                  <SelectTable
                    initialValue={date.tableId}
                    tables={sortedAvailableTables}
                    setChanges={setChanges}
                    date={date.date}
                    vendorId={vendor.vendor._ref}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      ~onDelete(date.date, date.tableId);
                      // setChanges((prev) => {
                      //   if (!prev) return prev;
                      //   return prev.filter((change) => change.oldTableId !== date.tableId || change.date !== date.date);
                      // });
                    }}
                    className=" flex items-center cursor-pointer"
                  >
                    <FaRegTrashAlt className="text-2xl" />
                  </button>

                  {/* <RemoveVendorFromMarket
              vendorEmail={vendor.vendor.email}
              vendorInsta={vendor.vendor.instagram || "no handle provided"}
              vendorContactName={`${vendor.vendor.firstName} ${vendor.vendor.lastName}`}
              vendorBusinessName={vendor.vendor.businessName}
              marketName={marketName}
              date={date.date}
              tableId={date.tableId}
              marketId={marketId}
              vendorId={vendor.vendor._ref}
              /> */}
                </li>
              );
            })
          : null}
      </ul>
      {/* {JSON.stringify(changes, null, 2)} */}
    </>
  );
};

export default EditMarketTables;

const SelectTable = memo(
  ({
    initialValue,
    tables,
    setChanges,
    date,
    vendorId,
  }: {
    initialValue: string;
    tables: { table: TTable }[];
    setChanges: Dispatch<SetStateAction<Change[] | undefined>>;
    date: string;
    vendorId: string;
  }) => {
    // const originalValueRef = useRef(initialValue);
    const [selectedValue, setSelectedValue] = useState(initialValue);

    const { addChange } = useChangesStore();
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      addChange({
        type: "update",
        oldTableId: initialValue,
        newTableId: newValue,
        date,
        vendorId,
      });
      setSelectedValue(newValue);
    };

    return (
      <>
        <select
          name="tableSelection"
          value={selectedValue}
          className="border border-black rounded-lg w-fit flex mx-auto px-1 py-0.5"
          onChange={onChange}
        >
          {/* <option key={originalValue} value={originalValue}>
          {originalValue}
        </option> */}
          {tables.map((table) => (
            <option key={table.table.id} value={`${table.table.id}`}>
              {table.table.id}
            </option>
          ))}
        </select>
      </>
    );
  }
);

d;
