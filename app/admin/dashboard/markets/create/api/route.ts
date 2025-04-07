// import { stripe } from '@/stripe/';
import { sanityWriteClient } from "@/sanity/lib/client";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { sanityZodMarketFormSchema } from "@/zod/markets";
import { currentUser } from "@clerk/nextjs/server";

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

  const parsedMarket = sanityZodMarketFormSchema.safeParse(body);

  if (!parsedMarket.success) {
    return Response.json({
      status: 401,
      body: { error: parsedMarket.error.message },
    });
  }
  
  
  try {

    const response = await sanityWriteClient.create(parsedMarket.data);
    

    // const stripeProduct = await stripe.products.create({
    //   name: parsedMarket.data.name,
    //   default_price_data: {
    //     currency: "cad",
    //     // unit_amount: parsedMarket.data.price * 100,

    //   }
      
    // }) 




    return Response.json(response);
  } catch (error) {
    
    return Response.json({ status: 401, error });
  }

};
