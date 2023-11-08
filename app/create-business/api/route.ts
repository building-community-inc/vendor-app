import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { zodBusinessQuery } from "@/zod/types";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

  if (req.method !== "POST") {
    return Response.json({
      status: 405,
      body: { message: "Method not allowed" },
    });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  const user = await getSanityUserByEmail(clerkUser.emailAddresses[0].emailAddress);

  if (!user) {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  const body = await req.json();
  let response;
  const parsedBusinesObj = zodBusinessQuery.safeParse(body);

    if (!parsedBusinesObj.success) {
      throw new Error(parsedBusinesObj.error.message);
    }

    await sanityWriteClient
      .create(parsedBusinesObj.data)
      .then(async (res) => {
        await sanityWriteClient
          .patch(user._id)
          .set({ business: { _ref: res._id } })
          .commit()
          .then((res1) => {
            response = res1
            return Response.json(res1);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });

      return Response.json(response);
}