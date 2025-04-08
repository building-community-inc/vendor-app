import { currentUser } from "@clerk/nextjs/server";
import UploadFilesForm from "./UploadFilesForm";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");

  if (!sanityUser.business) redirect("/dashboard/create-business");

  return (
    <main className="flex p-10 gap-2 min-h-screen w-full flex-col justify-center">
      <h1 className="font-darker-grotesque uppercase text-title-color font-bold self-center">Uploads</h1>

      <UploadFilesForm
        businessName={sanityUser.business.businessName}
        // assetRef={sanityUser.business.logo?.asset._ref}
        businessId={sanityUser.business._id}
        logoUrl={sanityUser.business.logoUrl}
        pdfs={sanityUser.business.pdfs}
        logoId={sanityUser.business.logo?.asset._ref}
      />
    </main>
  );
}

export default Page;