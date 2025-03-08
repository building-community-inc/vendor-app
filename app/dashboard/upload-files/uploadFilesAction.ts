"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import {
  safeParse,
  object,
  array,
  string,
  number,
  optional,
  literal,
  union,
  nullable,
  pipe,
  maxLength,
  maxValue,
} from "valibot";

const CustomFileSchema = object({
  name: string(),
  size: pipe(number(), maxValue(2 * 1024 * 1024, "Max File size is 2MB")),
  type: union([literal("image/png"), literal("application/pdf")]),
  lastModified: number(),
});

// type TFileWithMetadata = File & {
//   name: string; // Extend with any additional metadata as needed
// }

const dataValidator = object({
  logo: nullable(optional(CustomFileSchema)),
  pdfFiles: optional(
    pipe(
      array(CustomFileSchema),
      maxLength(5, "You cannot upload more than 5 files") // Max 5 files
    )
  ),
  businessId: string(),
  removedSanityIds: nullable(optional(array(string()))),
});

export const uploadFiles = async (
  formState: { errors: string[] | null; success: boolean },
  formData: FormData
) => {
  const pdfFiles = formData.getAll("pdfFiles") as File[];
  const logo = formData.get("logo") as File;

  const rawData = {
    pdfFiles,
    logo,
    businessId: formData.get("businessId"),
    removedSanityIds: formData.getAll("removedSanityIds"),
  };

  const validatedData = safeParse(dataValidator, rawData);

  if (!validatedData.success) {
    const errors = validatedData.issues.map((error) => {
      let fileName = "";

      // Assuming the second element in the error path array contains the index of the file in the array
      const fileIndex = error.path?.[1]?.key;
      if (typeof fileIndex === "number") {
        // Assuming 'firstValue' is an array of files and contains the file object at the index specified by the error
        const file = error.path && (error.path[0].value as File[])[fileIndex];

        fileName = file ? file.name : "Unknown File";
      }

      if (error.path?.[0]?.key === "logo") {  
        fileName = "Logo";
      }
      return `${error.message} for file ${fileName}`;
    });

    return {
      errors,
      success: false,
    };
  }

  try {
    const newBusinessItems: {
      logo?: {
        _type: "image";
        asset: {
          _type: "reference";
          _ref: string;
        };
      };
      pdf: {
        _key: string;
        _type: "file";
        asset: {
          _type: "reference";
          _ref: string;
        };
      }[];
    } = {
      pdf: [],
    };

    if (validatedData.output.logo) {
      const logoResp = await sanityWriteClient.assets.upload("image", logo, {
        filename: logo.name,
      });

      newBusinessItems.logo = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: logoResp._id,
        },
      };
    }

    if (validatedData.output.pdfFiles) {
      for (const file of pdfFiles) {
        const pdfResp = await sanityWriteClient.assets.upload("file", file, {
          filename: file.name,
        });

        newBusinessItems.pdf?.push({
          _key: nanoid(),
          _type: "file",
          asset: {
            _type: "reference",
            _ref: pdfResp._id,
          },
        });
      }
    }

    if (validatedData.output.removedSanityIds) {
      for (const id of validatedData.output.removedSanityIds) {
        await sanityWriteClient.delete(id);
      }
    }

    const updateBusinessResp = await sanityWriteClient
      .patch(validatedData.output.businessId)
      .set(newBusinessItems)
      .commit();

    revalidatePath("/dashboard", "layout");
    revalidatePath("/admin/dashboard", "layout");
    // redirect("/dashboard");

    return {
      errors: null,
      success: true,
    };
  } catch (error) {
    console.error("Error uploading files", error);
    return {
      errors: ["Error uploading files"],
      success: false,
    };
  }
};
