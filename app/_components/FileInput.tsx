"use client";
import { TFileStore } from "@/app/_components/store/fileStore";
import { sanityWriteClient } from "@/sanity/lib/client";
import { cn } from "@/utils";
import Image from "next/image";
import { useReducer, type ChangeEvent, useState } from "react";
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

const removeLastFileFromInput = () => ({
  type: "REMOVE_LAST_FILE_FROM_INPUT" as const,
});

type Action = ReturnType<
  typeof addFilesToInput | typeof removeLastFileFromInput
>;
type State = TFileWithUrl[];

const FileInput = ({
  useStore,
  title,
  classNames,
}: {
  useStore: () => TFileStore;
  title: string;
  classNames?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const { setFileId } = useStore();
  const [input, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "ADD_FILES_TO_INPUT": {
        // do not allow more than 1 files to be uploaded at once
        if (state.length + action.payload.length > 10) {
          alert("Too many files");
          return state;
        }

        return [...state, ...action.payload];
      }
      case "REMOVE_LAST_FILE_FROM_INPUT":
        return state.slice(0, -1);
      // You could extend this, for example to allow removing files
    }
  }, []);
  const noInput = input.length === 0;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      if (e.target.files && e.target.files[0]) {
        setUploading(true);
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
        // console.log("sanityResp", sanityResp);
        setFileId(_id);
        setUploading(false);
      }
    } catch (error) {}
  };
  const addFilesToState = (files: TFileWithUrl[]) => {
    dispatch({ type: "ADD_FILES_TO_INPUT", payload: files });
  };
  const revertLogo = () => {
    dispatch({ type: "REMOVE_LAST_FILE_FROM_INPUT" });
  };
  return (
    <div>
      {input.length > 0 && (
        <Image
          key={input[input.length - 1].url}
          src={input[input.length - 1].url}
          alt={input[input.length - 1].name}
          width={500}
          height={500}
          className="object-cover mx-auto mt-2"
        />
      )}
      <div className={cn("",
        {"mt-5" : input.length > 0},
        {"flex" : input.length > 1}
      )}>
        <label
          htmlFor={"file"}
          className={
            classNames
              ? classNames
              : cn(
                  "group relative p-2 w-fit flex flex-col mx-auto items-center justify-center border-2 border-slate-300 border-dashed rounded-lg dark:border-gray-600 transition",
                  { "h-fit aspect-auto": !noInput },
                  { "items-start justify-start": !noInput },
                  {
                    "hover:border-gray-500 hover:bg-slate-800 hover:text-white":
                      noInput,
                  },
                  { "opacity-50": uploading }
                )
          }
        >
          <input
            onChange={handleChange}
            accept="image/jpeg, image/jpg, image/png"
            id="file"
            type="file"
            className="hidden"
          />
          {uploading ? "Uploading" : input.length > 0 ? "Change Logo" : title}
        </label>
        {input.length > 1 && (
          <button
            onClick={revertLogo}
            className={
              classNames
                ? classNames
                : cn(
                    "group relative p-2 w-fit flex flex-col mx-auto items-center justify-center border-2 border-slate-300 border-dashed rounded-lg dark:border-gray-600 transition",
                    { "h-fit aspect-auto": !noInput },
                    { "items-start justify-start": !noInput },
                    {
                      "hover:border-gray-500 hover:bg-slate-800 hover:text-white":
                        noInput,
                    },
                    { "opacity-50": uploading }
                  )
            }
          >
            Revert Logo
          </button>
        )}
      </div>
    </div>
  );
};

export default FileInput;
