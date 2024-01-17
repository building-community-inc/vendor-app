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
} from "@/zod/user-business";
import FileInput from "../../_components/FileInput";
import {
  useFileStore,
  usePdfFileStore,
} from "@/app/_components/store/fileStore";
import PdfUpload from "@/app/_components/PdfUpload";
// import { useState } from "react";

type TVendorCategory = {
  name: string;
};

type TBIFProps = {
  user: TUserWithOptionalBusinessRef;
  vendorCategories: TVendorCategory[];
};

const BusinessInfoForm = ({ vendorCategories }: TBIFProps) => {
  // const [addSupportingDocs, setAddSupportingDocs] = useState(false);
  const router = useRouter();
  const { fileIds: pdfFileIds } = usePdfFileStore();
  const {
    register,
    handleSubmit,
    reset,
    // control,
    formState: { errors, isSubmitting },
  } = useForm<TBusiness>({
    resolver: zodResolver(zodBusiness),
  });

  const fileId = useFileStore((state) => state.fileId);
  const formInputs = Object.keys(zodBusiness.shape)
    .filter((key) => key !== "industry" && key !== "logo" && key !== "pdf")
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
      logo: fileId,
      pdf: pdfFileIds,
    };

    
    const parsedBusinesObj = zodBusinessForm.safeParse(businessObj);
    
    if (!parsedBusinesObj.success) {
      throw new Error(parsedBusinesObj.error.message);
    }

    await fetch("create-business/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBusinesObj.data),
    }).then(async (res) => {
      const body = await res.json();
      if (body._id) {
        reset();
        router.push("/create-business/accept-terms");
      }
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col mx-auto max-w-7xl py-5"
    >
      {formInputs.map(({ name, title }) => {
        return (
          <BusinessFormInputComp
            key={name}
            register={register}
            errors={errors}
            name={name}
            title={title}
          />
        );
      })}

      <label htmlFor={"industry"} className="mt-4 px-12">
        {"Industry"}
      </label>
      <select
        {...register("industry")}
        className="text-black rounded-md px-2 py-1 mb-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]"
      >
        <option>Choose Industry</option>
        {vendorCategories.map(({ name }) => {
          return <option key={name}>{name}</option>;
        })}
      </select>
      {errors["industry"] && (
        <span className="text-red-500">{errors["industry"]?.message}</span>
      )}
      <>
        <div className="mx-auto mt-5 flex flex-col items-start w-full px-12 gap-5">
          <label htmlFor="pdfFile">
            Certificates or Supporting Documents (Optional) PDF Only
          </label>
          <PdfUpload
            useStore={usePdfFileStore}
          />
        </div>

        {errors["pdf"] && (
          <span className="text-red-500">{errors["pdf"]?.message}</span>
        )}
      </>

      <div className="mx-auto mt-5 px-12 flex flex-col items-center gap-5">
        <FileInput useStore={useFileStore} title="upload your logo" />
        <span className="text-sm">* only upload .png</span>
      </div>
      {errors["logo"] && (
        <span className="text-red-500">{errors["logo"]?.message}</span>
      )}

      <button
        disabled={isSubmitting}
        className="disabled:bg-red-200 bg-secondary text-primary rounded-md w-fit px-2 py-1 mx-auto mt-8 text-2xl"
        type="submit"
      >
        {"Next"}
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
const BusinessFormInputComp = ({
  register,
  errors,
  name,
  title,
  hidden = false,
}: TInputProps) => {
  return (
    <section className="flex flex-col gap-1 my-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]">
      <label htmlFor={name} hidden={hidden} className="flex flex-col w-full">
        {title}
        <input
          {...register(name)}
          type="text"
          name={name}
          hidden={hidden}
          className="text-black rounded-md px-2 py-1 mb-2 w-full"
        />
      </label>
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </section>
  );
};
