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
  setPaymentType: (paymentType: TCheckoutState["paymentType"]) => void;
  setPrice: (price: TCheckoutState["price"]) => void;
  setCreditsApplied: (creditsApplied: TCheckoutState["creditsApplied"]) => void;
  setDepositAmount: (depositAmount: TCheckoutState["depositAmount"]) => void;
  setAllCheckoutData: (data: TCheckoutState) => void;
  setHst: (hst: TCheckoutState["hst"]) => void;
  setTotalToPay: (totalToPayWithHst: TCheckoutState["totalToPay"]) => void;
  setSpecialRequest: (specialRequest: TCheckoutState["specialRequest"]) => void;
  setPreviousPayment: (
    previousPayment: TCheckoutState["previousPayment"]
  ) => void;
};

export type TCheckoutStore = TCheckoutState & TCheckoutActions;

export const useCheckoutStore = create<TCheckoutStore>((set, get) => ({
  items: [],
  market: null,
  paymentType: null,
  price: 0,
  creditsApplied: 0,
  depositAmount: 0,
  hst: 0,
  totalToPay: 0,
  specialRequest: null,
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
  setPaymentType: (paymentType: TCheckoutState["paymentType"]) =>
    set({ paymentType }),
  setPrice: (price: TCheckoutState["price"]) => set({ price }),
  setCreditsApplied: (creditsApplied: TCheckoutState["creditsApplied"]) =>
    set({ creditsApplied }),
  setDepositAmount: (depositAmount: TCheckoutState["depositAmount"]) =>
    set({ depositAmount }),
  setHst: () => {
    const totalAmount = get().price;
    const hst = totalAmount * HST; // 13% of the total amount
    set({ hst });
  },
  setTotalToPay: () => {
    const totalAmount = get().price;
    const hst = get().hst;
    const totalToPayWithHst = totalAmount + hst;
    set({ totalToPay: totalToPayWithHst });
  },
  setSpecialRequest: (specialRequest: TCheckoutState["specialRequest"]) =>
    set({ specialRequest }),
  setPreviousPayment: (previousPayment: TCheckoutState["previousPayment"]) =>
    set({ previousPayment }),
  setAllCheckoutData: (data: TCheckoutState) => {
    if (zodCheckoutStateSchema.safeParse(data).success) {
      console.log({data})
      set(data);
    } else {
      console.error("Invalid data passed to setAllCheckoutData");
    }
  },
}));
