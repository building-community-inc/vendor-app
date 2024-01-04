import { nanoid } from "nanoid";
import { useEffect } from "react";
import { create } from "zustand";

type Table = {
  id: string;
  price: number;
  key?: string;
};

type TableStore = {
  tables: Table[];
  addTable: (table: Table) => void;
  removeTable: (table: Table) => void;
  resetTables: () => void;
  changeTableValue: (index: number, value: Table) => void;
};

export const useTableInfoStore = create<TableStore>((set) => ({
  tables: [],
  addTable: (table: Table) =>
  set((state) => {
    const newTable = { ...table, _key: nanoid() };
    if (state.tables.length > 0) {
      const lastTableItem = state.tables[state.tables.length - 1];
      const newTableItem = isNaN(+lastTableItem.id)
        ? { ...newTable, id: `${lastTableItem.id}1` }
        : { ...newTable, id: `${+lastTableItem.id + 1}` };
      return { tables: [...state.tables, newTableItem] };
    }
    return { tables: [...state.tables, newTable] };
  }),
  removeTable: (table) =>
    set((state) => ({ tables: state.tables.filter((t) => t.id !== table.id) })),
  resetTables: () => set({ tables: [] }),
  changeTableValue: (index, value) => {
    set((state) => {
      const newTables = [...state.tables];
      newTables[index] = value;
      return {
        tables: newTables,
      };
    });
  },
}));

const TableInfo = ({ defaultTables }: { defaultTables?: Table[] }) => {

  const { tables, addTable, removeTable, resetTables, changeTableValue } =
    useTableInfoStore();

  useEffect(() => {
    if (defaultTables) {
      resetTables();
      defaultTables.forEach((table) => addTable(table));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-bold text-lg text-center">Tables</h4>
      <button type="button" onClick={() => addTable({ id: "1", price: 200 })}>
        + add Table
      </button>
      <ul className="flex flex-col gap-2">
        {tables.map((table, i) => (
          <li key={i} className="flex justify-between gap-2">
            <label className="flex gap-2 items-center">
              Table Id:
              <input
                value={table.id}
                className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 w-1/2`}
                onChange={(e) => changeTableValue(i, { ...table, id: e.target.value })}
                />
            </label>
            <label className="flex gap-2 items-center">
              Table Price:
              <input
                value={table.price}
                type="number"
                className={`border border-secondary-admin-border rounded-[20px] py-2 px-3 w-1/2`}
                onChange={(e) => changeTableValue(i, { ...table, price: +e.target.value })}
                
              />
            </label>
            <button type="button" onClick={() => removeTable(table)}>
              - remove table
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableInfo;
