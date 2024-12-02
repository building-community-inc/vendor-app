"use client";
import Button from "@/app/_components/Button";
import { useFormState, useFormStatus } from "react-dom";
import { FaArrowRight } from "react-icons/fa";
import { acceptTerms } from "./acceptTermsAction";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const Form = () => {
  const [formState, formAction] = useFormState(acceptTerms, { errors: [], success: false });

  useEffect(() => {
    if (formState.success) {
      redirect("/dashboard");
    }
  }, [formState.success]);

  return (
    <form
      className="mt-10 flex flex-col items-center pb-10 gap-5"
      action={formAction}
    >
      <label
        htmlFor="acceptance"
        className={`flex items-center gap-2 py-1 ml-2 mb-2 text-2xl font-bold font-darker-grotesque`}
      >
        <input type="checkbox" name="terms" />
        I agree to the terms of service of the Vendor App
      </label>
      <SubmitButton />
      {formState.errors && formState.errors.map((error) => (
        <p key={error} className="text-base text-red-500 mb-2">{error}</p>
      ))}
    </form >
  );
};

export default Form;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}
      className="disabled:bg-slate-200 disabled:text-slate-300 w-fit mx-auto border text-6xl px-3 rounded-3xl"
    >
      <FaArrowRight />
    </Button>
  )
};