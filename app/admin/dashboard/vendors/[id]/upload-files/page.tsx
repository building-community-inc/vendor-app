import UploadFilesForm from "@/app/dashboard/upload-files/UploadFilesForm";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const Page = async (
  props: {
    params: Promise<{
      id: string;
    }>
  }
) => {
  const params = await props.params;

  unstable_noStore();

  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");


  const vendorEmail = params.id.replace("-at-", "@").replaceAll("-dot-", ".");

  const vendor = await getSanityUserByEmail(vendorEmail);

  if (!vendor || !vendor.business) {
    return (
      <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
        <h1 className="font-segoe font-bold text-3xl">Vendor not found</h1>
      </main>
    );
  }


  return (
    <main className="flex p-10 gap-2 min-h-screen w-full flex-col justify-center">
      <h1 className="font-darker-grotesque uppercase text-title-color font-bold self-center">Uploads</h1>

      <UploadFilesForm
        businessName={vendor.business.businessName}
        // assetRef={vendor.business.logo?.asset._ref}
        businessId={vendor.business._id}
        logoUrl={vendor.business.logoUrl}
        pdfs={vendor.business.pdfs}
        logoId={vendor.business.logo?.asset._ref}
        redirectPath={`/admin/dashboard/vendors/${vendor._id}`}
      />
    </main>
  );
}

export default Page;