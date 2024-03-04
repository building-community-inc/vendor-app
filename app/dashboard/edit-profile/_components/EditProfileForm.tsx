
"use client";
import { TBusiness, TUserWithOptionalBusinessRef, zodBusiness } from "@/zod/user-business";
import UpdateProfileImage from "../../_components/UpdateProfileImage";
import { redirect } from "next/navigation";
import { camelCaseToTitleCase } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { TErrorType, saveNewBusinessInfo } from "./actions";
import PdfUpload from "@/app/_components/PdfUpload";
import { usePdfFileStore, useUpdateProfileImageStore } from "@/app/_components/store/fileStore";
import { useFormState } from "react-dom";
type TVendorCategory = {
  name: string;
};
const EditProfileForm = ({ sanityUser, vendorCategories }: {
  sanityUser: TUserWithOptionalBusinessRef;
  vendorCategories: TVendorCategory[];

}) => {

  const [formState, formAction] = useFormState(saveNewBusinessInfo, {
    success: false,
    message: "",
    errors: null,
  })
  const { fileIds: pdfFileIds, setFileIds: setPdfFileIds } = usePdfFileStore();

  const { fileId: logoFileId } = useUpdateProfileImageStore();
  if (!sanityUser.business) redirect("/dashboard/create-business");

  const formInputs = Object.keys(zodBusiness.shape)
    .filter((key) => key !== "industry" && key !== "logo" && key !== "pdf")
    .map((key) => {
      return {
        name: key,
        title: camelCaseToTitleCase(key),
      };
    }) as { name: keyof TBusiness; title: string }[];

  useEffect(() => {
    if (sanityUser.business?.pdfs) {
      setPdfFileIds(sanityUser.business.pdfs.map(pdf => pdf._id))
    }
  }, [])

  useEffect(() => {
    if (formState.success) {
      redirect("/dashboard")
    }

  }, [formState])

  return (
    <>
      <form action={formAction} className="px-10 flex flex-col items-center">
        <UpdateProfileImage businessName={sanityUser.business.businessName} logoUrl={sanityUser.business.logoUrl || ""} currentLogoId={sanityUser.business.logo?.asset._ref} />
        <input type="hidden" name="logo" value={logoFileId} readOnly />
        <input type="hidden" name="_id" value={sanityUser.business._id} readOnly />

        {formInputs.map(({ name, title }) => {
          if (name === "_id") return null;
          const value = sanityUser.business ? sanityUser.business[name] : "";
          return (
            <BusinessFormInputComp
              key={name}
              name={name}
              title={title}
              value={value as string}
            />
          );
        })}
        <SelectIndustry sanityUser={sanityUser} vendorCategories={vendorCategories} />
        <section className="mx-auto my-5 flex flex-col items-start w-full px-12 gap-5">
          <label htmlFor="pdfs" className="font-semibold">
            Certificates or Supporting Documents (Optional) PDF Only
          </label>
          <PdfUpload
            useStore={usePdfFileStore}
          />

          {/* {sanityUser.business.pdf?.map((pdf) => (<p>{pdf.asset._ref}</p>)} */}
          {pdfFileIds.length > 0 && pdfFileIds.map(fileId => (



            <input type="hidden" name="pdfs" value={fileId} readOnly />
          )

          )}
        </section>
        {formState.errors && formState.errors.map((error: TErrorType) => (
          <p className="text-red-500">{error.message}</p>
        ))
        }
        <button type="submit" className="bg-blue-500 text-white rounded-md px-2 py-1 mb-2">
          Save Changes
        </button>
      </form>
    </>
  );
};

const SelectIndustry = ({ vendorCategories, sanityUser }: { vendorCategories: TVendorCategory[], sanityUser: TUserWithOptionalBusinessRef }) => {
  const [selectValue, setSelectValue] = useState(sanityUser.business?.industry || "");

  return (
    <>
      <label htmlFor={"industry"} className="mt-4 px-12">
        {"Industry"}
      </label>
      <select
        value={selectValue}
        onChange={(e) => setSelectValue(e.target.value)}
        name="industry"
        className="text-black rounded-md px-2 py-1 mb-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]"
      >
        <option>Choose Industry</option>
        {vendorCategories.map(({ name }) => {
          return <option key={name}>{name}</option>;
        })}
      </select>
    </>
  )
}

export default EditProfileForm;
type TInputProps = {
  name: keyof TBusiness; // Use keyof to specify that it's a key of TBusiness
  title: string;
  hidden?: boolean;
  value: string;
};

const BusinessFormInputComp = ({
  name,
  title,
  hidden = false,
  value
}: TInputProps) => {
  const [valueState, setValueState] = useState(value);
  return (
    <section className="flex flex-col gap-1 my-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]">
      <label htmlFor={name} hidden={hidden} className="flex flex-col w-full">
        {title}
        <input
          type="text"
          name={name}
          hidden={hidden}
          className="text-black rounded-md px-2 py-1 mb-2 w-full"
          value={valueState}
          onChange={(e) => setValueState(e.target.value)}
        />
      </label>
      {/* {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )} */}
    </section>
  );
};
