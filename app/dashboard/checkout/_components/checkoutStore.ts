import { zodCheckoutStateSchema } from "@/zod/checkout";
import { z } from "zod";
import { create } from "zustand";

export type TCheckoutState = z.infer<typeof zodCheckoutStateSchema>;

export type TCheckoutItems = TCheckoutState["items"];
export type TCheckoutActions = {
  setCheckoutItems: (items: TCheckoutItems) => void;
  removeCheckoutItems: () => void;
  setMarket: (market: TCheckoutState["market"]) => void;
  setSpecialRequest: (specialRequest: TCheckoutState["specialRequest"]) => void;
  setTotalToPay: (totalToPay: TCheckoutState["totalToPay"]) => void;
  setDueNow: (dueNow: TCheckoutState["dueNow"]) => void;
  setPaymentType: (paymentType: TCheckoutState["paymentType"]) => void;
  setPreviousPayment: (
    previousPayment: TCheckoutState["previousPayment"]
  ) => void;
  setAllCheckoutData: (data: TCheckoutState) => void;
};

export type TCheckoutStore = TCheckoutState & TCheckoutActions;

export const useCheckoutStore = create<TCheckoutStore>((set, get) => ({
  items: [],
  market: null,
  specialRequest: null,
  totalToPay: 0,
  dueNow: 0,
  paymentType: null,
  previousPayment: null,
  setCheckoutItems: (items: TCheckoutItems) => {
    if (items === null || items === undefined) {
      // Show error message
      console.error("Items is null or undefined");
    } else {
      set({ items });
    }
  },
  removeCheckoutItems: () => set({ items: [] }),
  setMarket: (market: TCheckoutState["market"]) => set({ market }),
  setSpecialRequest: (specialRequest: TCheckoutState["specialRequest"]) =>
    set({ specialRequest }),
  setTotalToPay: (totalToPay: TCheckoutState["totalToPay"]) =>
    set({ totalToPay }),
  setDueNow: (dueNow: TCheckoutState["dueNow"]) => set({ dueNow }),
  setPaymentType: (paymentType: TCheckoutState["paymentType"]) =>
    set({ paymentType }),
  setPreviousPayment: (previousPayment: TCheckoutState["previousPayment"]) =>
    set({ previousPayment }),
  setAllCheckoutData: (data: TCheckoutState) => {
    if (zodCheckoutStateSchema.safeParse(data).success) {
      set(data);
    } else {
      console.error("Invalid data passed to setAllCheckoutData");
    }
  },
}));
