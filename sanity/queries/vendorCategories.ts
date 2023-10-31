import { sanityClient } from "../lib/client";

export const getAllVendorCategories = async () => {
  try {
    const res = sanityClient.fetch(`*[_type == "vendorCategory"] | order(name asc) {
        name
      }
    `);
    return res;
  } catch (err) {
    console.error(err);
  }
};
