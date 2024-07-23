"use client"

import Button from "@/app/_components/Button";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import UploadPdf from "./UploadPdf";
import { uploadFiles } from "./uploadFilesAction";
import ChangeLogo from "./ChangeLogo";
import { redirect } from "next/navigation";
import { TPdf } from "@/zod/user-business";
const urlToFile = async (url: string, filename: string, mimeType: string, sanityId: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: mimeType });

  // if (sanityId) {
  // Option 1: Using Object.defineProperty to add a non-enumerable property
  Object.defineProperty(file, 'sanityId', {
    value: sanityId,
    enumerable: false // This makes sure the property does not show up in a for...in loop
  });

  // Option 2: Alternatively, return an object that includes both the file and the sanityId
  // return { file, sanityId };
  // }

  return file;
};

const UploadFilesForm = ({
  businessName,
  logoUrl,
  businessId,
  pdfs,
  logoId
}: {
  businessId: string;
  businessName: string;
  logoUrl?: string | null;
  pdfs?: TPdf[] | null;
  logoId?: string | null;
}) => {
  const [formState, formAction] = useFormState(uploadFiles, { errors: [], success: false })

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [removedFileSanityIds, setRemovedFileSanityIds] = useState<string[]>([]);

  const [pendingForm, setPendingForm] = useState(false);

  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    // Convert pdfs to File objects
    if (pdfs) {
      Promise.all(pdfs.map((pdf) => urlToFile(pdf.url, `${pdf.originalFileName}`, 'application/pdf', pdf._id)))
        .then(setPdfFiles);
    }
  }, []);

  useEffect(() => {
    setPendingForm(false);
    if (formState.success) {
      redirect("/dashboard");
    }
  }, [formState]);

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

        removedFileSanityIds.forEach(id => formData.append("removedFileSanityIds", id));

        formAction(formData);
        setPendingForm(true);
      }}
      className="flex flex-col gap-5 max-w-[400px] mx-auto mt-10"
    >
      <ChangeLogo
        onChange={(value) => setFormChanged(value)}
        logoFile={logoFile}
        setLogoFile={setLogoFile}
        defaultLogoUrl={logoUrl}
        defaultFileName={businessName}
        setRemovedSanityIds={setRemovedFileSanityIds}
        removedSanityIds={removedFileSanityIds}
        defaultLogoId={logoId}
      />
      <UploadPdf
        removedIds={removedFileSanityIds}
        setRemovedFileSanityIds={setRemovedFileSanityIds}
        files={pdfFiles} setFiles={setPdfFiles}
        onChange={(value) => setFormChanged(value)}
      />

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
