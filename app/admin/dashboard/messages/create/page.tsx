import FormTitleDivider from "../../_components/FormTitleDivider";
import { currentUser } from "@clerk/nextjs";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { getAllVendors } from "@/sanity/queries/admin/vendors";
import CreateMessageForm from "./_components/CreateMessageForm";

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (sanityUser.role !== "admin") {
    return null;
  }

  const allVendors = await getAllVendors();

  return (
    <main className="pt-14 px-5 w-full min-h-screen mx-auto">
      <header className="flex w-full justify-between">
        <h1 className="font-segoe font-bold text-lg lg:text-3xl">Create Message</h1>
      </header>
      <FormTitleDivider title="Compose Message" />
      <CreateMessageForm sanityUser={sanityUser} allVendors={allVendors || []} />
    </main>
  );
}

export default Page;

