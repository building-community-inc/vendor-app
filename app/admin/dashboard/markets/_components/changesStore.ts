import { create } from "zustand";



export type Change = {
  type: "update";
  oldTableId: string;
  newTableId: string;
  date: string;
  vendorId: string;
} | {
  type: "delete";
  date: string;
  vendorId: string;
  oldTableId: string;
};


type ChangeStore = {
  changes: Change[] | undefined;
  setChanges: (changes: Change[] | undefined) => void;
  addChange: (change: Change) => void;
  removeAllChanges: () => void;
};

export const useChangesStore = create<ChangeStore>((set) => ({
  changes: undefined,
  setChanges: (changes) => set({ changes }),
  addChange: (change) => set((state) => {
    console.log("adding change", { change, state });
    if (!state.changes) return { changes: [change] };
    const index = state.changes.findIndex(c => c.oldTableId === change.oldTableId && c.date === change.date && c.vendorId === change.vendorId);
    console.log({index, change, stateChanges: state.changes})
    if (index !== -1) {
      const updatedChanges = [...state.changes];
      updatedChanges[index] = { ...updatedChanges[index], ...change };
      return { changes: updatedChanges };
    }

    return { changes: [...state.changes, change] };
  }),
  removeAllChanges: () => set({ changes: undefined })
}));