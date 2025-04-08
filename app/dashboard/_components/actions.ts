"use server";

import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type FormState = {
  message: string;
};

export const updateBusinessLogo = async (
  prevState: FormState,
  data: FormData
): Promise<FormState> => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return {
      message: "Unauthorized",
    };
  }

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (!user) {
    return {
      message: "Unauthorized",
    };
  }

  if (!user.business) {
    return {
      message: "Unauthorized",
    };
  }

  if (!user.business.logo) {
    return {
      message: "Unauthorized",
    };
  }

  const newfileId = data.get("newLogoId");

  const newLogoAsset = {
    ...user.business.logo.asset,
    _ref: newfileId,
  };

  const sanityRes = await sanityWriteClient
    .patch(user.business._id)
    .set({ logo: { asset: newLogoAsset, _type: "image" } })
    .commit()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err);
    });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/admin/dashboard", "layout");

  return {
    message: "Success",
  };
};
