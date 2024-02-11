"use client";

import { TUserPayment } from "@/sanity/queries/user";
import { usePayLaterStore } from "../../checkout/create-later-payment-intent/_components/store";
import { useRouter } from "next/navigation";




const PayNow = ({ userPayment }: { userPayment: TUserPayment }) => {

  const {push} = useRouter()

  const {setUserPayment} = usePayLaterStore()
  const handlePayNow = () => {
    setUserPayment(userPayment)
    push('/dashboard/checkout/create-later-payment-intent');
  }

  return (
    // <form>

    <button onClick={handlePayNow} className="flex-shrink-0 py-1 px-2 w-fit bg-secondary text-black font-bold rounded-md">Pay Now</button>
    // </form>
  );
}

export default PayNow;