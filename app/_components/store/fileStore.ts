import {create} from "zustand";


type FileStoreState = {
  fileId: string;
}

type FileStoreActions = {
  setFileId: (fileId: string) => void;
  clearFileId: () => void;
}

export type TFileStore = FileStoreState & FileStoreActions


export const useFileStore = create<TFileStore>((set) => ({
  fileId: '',
  setFileId: (fileId: string) => set({fileId}),
  clearFileId: () => set({fileId: ''}),
}))


export const useMarketImageIdStore = create<TFileStore>((set) => ({
  fileId: '',
  setFileId: (fileId: string) => set({fileId}),
  clearFileId: () => set({fileId: ''}),
}))


