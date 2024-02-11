"use client"

import { useState } from "react";
import RedDot from "../../_components/RedDot";

const PaymentNotification = ({ days }: {
  days: number;
}) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);
  return (
    <>
      {isNotificationVisible && (
        <section className="w-full bg-secondary text-black px-2 py-2 flex relative">
          <RedDot />
          <p className="flex-grow">Amount Owing for your booking(s) is due in {days} day(s).</p>
          <button type="button" onClick={() => setIsNotificationVisible(false)}>x</button>
        </section>
      )}
    </>
  );
}

export default PaymentNotification;