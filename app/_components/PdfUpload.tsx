"use client";
import { TPdfFileStore } from "@/app/_components/store/fileStore";
import { sanityClient, sanityWriteClient } from "@/sanity/lib/client";
// import { cn } from "@/utils";
// import Image from "next/image";
import { useReducer, type ChangeEvent, useEffect, useRef } from "react";
// import { FaTrashAlt } from "react-icons/fa";
import { TrashIcon } from "@sanity/icons";

const ALLOWED_FILE_TYPES = ["application/pdf"];

export function validateFileType(file: File) {
  return ALLOWED_FILE_TYPES.includes(file.type);
}

type TFileWithUrl = {
  _id: string;
  originalFilename?: string;
  url: string;
  size: number;
};

const addFilesToInput = (files: TFileWithUrl[]) => ({
  type: "ADD_FILES_TO_INPUT" as const,
  payload: files,
});
const replaceFilesInInput = (files: TFileWithUrl[]) => ({
  type: "REPLACE_FILES_IN_INPUT" as const,
  payload: files,
});

const removeFileFromInput = (fileId: string) => ({
  type: "REMOVE_FILE_FROM_INPUT" as const,
  payload: fileId,
});

type Action =
  | ReturnType<typeof addFilesToInput>
  | ReturnType<typeof removeFileFromInput>
  | ReturnType<typeof replaceFilesInInput>;

type State = TFileWithUrl[];
const fetchFileInfo = async (fileId: string) => {
  const query = `*[_id == "${fileId}"]{
    _id,
    originalFilename,
    url,
    size
  }[0]`;

  const fileInfo = await sanityClient.fetch(query);
  console.log({ fileInfo });

  
  return fileInfo || { _id: "", originalFilename: "", url: "", size: 0 };
};

const deleteFileFromSanity = async (fileId: string) => {
  try {
    await sanityWriteClient.delete(fileId);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to delete file:', error);
    // Don't throw the error, so the user won't see it
  }
};

const PdfUpload = ({
  useStore,
  onChange,
}: {
  useStore: () => TPdfFileStore;
  onChange?: (value: boolean) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFileId, removeFileId, fileIds } = useStore();
  // const defaultState: State = fileIds.map(id => ({
  //   id,
  //   name: '', // replace with actual name if available
  //   url: '', // replace with actual URL if available
  //   size: 0, // replace with actual size if available
  // }));
  const [input, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "ADD_FILES_TO_INPUT": {
        // do not allow more than 2 files to be uploaded at once
        if (state.length + action.payload.length > 10) {
          alert("Too many files");
          return state;
        }

        return [...state, ...action.payload];
      }
      case "REMOVE_FILE_FROM_INPUT": {
        // remove the specific file from the state
        return state.filter((file) => file._id !== action.payload);
      }
      case "REPLACE_FILES_IN_INPUT": {
        // replace the entire state with the new files
        return action.payload;
      }
      // You could extend this, for example to allow removing files
    }
  }, []);
  const noInput = input.length === 0;

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await Promise.all(fileIds.map(fetchFileInfo));
      // const newFiles = files.filter(
      //   fetchedFile => !input.some(inputFile => inputFile.id === fetchedFile.id)
      // );

      dispatch({ type: "REPLACE_FILES_IN_INPUT", payload: files });
    };

    fetchFiles();
  }, [fileIds]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      if (e.target.files) {
        const newFiles: TFileWithUrl[] = [];

        // loop over all selected files
        for (let i = 0; i < e.target.files.length; i++) {

          const file = e.target.files[i];

          if (!file.name) throw new Error("File name is missing");
          // validate file type
          const valid = validateFileType(file);
          if (!valid) {
            alert("invalid file type");
            return;
          }

          const sanityResp = await sanityWriteClient.assets.upload(
            "file",
            file,
            { filename: file.name }
          );

          if (!sanityResp) throw new Error("Error uploading file");

          const { _id } = sanityResp;
          addFileId(_id); // add the file ID to the store

          // add the file to the newFiles array
          newFiles.push({
            _id: _id,
            originalFilename: file.name || "something else",
            url: URL.createObjectURL(file),
            size: file.size,
          });
        }

        // dispatch the "ADD_FILES_TO_INPUT" action
        dispatch({ type: "ADD_FILES_TO_INPUT", payload: newFiles });

        console.log({newFiles, input})
        if (onChange) {
          onChange(true);
        }
      }
    } catch (error) {
      // handle error
      console.error(error);
      throw error;
    }
  };

  const handleRemove = async (fileId: string) => {
    // remove the file from the input
    dispatch({ type: "REMOVE_FILE_FROM_INPUT", payload: fileId });
    // remove the file ID from the store
    removeFileId(fileId);
    await deleteFileFromSanity(fileId);


  };

  const addFilesToState = (files: TFileWithUrl[]) => {
    dispatch({ type: "ADD_FILES_TO_INPUT", payload: files });
  };

  return (
    <>
      <button
        type="button"
        className="rounded-2xl w-fit mx-auto mt-2 bg-button-primary border border-button-border-color shadow-lg text-black px-5 py-1 text-lg"
        onClick={() => fileInputRef.current?.click()}
      >
        {input.length > 0 ? "Add more" : "Browse Files"}
      </button>
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
      {input.length > 0 && (

        <ul className="w-full mt-2 gap-2 flex flex-col">
          {input.filter(file => file.originalFilename !== "").map((file, index) => (
            <li key={`${file._id}-${index}`} className="flex w-full justify-between items-center">
              {file.originalFilename ? file.originalFilename : ""}
              <TrashIcon
                className="cursor-pointer w-5 h-fit"
                onClick={() => {
                  console.log("files left", input);
                  handleRemove(file._id)
                  if (input.length === 1 && onChange) {
                    onChange(false);
                  }
                }}
              />
            </li>
          ))}
        </ul>

      )}
    </>
  );
};

export default PdfUpload;
