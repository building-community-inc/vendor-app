"use client";

import FileInput from "@/app/_components/FileInput";
import { useUpdateProfileImageStore } from "@/app/_components/store/fileStore";
import { useEffect } from "react";
import { updateBusinessLogo } from "./actions";
import { useFormState } from "react-dom";

const UpdateProfileImage = ({ currentLogoId, businessName, logoUrl }: {
  currentLogoId?: string;
  logoUrl: string;
  businessName: string;
}) => {

  const { fileId, setFileId } = useUpdateProfileImageStore();

  const [state, formAction] = useFormState(updateBusinessLogo, {
    message: ""
  });

  useEffect(() => {

    if (!currentLogoId) return;

    setFileId(currentLogoId)
  }, [])

  if (!currentLogoId) return null;

  return (
    <form action={formAction} className="mx-auto mt-5 px-12 flex flex-col items-center gap-5">
      <FileInput useStore={useUpdateProfileImageStore} currentImage={{ name: businessName, size: 228, url: logoUrl, fileId: currentLogoId }} title="update your logo" />
      <span className="text-sm">* only upload .png </span>
      <input type="hidden" name="newLogoId" value={fileId} />
      {fileId !== currentLogoId && (
        <button type="submit">Save Changes</button>
      )}

      {state.message === "Success" && (
        <span className="text-green-500">Logo Updated Successfully!</span>
      )}
    </form>
  );
}

export default UpdateProfileImage;