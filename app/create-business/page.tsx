import { getSanityUser } from "@/utils/user";
import { zodBusinessInfo } from "@/zod/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import BusinessInfoForm from "./_components/BusinessInfoForm";

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return redirect("/sign-in");
  }

  const user = await getSanityUser(clerkUser.emailAddresses[0].emailAddress);

  return (
    <main className="min-h-screen grid place-content-center">
      <header>
        <h1 className="uppercase text-center">Create Business Profile</h1>
      </header>
      <BusinessInfoForm user={user} />
    </main>
  );
};

export default Page;
