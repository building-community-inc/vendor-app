import { zodCheckoutStateSchema } from "@/zod/checkout";
import { z } from "zod";
import { create } from "zustand";


export const HST = 0.13;

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
  setHst: (hst: TCheckoutState["hst"]) => void;
  setTotalToPayWithHst: (totalToPayWithHst: TCheckoutState["dueNowWithHst"]) => void;
};

export type TCheckoutStore = TCheckoutState & TCheckoutActions;

export const useCheckoutStore = create<TCheckoutStore>((set, get) => ({
  items: [],
  market: null,
  specialRequest: null,
  hst: 0,
  totalToPay: 0,
  totalToPayWithHst: 0,
  dueNow: 0,
  paymentType: null,
  previousPayment: null,
  setHst: () => {
    const totalAmount = get().totalToPay;
    const hst = totalAmount * HST; // 13% of the total amount
    set({ hst });
  },
  setTotalToPayWithHst: () => {
    const totalAmount = get().totalToPay;
    const hst = totalAmount * HST;
    const totalToPayWithHst = totalAmount + hst;
    set({ dueNowWithHst: totalToPayWithHst });
  },
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
