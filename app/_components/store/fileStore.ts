import { create } from "zustand";

type FileStoreState = {
  fileId: string;
};
type PdfFileStoreState = {
  fileIds: string[];
};

type FileStoreActions = {
  setFileId: (fileId: string) => void;
  clearFileId: () => void;
};
type PdfFileStoreActions = {
  setFileIds: (fileIds: string[]) => void;
  clearFileIds: () => void;
  removeFileId: (fileId: string) => void;
  addFileId: (fileId: string) => void;
};
export type TPdfFileStore = PdfFileStoreState & PdfFileStoreActions;

export type TFileStore = FileStoreState & FileStoreActions;

export const useFileStore = create<TFileStore>((set) => ({
  fileId: "",
  setFileId: (fileId: string) => set({ fileId }),
  clearFileId: () => set({ fileId: "" }),
}));
export const usePdfFileStore = create<TPdfFileStore>((set, get) => ({
  fileIds: [],
  setFileIds: (fileIds: string[]) => set({ fileIds }),
  clearFileIds: () => set({ fileIds: [] }),
  removeFileId: (fileId: string) => {
    const { fileIds } = get();
    set({ fileIds: fileIds.filter(id => id !== fileId) });
  },
  addFileId: (fileId: string) => {
    const { fileIds } = get();
    set({ fileIds: [...fileIds, fileId] });
  },
}));

export const useMarketImageIdStore = create<TFileStore>((set) => ({
  fileId: "",
  setFileId: (fileId: string) => set({ fileId }),
  clearFileId: () => set({ fileId: "" }),
}));

export const useVenueImageIdStore = create<TFileStore>((set) => ({
  fileId: "",
  setFileId: (fileId: string) => set({ fileId }),
  clearFileId: () => set({ fileId: "" }),
}));
