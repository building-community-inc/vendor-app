"use client";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { createMessage } from "../action";
import To from "./To";
import Button from "@/app/_components/Button";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";

const CreateMessageForm = ({ sanityUser, allVendors }: {
  sanityUser: TUserWithOptionalBusinessRef;
  allVendors: TUserWithOptionalBusinessRef[];
}) => {

  const [formState, formAction] = useFormState(createMessage, {
    message: "",
    success: false,
    errors: null
  })

  useEffect(() => {
    if (formState.success) {
      
      redirect("/admin/dashboard/messages");
    }
  }, [formState.success])

  return (
    <form action={formAction} className="mt-10 w-full flex flex-col gap-5">
      <input type="hidden" name="from" value={sanityUser._id} />
      <To vendorList={allVendors || []} />
      {formState.errors?.find(error => error.path[0] === "for") && (
        <span className="text-red-700">
          *{formState.errors.find(error => error.path[0] === "for")?.message}
        </span>
      )}

      <Input label="Subject" name="subject" />
      {formState.errors?.find(error => error.path[0] === "subject") && (
        <span className="text-red-700">
          *{formState.errors.find(error => error.path[0] === "subject")?.message}
        </span>
      )}
      <Textarea label="Body" name="body" />
      {formState.errors?.find(error => error.path[0] === "body") && (
        <span className="text-red-700">
          *{formState.errors.find(error => error.path[0] === "body")?.message}
        </span>
      )}
      {formState.success ? (
        // <Button disabled className="mx-auto bg-white border border-[#707070] py-5 font-semibold px-10 text-lg rounded-none">
        <span>
          Message Sent
        </span>
        // </Button>

      ) : (
        <Button className="mx-auto bg-white border border-[#707070] py-5 font-semibold px-10 text-lg rounded-none">
          Send
        </Button>
      )}
      {formState.errors?.find(error => error.path[0] === "sanity") && (
        <span className="text-red-700">
          *{formState.errors.find(error => error.path[0] === "sanity")?.message}
        </span>
      )}
    </form>
  );
}

export default CreateMessageForm;

type InputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
};

export const Input = ({ label, ...rest }: InputProps) => (
  <label className="border gap-2 border-[#707070] rounded-xl w-full py-2 px-2 flex focus-within:ring-2 focus-within:ring-blue-500">
    <strong className="mt-0">{label}:</strong>
    <input {...rest} className="flex-grow focus:outline-none" />
  </label>
);

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  label: string;
};

const Textarea = ({ label, ...rest }: TextareaProps) => (
  <label className="border gap-2 border-[#707070] rounded-xl w-full py-2 px-2 flex focus-within:ring-2 focus-within:ring-blue-500">
    <strong className="mt-0">{label}:</strong>
    <textarea {...rest} className="flex-grow focus:outline-none" rows={10} />
  </label>
);
