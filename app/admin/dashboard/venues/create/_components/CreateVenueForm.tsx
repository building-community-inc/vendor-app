"use client";
import FileInput from "@/app/_components/FileInput";
import FormInput from "../../../_components/FormInput";
import { useVenueImageIdStore } from "@/app/_components/store/fileStore";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { camelCaseToTitleCase } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { TVenue, zodVenueFormSchema, zodVenueSchema } from "@/zod/venues";
import { TVenueFront } from "@/sanity/queries/venues";
import Image from "next/image";
import { useEffect, useState } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { useSubmitOnEnter } from "@/utils/hooks/useSubmitOnEnter";

// type TVenueDefaultFormValues = Omit<TVenueFront, 'venueMap'> & { venueMap: string };
const CreateVenueForm = ({
  defaultValues,
  defaultImage,
}: {
  defaultValues?: any;
  defaultImage?: {
    _id: string;
    url: string;
  };
}) => {
  const [isFileInputOpen, setIsFileInputOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TVenue>({
    resolver: zodResolver(zodVenueSchema),
    defaultValues,
  });
  const router = useRouter();

  const fileId = useVenueImageIdStore((state) => state.fileId);

  const formInputs = Object.keys(zodVenueSchema.shape)
    .filter((key) => key !== "venueMap")
    .map((key) => {
      return {
        name: key,
        title: camelCaseToTitleCase(key),
      };
    }) as { name: keyof TVenue; title: string }[];

  const onSubmit = async (data: TVenue) => {
    if (defaultImage && !defaultImage._id && !fileId) {
      setError("venueMap", {
        type: "manual",
        message: "Venue Map is required",
      });
      return;
    }
    const venueObj = {
      ...data,
      _type: "venue",
      venueMap: defaultImage ? defaultImage._id : fileId,
      _id: defaultValues ? defaultValues._id : undefined,
    };

    const parsedVenueObj = zodVenueFormSchema.safeParse(venueObj);

    if (!parsedVenueObj.success) {
      throw new Error(parsedVenueObj.error.message);
    }

    try {
      await fetch(
        `/admin/dashboard/venues/${defaultValues ? "update" : "create"}/api/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedVenueObj.data),
        }
      ).then(async (res) => {
        const body = await res.json();
        if (body._id) {
          reset();
          router.push("/admin/dashboard/venues");
          revalidateTag("venues");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useSubmitOnEnter(onSubmit);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 pb-10"
    >
      {formInputs.map(({ name, title }) => {
        return (
          <VenueFormInputComp
            key={name as string}
            register={register}
            errors={errors}
            name={name}
            title={title}
          />
        );
      })}
      {defaultImage && !isFileInputOpen ? (
        <div className="flex flex-col gap-1 my-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]">
          <label
            htmlFor="venueMap"
            className="flex flex-col w-full items-center"
          >
            Venue Map
            <div className="flex items-center justify-evenly w-full">
              <Image
                src={defaultImage.url}
                alt={defaultValues.title}
                // className="w-full"
                width={300}
                height={300}
              />
              <button
                // type="submit"
                // disabled={isSubmitting}
                className="bg-black text-white px-[66px] py-[14px] w-fit h-fit"
                onClick={() => setIsFileInputOpen(true)}
              >
                change image
              </button>
            </div>
          </label>
        </div>
      ) : (
        <>
          <div className="mx-auto">
            <FileInput
              title="Upload Venue Image"
              useStore={useVenueImageIdStore}
            />
          </div>
        </>
      )}
      {errors.venueMap && (
        <span className="text-red-500 text-center">
          {errors.venueMap?.message}
        </span>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-[66px] py-[14px] w-fit mx-auto disabled:bg-slate-600"
      >
        {defaultValues ? "Update Venue" : "Create Venue"}
      </button>
    </form>
  );
};

export default CreateVenueForm;
type TInputProps = {
  register: UseFormRegister<TVenue>;
  errors: FieldErrors<TVenue>;
  name: keyof TVenue; // Use keyof to specify that it's a key of TBusiness
  title: string;
  hidden?: boolean;
};

const VenueFormInputComp = ({
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
        <FormInput
          register={register}
          placeholder={camelCaseToTitleCase(name)}
          name={name}
        />
      </label>
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </section>
  );
};
