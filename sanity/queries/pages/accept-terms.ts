import { sanityClient } from "@/sanity/lib/client"


export const getAcceptTermsContent = async () => {
  const data = await sanityClient.fetch(`*[_type == 'terms'][0]`);

  if (!data) {
    throw new Error(`No terms found`);
  }
  return data;
}