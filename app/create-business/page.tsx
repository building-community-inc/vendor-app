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
    <main className="min-h-screen">
      <h1>Create Your Business</h1>
      <p>Hi {user.firstName}</p>
      <p>Welcome to your Vendor App</p>
      <p>please provide your business information below</p>
      <BusinessInfoForm user={user} />
    </main>
  );
}

export default Page;