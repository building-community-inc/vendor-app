"use client"

import Button from "@/app/_components/Button";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import UploadPdf from "./UploadPdf";
import { uploadFiles } from "./uploadFilesAction";
import ChangeLogo from "./ChangeLogo";
import { redirect } from "next/navigation";

const UploadFilesForm = ({
  businessName,
  logoUrl,
  businessId,
}: {
  businessId: string;
  businessName: string;
  logoUrl?: string | null;
  assetRef?: string;
}) => {
  const [formState, formAction] = useFormState(uploadFiles, { errors: [], success: false })

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [pendingForm, setPendingForm] = useState(false);

  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    setPendingForm(false);
    if (formState.success) {
      redirect("/dashboard");
    }
  }, [formState]);

  // const [startTime, setStartTime] = useState<number | null>(null);

  // useEffect(() => {
  //   if (formState.success && startTime) {
  //     const endTime = performance.now();
  //     const duration = endTime - startTime;
  //     console.log(`Form submission took ${duration} milliseconds`);
  //     setStartTime(null); // Reset startTime for the next submission
  //   }
  // }, [formState.success, startTime]);

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

        formData.append("businessId", businessId);

        formAction(formData);
        setPendingForm(true);
      }}
      className="flex flex-col gap-5 max-w-[400px] mx-auto mt-10"
    >
      <ChangeLogo onChange={(value) => setFormChanged(value)} logoFile={logoFile} setLogoFile={setLogoFile} defaultLogoUrl={logoUrl} defaultFileName={businessName} />
      <UploadPdf files={pdfFiles} setFiles={setPdfFiles} onChange={(value) => setFormChanged(value)} />

      {formState.errors && formState.errors.map((error) => (
        <p className="text-red-500 self-center" key={error}>{JSON.stringify(error)}</p>
      ))}

      {formState.success && (
        <p className="text-green-500 self-center">Files uploaded successfully</p>
      )}

      <footer className="flex w-full justify-evenly">
        <Button type="button" className="w-fit font-bold font-darker-grotesque">
          <Link href="/dashboard">
            {"Cancel"}
          </Link>
        </Button>
        <SubmitButton pending={pendingForm} formChanged={formChanged} />
      </footer>

    </form>
  );
}

export default UploadFilesForm;

const SubmitButton = ({ formChanged, pending }: {
  formChanged: boolean;
  pending: boolean;
}) => {
  // const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={!formChanged || pending} className="disabled:text-gray-400 disabled:bg-gray-300 w-fit font-bold font-darker-grotesque">
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}
