"use client";
import {
  FieldErrors,
  UseFormRegister,
  useForm,
  // Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { camelCaseToTitleCase } from "@/utils/helpers";
import {
  TBusiness,
  TUserWithOptionalBusinessRef,
  zodBusiness,
  zodBusinessForm,
  // zodBusinessForm,
} from "@/zod/types";
import FileInput from "./FileInput";
import { useFileStore } from "@/app/_components/store/fileStore";

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<TBusiness>({
    resolver: zodResolver(zodBusiness),
  });
  const fileId = useFileStore((state) => state.fileId);
  const formInputs = Object.keys(zodBusiness.shape)
    .filter((key) => key !== "industry" && key !== "logo")
    .map((key) => {
      return {
        name: key,
        title: camelCaseToTitleCase(key),
      };
    }) as { name: keyof TBusiness; title: string }[];

  const onSubmit = async (data: TBusiness) => {
    console.log("trying to save");
    const businessObj = {
      ...data,
      _type: "business",
      logo: fileId,
    };

    const parsedBusinesObj = zodBusinessForm.safeParse(businessObj);
    console.log({ parsedBusinesObj });

    if (!parsedBusinesObj.success) {
      throw new Error(parsedBusinesObj.error.message);
    }

    await fetch("create-business/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBusinesObj.data),
    }).then((res) => {
     
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
        className="text-black rounded-md px-2 py-1 mb-2"
      >
        <option>Choose Industry</option>
        {vendorCategories.map(({ name }) => {
          return <option key={name}>{name}</option>;
        })}
      </select>
      {errors["industry"] && (
        <span className="text-red-500">{errors["industry"]?.message}</span>
      )}
      <div className="mx-auto">
        <FileInput />
      </div>
      {errors["logo"] && (
        <span className="text-red-500">{errors["logo"]?.message}</span>
      )}

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
  hidden?: boolean;
};
const InputComp = ({
  register,
  errors,
  name,
  title,
  hidden = false,
}: TInputProps) => {
  return (
    <section className="flex flex-col gap-1 my-2 w-full min-w-[75vw]">
      <label htmlFor={name} hidden={hidden}>
        {title}
      </label>
      <input
        {...register(name)}
        type="text"
        name={name}
        hidden={hidden}
        className="text-black rounded-md px-2 py-1 mb-2"
      />
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </section>
  );
};
