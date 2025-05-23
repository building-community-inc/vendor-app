"use client";
import {
  TBusiness,
  TUserWithOptionalBusinessRef,
  zodBusiness,
} from "@/zod/user-business";
import { redirect, usePathname } from "next/navigation";
import { camelCaseToTitleCase } from "@/utils/helpers";
import { useEffect, useRef, useState, useActionState } from "react";
import { saveNewBusinessInfo } from "./actions";
import {
  usePdfFileStore,
  useUpdateProfileImageStore,
} from "@/app/_components/store/fileStore";
import { useFormStatus } from "react-dom";
import Button from "@/app/_components/Button";
import Link from "next/link";
type TVendorCategory = {
  name: string;
};
const EditProfileForm = ({
  sanityUser,
  vendorCategories,
  redirectPath,
}: {
  sanityUser: TUserWithOptionalBusinessRef;
  vendorCategories: TVendorCategory[];
  redirectPath?: string;
}) => {
  const [formState, formAction] = useActionState(saveNewBusinessInfo, {
    success: false,
    // message: "",
    errors: null,
  });

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
      setPdfFileIds(sanityUser.business.pdfs.map((pdf) => pdf._id));
    }
  }, []);

  useEffect(() => {
    if (formState.success) {
      if (redirectPath) {
        redirect(redirectPath);
      } else {
        redirect("/dashboard");
      }
    }
  }, [formState]);

  return (
    <>
      <form
        action={formAction}
        ref={formRef}
        className="px-10 flex flex-col max-w-[400px] mx-auto gap-5 mt-10"
      >
        {/* <UpdateProfileImage businessName={sanityUser.business.businessName} logoUrl={sanityUser.business.logoUrl || ""} currentLogoId={sanityUser.business.logo?.asset._ref} /> */}
        <input type="hidden" name="logo" value={logoFileId} readOnly />
        <input
          type="hidden"
          name="_id"
          value={sanityUser.business._id}
          readOnly
        />

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

        {formState.errors &&
          (Array.isArray(formState.errors)
            ? formState.errors.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))
            : // Handle the case where formState.errors is a ZodError
              formState.errors.issues.map((issue) => (
                <p key={issue.path.join(".")} className="text-red-500">
                  {issue.message}
                </p>
              )))}
        <footer className="flex w-full justify-evenly">
          <Button
            type="button"
            className="w-fit font-bold font-darker-grotesque"
          >
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <SubmitButton formChanged={formChanged} />
        </footer>
      </form>
    </>
  );
};

const SelectIndustry = ({
  vendorCategories,
  sanityUser,
  onChange,
}: {
  vendorCategories: TVendorCategory[];
  sanityUser: TUserWithOptionalBusinessRef;
  onChange?: (value: boolean) => void;
}) => {
  const pathname = usePathname();
  const [selectValue, setSelectValue] = useState(
    sanityUser.business?.industry || ""
  );

  return (
    <>
      <label htmlFor={"industry"} className="">
        <h2 className="font-darker-grotesque text-2xl text-black">
          {"Industry"}
        </h2>
      </label>
      {pathname.includes("admin") ? (
        <select
          value={selectValue}
          onChange={(e) => {
            setSelectValue(e.target.value);
            if (sanityUser.business?.industry !== e.target.value) {
              onChange && onChange(true);
            } else {
              onChange && onChange(false);
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
      ) : (
        <>
          <input
            type="hidden"
            name="industry"
            defaultValue={selectValue}
            readOnly
          />
          {selectValue}
        </>
      )}
    </>
  );
};

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
  onChange,
}: TInputProps) => {
  const [valueState, setValueState] = useState(value);
  return (
    // <section className="flex flex-col gap-1 my-2 max-w-full w-[75vw] mx-auto xs:w-full  sm:w-[75vw]">
    <label htmlFor={name} hidden={hidden} className="flex flex-col gap-2">
      <h2 className="font-darker-grotesque text-2xl text-black">{title}</h2>
      <input
        type="text"
        name={name}
        hidden={hidden}
        defaultValue={valueState}
        className="w-full text-lg py-2 px-2 border border-button-border-color rounded-lg"
        onChange={(e) => {
          setValueState(e.target.value);
          if (value !== e.target.value) {
            onChange && onChange(true);
          } else {
            onChange && onChange(false);
          }
        }}
      />
    </label>
  );
};

const SubmitButton = ({ formChanged }: { formChanged: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={!formChanged || pending}
      className="disabled:text-gray-400 disabled:bg-gray-300 w-fit font-bold font-darker-grotesque"
    >
      {pending ? "Saving..." : "Save"}
    </Button>
  );
};
