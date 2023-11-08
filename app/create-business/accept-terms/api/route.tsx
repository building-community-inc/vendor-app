import { sanityWriteClient } from "@/sanity/lib/client";
import { z } from "zod";

const zodRequestBody = z.object({
  _id: z.string().min(1, { message: "No User Detected" }),
  acceptedTerms: z.object({
    accepted: z.literal(true, {
      errorMap: () => ({ message: "Terms and conditions not accepted!" }),
    }),
  }),
});

export const POST = async (req: Request) => {

  if (req.method !== "POST") {
    return Response.json({
      status: 405,
      body: { message: "Method not allowed" },
    });
  }

  const body = await req.json();

  const parsedBody = zodRequestBody.safeParse(body);

  if (!parsedBody.success) {
    return Response.json({
      status: 400,
      body: parsedBody.error,
    });
  }

  const dateAccepted = new Date().toISOString();

  let response;

  await sanityWriteClient.patch(parsedBody.data._id).set({
    acceptedTerms: {
      accepted: true,
      dateAccepted,
    },
  }).commit().then((res) => {
    response = res;
    return Response.json(res);
  }).catch((err) => {
    throw new Error(err);
  });

  return Response.json(response);
};
