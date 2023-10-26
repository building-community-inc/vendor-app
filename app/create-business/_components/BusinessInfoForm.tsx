"use client";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TBusinessInfo,
  TUserWithOptionalBusinessInfo,
  zodBusinessInfo,
} from "@/zod/types";
import { sanityWriteClient } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import { camelCaseToTitleCase } from "@/utils/helpers";

type TBIFProps = {
  user: TUserWithOptionalBusinessInfo;
};

const BusinessInfoForm = ({ user }: TBIFProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TBusinessInfo>({
    resolver: zodResolver(zodBusinessInfo),
  });

  const formInputs = Object.keys(zodBusinessInfo.shape)
    .filter((key) => key !== "industry")
    .map((key) => {
      return {
        name: key,
        title: camelCaseToTitleCase(key),
      };
    }) as { name: keyof TBusinessInfo; title: string }[];

  console.log({ formInputs });

  const onSubmit = async (data: TBusinessInfo) => {
    const updatedUser = {
      ...user,
      ...data,
    };

    await sanityWriteClient
      .createOrReplace(updatedUser)
      .then((res) => {
        reset();
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error({ err });
      });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid mx-auto max-w-7xl py-5"
    >
      {formInputs.map(({ name, title }) => {
        return (
          <InputComp
            key={name}
            register={register}
            errors={errors}
            name={name}
            title={title}
          />
        );
      })}


      <label htmlFor={"industry"} className="mt-4">
        {"Industry"}
      </label>
      <select
        {...register("industry")}
        className="text-black rounded-md px-2 py-1 "
      >
        <option>Choose Industry</option>
      </select>

      <button
        disabled={isSubmitting}
        className="disabled:bg-red-200 bg-secondary text-primary rounded-md w-fit px-2 py-1 mx-auto mt-8 text-2xl"
        type="submit"
      >
        {"->"}
      </button>
    </form>
  );
};

export default BusinessInfoForm;

type TInputProps = {
  register: UseFormRegister<TBusinessInfo>;
  errors: FieldErrors<TBusinessInfo>;
  name: keyof TBusinessInfo; // Use keyof to specify that it's a key of TBusinessInfo
  title: string;
};
const InputComp = ({ register, errors, name, title }: TInputProps) => {
  return (
    <section className="flex flex-col gap-1 my-2 w-full min-w-[75vw] max-w-">
      <label htmlFor={name}>{title}</label>
      <input
        {...register(name)}
        className="text-black rounded-md px-2 py-1"
        type="text"
        name={name}
      />
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </section>
  );
};
