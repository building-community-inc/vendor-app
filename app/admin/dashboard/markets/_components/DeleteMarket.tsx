"use client"

import Button from "@/app/_components/Button";
import { deleteMarketAction } from "./deleteMarketAction";
import { useEffect, useActionState } from "react";
import { redirect } from "next/navigation";

const DeleteMarket = ({marketId}: {
  marketId: string;
}) => {

  const [formState, formAction] = useActionState(deleteMarketAction, { success: false , errors: [] });

  useEffect(() => {
    if (formState.success) {
      redirect("/admin/dashboard/markets");
    }
  }, [formState.success])


  return (
    <form action={formAction}>
      <input type="hidden" name="marketId" value={marketId} />
      <Button type="submit" className="w-fit focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
        Delete
      </Button>

      {formState.errors && formState.errors.length > 0 && (
        <ul className="flex flex-col w-fit mx-auto">
          {formState.errors.map((error, index) => (
            <li key={index} className="text-red-600 text-sm">{error}</li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default DeleteMarket;