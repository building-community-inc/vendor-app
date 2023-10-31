import { getSanityUser } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import BusinessInfoForm from "./_components/BusinessInfoForm";
import { getAllVendorCategories } from "@/sanity/queries/vendorCategories";

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return redirect("/sign-in");
  }

  const user = await getSanityUser(clerkUser.emailAddresses[0].emailAddress);

  const vendorCategories = await getAllVendorCategories();

  return (
    <main className="min-h-screen grid place-content-center">
      <header>
        <h1 className="uppercase text-center">Create Business Profile</h1>
      </header>
      <BusinessInfoForm user={user} vendorCategories={vendorCategories}/>
    </main>
  );
};

export default Page;
