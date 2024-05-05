"use server";

export const saveMarketChanges = async (
  formState: {
    success: boolean;
    error: string;
  },
  formData: FormData,
) => {
  console.log(formData)

  return {
    success: false,
    error: "q paso rick"
  }
}