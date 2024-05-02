import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import EditProfileForm from "./_components/EditProfileForm";
import { getAllVendorCategories } from "@/sanity/queries/vendorCategories";

const Page = async () => {
  const user = await currentUser();
  
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");

  if (!sanityUser.business) redirect("/dashboard/create-business");
  const vendorCategories = await getAllVendorCategories();

  
  return (
    <main className="pt-10">
      <h1 className="text-center font-semibold text-lg">Edit Your Profile Info</h1>
      <EditProfileForm sanityUser={sanityUser} vendorCategories={vendorCategories} />
    </main>
  );
}

export default Page;