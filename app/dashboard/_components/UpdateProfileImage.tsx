"use client";

import FileInput from "@/app/_components/FileInput";
import { useUpdateProfileImageStore } from "@/app/_components/store/fileStore";
import { useEffect } from "react";

const UpdateProfileImage = ({ currentLogoId, businessName, logoUrl }: {
  currentLogoId?: string;
  logoUrl: string;
  businessName: string;
}) => {

  const { setFileId } = useUpdateProfileImageStore();

  useEffect(() => {
    if (!currentLogoId) return;
    setFileId(currentLogoId)
  }, [])

  // if (!currentLogoId) return null;

  return (
    <section className="mx-auto mt-5 px-12 flex flex-col items-center gap-5">
      <span className="text-2xl font-darker-grotesque">Logo (PNG Only) </span>
      <FileInput useStore={useUpdateProfileImageStore} currentImage={{ name: businessName, size: 228, url: logoUrl, fileId: currentLogoId }} title="update your logo" />
    </section>
  );
}

export default UpdateProfileImage;