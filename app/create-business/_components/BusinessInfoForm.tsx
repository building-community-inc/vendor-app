"use client";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sanityWriteClient } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import { camelCaseToTitleCase } from "@/utils/helpers";
import {
  TBusiness,
  TUserWithOptionalBusinessRef,
  zodBusiness,
} from "@/zod/types";

type TVendorCategory = {
  name: string;
};

type TBIFProps = {
  user: TUserWithOptionalBusinessRef;
  vendorCategories: TVendorCategory[];
};

const BusinessInfoForm = ({ user, vendorCategories }: TBIFProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TBusiness>({
    resolver: zodResolver(zodBusiness),
  });

  const formInputs = Object.keys(zodBusiness.shape)
    .filter((key) => key !== "industry")
    .map((key) => {
      return {
        name: key,
        title: camelCaseToTitleCase(key),
      };
    }) as { name: keyof TBusiness; title: string }[];

  const onSubmit = async (data: TBusiness) => {

    const businessObj = {
      ...data,
      _type: "business",
    };
    await sanityWriteClient
      .create(businessObj)
      .then(async (res) => {
        await sanityWriteClient
          .patch(user._id)
          .set({ business: { _ref: res._id } })
          .commit()
          .then(() => {
            reset();
            router.push("/create-business/accept-terms");
          });
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
        {vendorCategories.map(({ name }) => {
          return <option key={name}>{name}</option>;
        })}
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
  register: UseFormRegister<TBusiness>;
  errors: FieldErrors<TBusiness>;
  name: keyof TBusiness; // Use keyof to specify that it's a key of TBusiness
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
