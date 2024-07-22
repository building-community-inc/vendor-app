
"use client";
import { TBusiness, TUserWithOptionalBusinessRef, zodBusiness } from "@/zod/user-business";
import UpdateProfileImage from "../../_components/UpdateProfileImage";
import { redirect } from "next/navigation";
import { camelCaseToTitleCase } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { TErrorType, saveNewBusinessInfo } from "./actions";
import PdfUpload from "@/app/_components/PdfUpload";
import { usePdfFileStore, useUpdateProfileImageStore } from "@/app/_components/store/fileStore";
import { useFormState, useFormStatus } from "react-dom";
import Button from "@/app/_components/Button";
import Link from "next/link";
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

  const [formChanged, setFormChanged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
      <form action={formAction} ref={formRef} className="px-10 flex flex-col max-w-[400px] mx-auto gap-5 mt-10">
        {/* <UpdateProfileImage businessName={sanityUser.business.businessName} logoUrl={sanityUser.business.logoUrl || ""} currentLogoId={sanityUser.business.logo?.asset._ref} /> */}
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
              onChange={(value) => setFormChanged(value)}
            />
          );
        })}
        <SelectIndustry
          onChange={(value) => setFormChanged(value)}
          sanityUser={sanityUser}
          vendorCategories={vendorCategories}
        />

        {formState.errors && formState.errors.map((error: TErrorType) => (
          <p className="text-red-500" key={error.path[0]}>{JSON.stringify(error)}</p>
        ))
        }
        <footer className="flex w-full justify-evenly">

          <Button type="button" className="w-fit font-bold font-darker-grotesque">
            <Link href="/dashboard">
              Cancel
            </Link>
          </Button>
          <SubmitButton formChanged={formChanged} />
        </footer>
      </form>
    </>
  );
};



const SelectIndustry = ({ vendorCategories, sanityUser, onChange }: {
  vendorCategories: TVendorCategory[];
  sanityUser: TUserWithOptionalBusinessRef;
  onChange?: (value: boolean) => void;
}) => {
  const [selectValue, setSelectValue] = useState(sanityUser.business?.industry || "");

  return (
    <>
      <label htmlFor={"industry"} className="">
        <h2 className="font-darker-grotesque text-2xl text-black">
          {"Industry"}
        </h2>
      </label>
      <select
        value={selectValue}
        onChange={(e) => {
          setSelectValue(e.target.value)
          if (sanityUser.business?.industry !== e.target.value) {
            console.log("change")
            onChange && onChange(true)
          } else {
            console.log("no change")
            onChange && onChange(false)
          }
        }}
        name="industry"
        className="text-black border border-button-border-color text-lg rounded-lg px-2 py-2 mb-2"
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
  onChange?: (value: boolean) => void;
};

const BusinessFormInputComp = ({
  name,
  title,
  hidden = false,
  value,
  onChange
}: TInputProps) => {
  const [valueState, setValueState] = useState(value);
  return (
    // <section className="flex flex-col gap-1 my-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]">
    <label htmlFor={name} hidden={hidden} className="flex flex-col gap-2">
      <h2 className="font-darker-grotesque text-2xl text-black">
        {title}
      </h2>
      <input
        type="text"
        name={name}
        hidden={hidden}
        defaultValue={valueState}
        className="w-full text-lg py-2 px-2 border border-button-border-color rounded-lg"
        onChange={(e) => {
          setValueState(e.target.value)
          if (value !== e.target.value) {
            console.log("change")
            onChange && onChange(true)
          } else {
            console.log("no change")
            onChange && onChange(false)
          }
        }}
      />
    </label>

  );
};


const SubmitButton = ({formChanged}: {
  formChanged: boolean;
}) => {
  const {pending} = useFormStatus();
  return (
    <Button type="submit" disabled={!formChanged || pending} className="disabled:text-gray-400 disabled:bg-gray-300 w-fit font-bold font-darker-grotesque">
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}

const PdfSection = ({ pdfFileIds }: {
  pdfFileIds: string[];
  // sanityUser: TUserWithOptionalBusinessRef;
}) => {
  return (
    <section className="mx-auto my-5 flex flex-col items-start w-full px-12 gap-5">
      <label htmlFor="pdfs" className="font-semibold">
        Certificates or Supporting Documents (Optional) PDF Only
      </label>
      <PdfUpload
        useStore={usePdfFileStore}
      />

      {/* {sanityUser.business.pdf?.map((pdf) => (<p>{pdf.asset._ref}</p>)} */}
      {pdfFileIds.length > 0 && pdfFileIds.map(fileId => (

        <input key={fileId} type="hidden" name="pdfs" value={fileId} readOnly />
      )

      )}
    </section>
  )
}