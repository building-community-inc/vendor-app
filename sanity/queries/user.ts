import { sanityClient } from "@/sanity/lib/client";
import { zodUserWithOptionalBusinessRef } from "@/zod/types";



export const getSanityUser = async (email: string) => {
    const user = await sanityClient.fetch(`*[_type == 'user' && email == '${email}'][0]`);

    // const validatedUser = zodUserWithOptionalBusinessRef.safeParse(user);
    // if (!validatedUser.success) {
    //     throw new Error(validatedUser.error.message);
    // }

    // return validatedUser.data;

    if (!user) {
        throw new Error(`No user found with email ${email}`);
    }

    return user;
}