import { TUserPayment } from "@/sanity/queries/user";
import { create } from "zustand";

type TPayLaterStoreState = {
  userPayment: TUserPayment | null;
  clientSecret: string | null;
};

type TPayLaterStoreActions = {
  setUserPayment: (userPayment: TUserPayment) => void;
  clearUserPayment: () => void;
  setClientSecret: (clientSecret: string) => void;
  clearClientSecret: () => void;
};

type TPayLaterStore = TPayLaterStoreState & TPayLaterStoreActions;

export const usePayLaterStore = create<TPayLaterStore>((set, get) => ({
  userPayment: null,
  setUserPayment: (userPayment) => set({ userPayment }),
  clearUserPayment: () => set({ userPayment: null }),
  clientSecret: null,
  setClientSecret: (clientSecret) => set({ clientSecret }),
  clearClientSecret: () => set({ clientSecret: null }),
}));
