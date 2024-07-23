"use server";
export const uploadFiles = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const rawFormData = Object.fromEntries(formData);

  
  const files = formData.getAll("files");
  
  console.log({ files, rawFormData });
  return {
    errors: ["Not implemented"],
    success: false,
  }
}