import { getSanityUserByEmail } from "@/sanity/queries/user";
import { SignOutButton, UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(user.emailAddresses[0].emailAddress);

  console.log({ sanityUser });

  
  
  return (
    <main className="grid place-content-center gap-2 min-h-screen">
      <div className="flex items-center gap-2">
        <UserButton afterSignOutUrl="/" />
        <h2>Welcome back {user.firstName}!</h2>
        <SignOutButton />
      </div>
    </main>
  );
};

export default page;
