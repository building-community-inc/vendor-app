"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
} from "valibot";

const CustomFileSchema = object({
  name: string(),
  size: number(),
  type: union([literal("image/png"), literal("application/pdf")]),
  lastModified: number(),
});

const dataValidator = object({
  logo: nullable(optional(CustomFileSchema)),
  pdfFiles: optional(array(CustomFileSchema)),
  businessId: string(),
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
  };

  const validatedData = safeParse(dataValidator, rawData);
  console.log({ validatedData, rawData });
  if (!validatedData.success) {
    const errors = validatedData.issues.map((error) => {
      return `${error.message} at ${error.path?.join(".")}`;
    });

    console.log({ issues: validatedData.issues });

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

    const updateBusinessResp = await sanityWriteClient
      .patch(validatedData.output.businessId)
      .set(newBusinessItems)
      .commit();

    revalidatePath("/dashboard", "layout");
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
