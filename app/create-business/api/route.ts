import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { zodBusinessQuery } from "@/zod/types";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

  if (req.method !== "POST") {
    return {
      status: 405,
      body: { message: "Method not allowed" },
    };
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return {
      status: 401,
      body: { message: "Unauthorized" },
    };
  }

  const user = await getSanityUserByEmail(clerkUser.emailAddresses[0].emailAddress);

  if (!user) {
    return {
      status: 401,
      body: { message: "Unauthorized" },
    };
  }

  const body = await req.json();

  const parsedBusinesObj = zodBusinessQuery.safeParse(body);

    if (!parsedBusinesObj.success) {
      throw new Error(parsedBusinesObj.error.message);
    }
    const {url} = req;

    // console.log({url: url.split("/api")[0] });
    await sanityWriteClient
      .create(parsedBusinesObj.data)
      .then(async (res) => {
        await sanityWriteClient
          .patch(user._id)
          .set({ business: { _ref: res._id } })
          .commit()
          .then(() => {
            console.log("redirecting to terms");
            return NextResponse.redirect(url.split("/api")[0] + "/terms");
          });
      })
      .catch((err) => {
        throw new Error(err);
      });

      return NextResponse.redirect(url.split("/api")[0] + "/terms");
}