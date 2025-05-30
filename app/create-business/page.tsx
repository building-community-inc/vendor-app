import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BusinessInfoForm from "./_components/BusinessInfoForm";
import { getAllVendorCategories } from "@/sanity/queries/vendorCategories";

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return redirect("/sign-in");
  }

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (!user || user?.business) {
    return redirect("/dashboard");
  }

  const vendorCategories = await getAllVendorCategories();

  return (
    <main className="min-h-screen flex flex-col pt-14">
      <header>
        <h1 className="uppercase text-center font-darker-grotesque text-title-color text-3xl ">
          Create Business Profile
        </h1>
      </header>
      <BusinessInfoForm user={user} vendorCategories={vendorCategories} />
    </main>
  );
};

export default Page;
