import {create} from "zustand";


type FileStoreState = {
  fileId: string;
}

type FileStoreActions = {
  setFileId: (fileId: string) => void;
  clearFileId: () => void;
}

type FileStore = FileStoreState & FileStoreActions


export const useFileStore = create<FileStore>(set => ({
  fileId: '',
  setFileId: (fileId: string) => set({fileId}),
  clearFileId: () => set({fileId: ''}),
}))


