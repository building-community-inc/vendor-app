"use client";
import Button from "@/app/_components/Button";
import { useEffect, useState } from "react";

const Email = ({ paymentEmail }: {
  paymentEmail: string;
}) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const onClick = () => {
    navigator.clipboard.writeText(paymentEmail).then(() => {
      setShowSuccess(true)
    })
  };

  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => {
        clearTimeout(timeout)
      }
    };
  }, [showSuccess])
  return (
    <>
      <Button onClick={onClick} className="rounded-full border-none bg-[#e5ddd3] w-fit mx-auto">
        {paymentEmail}
      </Button>
      {showSuccess && (
        <p>✔️ copied!</p>
      )}
    </>
  );
}

export default Email;