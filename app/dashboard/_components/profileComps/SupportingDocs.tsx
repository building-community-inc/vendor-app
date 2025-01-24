"use client";

import { TPdf } from "@/zod/user-business";
import { DashboardSection } from ".";
import { FaRegFilePdf } from "react-icons/fa";

export const SupportingDocsCard = ({
  pdfs
}: {
  pdfs: TPdf[];
}) => {

  const handleDownload = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardSection className="py-5 px-3 flex flex-col gap-5">
      <header>
        <h3 className="text-xl font-segoe font-bold text-black">Supporting Documents:</h3>
        <span>(click document to open)</span>
      </header>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf._id} className="flex items-center justify-between">
            <button onClick={() => handleDownload(pdf.url, pdf.originalFileName)} className="font-segoe flex items-center">
              <FaRegFilePdf className="text-2xl" />
              <span>
                {pdf.originalFileName}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}
