import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { sanityZodMarketFormSchema } from "@/zod/markets";
import { currentUser } from "@clerk/nextjs";

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

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (!user) {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  if (user.role !== "admin") {
    return Response.json({
      status: 401,
      body: { message: "Unauthorized" },
    });
  }

  const body = await req.json();

  // console.log({daysW: body.daysWithTables[0]})
  const parsedMarket = sanityZodMarketFormSchema.safeParse(body);

  if (!parsedMarket.success) {
    return Response.json({
      status: 401,
      body: { error: parsedMarket.error.message },
    });
  }
  
  
  try {

    const response = await sanityWriteClient.create(parsedMarket.data);
    
    console.log({ response, here: true });
    console.log({ here: "true???" });
    
    return Response.json(response);
  } catch (error) {
    
    return Response.json({ status: 401, error });
  }

};
