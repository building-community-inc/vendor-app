"use client";
import { useFileStore } from "@/app/_components/store/fileStore";
import { sanityWriteClient } from "@/sanity/lib/client";
import { cn } from "@/utils";
import Image from "next/image";
import { useReducer, type ChangeEvent } from "react";
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

export function validateFileType(file: File) {
  return ALLOWED_FILE_TYPES.includes(file.type);
}

type TFileWithUrl = {
  name: string;
  url: string;
  size: number;
  error?: boolean | null;
};
const addFilesToInput = () => ({
  type: "ADD_FILES_TO_INPUT" as const,
  payload: [] as TFileWithUrl[],
});

type Action = ReturnType<typeof addFilesToInput>;
type State = TFileWithUrl[];

const FileInput = () => {
  const setFileId = useFileStore((state) => state.setFileId);
  const [input, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "ADD_FILES_TO_INPUT": {
        // do not allow more than 1 files to be uploaded at once
        if (state.length + action.payload.length > 2) {
          alert("Too many files");
          return state;
        }

        return [...state, ...action.payload];
      }

      // You could extend this, for example to allow removing files
    }
  }, []);
  const noInput = input.length === 0;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      if (e.target.files && e.target.files[0]) {
        // at least one file has been selected

        // validate file type
        const valid = validateFileType(e.target.files[0]);
        if (!valid) {
          alert("invalid file type");
          return;
        }

        const sanityResp = await sanityWriteClient.assets.upload(
          "image",
          e.target.files[0],
          { filename: e.target.files[0].name }
        );

        if (!sanityResp) throw new Error("Error uploading file");

        const { url, _id } = sanityResp;

        const { name, size } = e.target.files[0];
        addFilesToState([{ name, url, size }]);

        setFileId(_id);
      }
    } catch (error) {}
  };
  const addFilesToState = (files: TFileWithUrl[]) => {
    dispatch({ type: "ADD_FILES_TO_INPUT", payload: files });
  };

  return (
    <>
      {input.length > 0 ? (
        input.map((file) => (
          <Image
            key={file.url}
            src={file.url}
            alt={file.name}
            width={100}
            height={100}
            className="object-cover mx-auto mt-2"
          />
        ))
      ) : (
        <label
          htmlFor={"file"}
          className={cn(
            "group relative p-2 w-fit flex flex-col items-center justify-center border-2 border-slate-300 border-dashed rounded-lg dark:border-gray-600 transition",
            // { "dark:border-slate-400 dark:bg-slate-800": dragActive },
            { "h-fit aspect-auto": !noInput },
            { "items-start justify-start": !noInput },
            { "dark:hover:border-gray-500 dark:hover:bg-slate-800": noInput }
          )}
        >
          <input
            // {...props}
            // ref={ref}
            // multiple
            onChange={handleChange}
            accept="image/jpeg, image/jpg, image/png"
            id="file"
            type="file"
            className="hidden"
          />
          upload your logo
        </label>
      )}
    </>
  );
};

export default FileInput;
