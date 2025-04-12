"use server";
import { FormState } from "@/app/types";
import { z } from "zod";

export const saveMarketTablesUpdateAction = async (formState: FormState, formData: FormData): Promise<FormState> => {
  console.log("Saving market tables update action", { formState, formData });

  const vendorIds = formData.getAll("vendorId") as string[];
  const dates = formData.getAll("date") as string[];
  const oldTableIds = formData.getAll("oldTableId") as string[];
  const types = formData.getAll("type") as string[];
  const newTableIds = formData.getAll("newTableId") as string[];

  const changesToValidate = vendorIds.map((vendorId, index) => ({
    vendorId: vendorId,
    date: dates[index],
    oldTableId: oldTableIds[index],
    type: types[index],
    newTableId: types[index] === "update" ? newTableIds[index] : undefined, // Only include if type is update
  }));

  const {success, error, data: changes } = changesSchema.safeParse(changesToValidate);
  if (!success) {
    console.log("Form validation failed", { error });
    return {
      errors: error.errors.map(err => err.message),
      success: false,
    };
  };
  
  console.log({changes})

  // TODO prepare the patches array, with the patches for:

  // TODO PATCH market.vendors
  // TODO PATCH market.daysWithTables
  // TODO PATCH paymentRecords.items

  return {
    errors: ["not implemented yet"],
    success: false,
  }
};



const changeSchema = z.object({
  vendorId: z.string().min(1, "Vendor ID is required"),
  date: z.string().min(1, "Date is required"),
  oldTableId: z.string().min(1, "Old Table ID is required"),
  type: z.literal("update"),
  newTableId: z.string().min(1, "New Table ID is required"),
}).or(z.object({
  vendorId: z.string().min(1, "Vendor ID is required"),
  date: z.string().min(1, "Date is required"),
  oldTableId: z.string().min(1, "Old Table ID is required"),
  type: z.literal("delete"),
}));

const changesSchema = z.array(changeSchema).min(1, "At least one change is required");