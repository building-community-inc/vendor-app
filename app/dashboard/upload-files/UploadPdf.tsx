import Button from "@/app/_components/Button";
import { TrashIcon } from "@sanity/icons";
import { ChangeEvent, useRef } from "react";

const UploadPdf = ({ files, setFiles, onChange }: {
  files: File[];
  setFiles: (files: File[]) => void;
  onChange: (value: boolean) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {

      const newFiles: File[] = [...files];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        newFiles.push(file);
      }
      setFiles([...newFiles]);

      if (newFiles.length > 0) {
        onChange(true);
      }
    }

  }

  return (
    <section className="mx-auto my-24 flex flex-col items-start w-full px-12 gap-5">
      <label htmlFor="pdfs" className="font-semibold font-darker-grotesque self-center">
        Certificates or Supporting Documents (Optional) PDF Only
      </label>

      <input
        // {...props}
        ref={fileInputRef}
        multiple
        onChange={handleChange}
        accept=".pdf"
        id="pdfFile"
        type="file"
        className="hidden"
      />
      <ul className="w-full">
        {files.map((file, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>

              File Name: {file.name}
            </span>
            <TrashIcon
              onClick={() => {
                const newFiles = files.filter((_, i) => i !== index);
                setFiles(newFiles);
                if (newFiles.length === 0) {
                  onChange(false);
                }
              }}
              className="cursor-pointer w-5 h-fit"
            />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        className="font-darker-grotesque font-semibold self-center"
        onClick={() => fileInputRef.current?.click()}
      >
        {files.length > 0 ? "Add more" : "Browse Files"}
      </Button>
    </section>
  );
}

export default UploadPdf;