import { sanityClient } from "@/sanity/lib/client";
import { zodUserWithOptionalBusinessRef } from "@/zod/user-business";



export const getSanityUserByEmail = async (email: string) => {
    const user = await sanityClient.fetch(`*[_type == 'user' && email == '${email}'][0]{
        _id,
        _type,
        email,
        firstName,
        lastName,
        hasImage,
        image,
        role,
        business->{
            _id,
            _type,
            businessName,
            address1,
            address2,
            city,
            province,
            postalCode,
            country,
            phone,
            instagramHandle,
            industry,
            "logoUrl": logo.asset->url,
            "pdfUrl": pdf.asset->url,
        }
    }`);
    const validatedUser = zodUserWithOptionalBusinessRef.safeParse(user);
    if (!validatedUser.success) {
        throw new Error(validatedUser.error.message);
    }

    return validatedUser.data;

}