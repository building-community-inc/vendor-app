import { sanityClient } from "@/sanity/lib/client";
import { zodUserWithOptionalBusinessInfo } from "@/zod/types";



export const getSanityUser = async (email: string) => {
    const user = await sanityClient.fetch(`*[_type == 'user' && email == '${email}'][0]`);

    const validatedUser = zodUserWithOptionalBusinessInfo.safeParse(user);
    console.log({user, validatedUser})
    if (!validatedUser.success) {
        throw new Error(validatedUser.error.message);
    }

    return validatedUser.data;
}