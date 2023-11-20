"use client";
import FileInput from "@/app/_components/FileInput";
import FormInput from "../../../_components/FormInput";
import { useVenueImageIdStore } from "@/app/_components/store/fileStore";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { camelCaseToTitleCase } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { TVenue, zodSanityVenue, zodVenueFormSchema, zodVenueSchema } from "@/zod/venues";



const CreateVenueForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TVenue>({
    resolver: zodResolver(zodVenueSchema),
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
    console.log(data);
    if (!fileId) {
      setError("venueMap", {
        type: "manual",
        message: "Venue Map is required",
      });
      return;
    }
    const venueObj = {
      ...data,
      _type: "venue",
      venueMap: fileId,
    };

    const parsedVenueObj = zodVenueFormSchema.safeParse(venueObj);

    if (!parsedVenueObj.success) {
      throw new Error(parsedVenueObj.error.message);
    }

    try {
      await fetch("/admin/dashboard/venues/create/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedVenueObj.data),
      }).then(async (res) => {
        const body = await res.json();
        if (body._id) {
          reset();
          router.push("/admin/dashboard/venues");
        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 pb-10"
    >
      {formInputs.map(({ name, title }) => {
        return (
          <VenueFormInputComp
            key={name}
            register={register}
            errors={errors}
            name={name}
            title={title}
          />
        );
      })}
      <div className="mx-auto">
        <FileInput title="Upload Venue Image" useStore={useVenueImageIdStore} />
      </div>
      {errors.venueMap && (
        <span className="text-red-500 text-center">{errors.venueMap?.message}</span>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-[66px] py-[14px] w-fit mx-auto"
      >
        Create Venue
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
        <FormInput register={register} placeholder={name} name={name} />
      </label>
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </section>
  );
};
