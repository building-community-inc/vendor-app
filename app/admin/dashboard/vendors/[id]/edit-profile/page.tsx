import EditProfileForm from "@/app/dashboard/edit-profile/_components/EditProfileForm";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { getAllVendorCategories } from "@/sanity/queries/vendorCategories";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const Page = async ({ params }: {
  params: {
    id: string;
  }
}) => {

  unstable_noStore();

  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");


  const vendorEmail = params.id.replace("-at-", "@").replaceAll("-dot-", ".");

  const vendor = await getSanityUserByEmail(vendorEmail);

  if (!vendor) {
    return (
      <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
        <h1 className="font-segoe font-bold text-3xl">Vendor not found</h1>
      </main>
    );
  }

  const vendorCategories = await getAllVendorCategories();

  return (
    <div>
      <EditProfileForm sanityUser={vendor} vendorCategories={vendorCategories} redirectPath={`/admin/dashboard/vendors/${vendor._id}`} />
    </div>
  );
}

export default Page;