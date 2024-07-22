"use client"

import PdfUpload from "@/app/_components/PdfUpload";
import { usePdfFileStore } from "@/app/_components/store/fileStore";
import UpdateProfileImage from "../_components/UpdateProfileImage";
import Button from "@/app/_components/Button";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useState } from "react";

const UploadFilesForm = ({
  businessName,
  logoUrl,
  assetRef,
}: {
  businessName: string;
  logoUrl?: string | null;
  assetRef?: string;
}) => {
  const { fileIds: pdfFileIds, setFileIds: setPdfFileIds } = usePdfFileStore();
  const [formChanged, setFormChanged] = useState(false);
  return (
    <form>
      <UpdateProfileImage businessName={businessName} logoUrl={logoUrl || ""} currentLogoId={assetRef} />

      <PdfSection pdfFileIds={pdfFileIds} onChange={(value) => setFormChanged(value)} />

      <footer className="flex w-full justify-evenly">

        <Button type="button" className="w-fit font-bold font-darker-grotesque">
          <Link href="/dashboard">
            Cancel
          </Link>
        </Button>
        <SubmitButton formChanged={formChanged} />
      </footer>
    </form>
  );
}

export default UploadFilesForm;

const PdfSection = ({ pdfFileIds, onChange }: {
  pdfFileIds: string[];
  // sanityUser: TUserWithOptionalBusinessRef;
  onChange: (value: boolean) => void;
}) => {
  return (
    <section className="mx-auto my-24 flex flex-col items-start w-full px-12 gap-5">
      <label htmlFor="pdfs" className="font-semibold font-darker-grotesque self-center">
        Certificates or Supporting Documents (Optional) PDF Only
      </label>
      <PdfUpload
        onChange={onChange}
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

const SubmitButton = ({ formChanged }: {
  formChanged: boolean;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={!formChanged || pending} className="disabled:text-gray-400 disabled:bg-gray-300 w-fit font-bold font-darker-grotesque">
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}
