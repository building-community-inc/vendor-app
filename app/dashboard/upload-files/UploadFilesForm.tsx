"use client"

import Button from "@/app/_components/Button";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import UploadPdf from "./UploadPdf";
import { uploadFiles } from "./uploadFilesAction";
import ChangeLogo from "./ChangeLogo";

const UploadFilesForm = ({
  businessName,
  logoUrl,
  assetRef,
}: {
  businessName: string;
  logoUrl?: string | null;
  assetRef?: string;
}) => {
  const [formState, formAction] = useFormState(uploadFiles, { errors: [], success: false })

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formChanged, setFormChanged] = useState(false);
  return (
    <form
      action={formAction}
      onSubmit={e => {
        e.preventDefault()
        const formData = new FormData();
        pdfFiles.forEach(file => {
          formData.append("pdfFiles", file)
        })
        if (logoFile) {
          formData.append("logo", logoFile)
        }

        formAction(formData);
      }}
      className="flex flex-col gap-5 max-w-[400px] mx-auto mt-10"
    >
      {/* <UpdateProfileImage businessName={businessName} logoUrl={logoUrl || ""} currentLogoId={assetRef} /> */}
      <ChangeLogo onChange={(value) => setFormChanged(value)} logoFile={logoFile} setLogoFile={setLogoFile} defaultLogoUrl={logoUrl} defaultFileName={businessName} />
      {/* <PdfSection pdfFileIds={pdfFileIds} onChange={(value) => setFormChanged(value)} /> */}
      <UploadPdf files={pdfFiles} setFiles={setPdfFiles} onChange={(value) => setFormChanged(value)} />
      {formState.errors && formState.errors.map((error) => (
        <p className="text-red-500 self-center" key={error}>{JSON.stringify(error)}</p>
      ))}
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
