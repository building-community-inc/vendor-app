import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const page = async () => {
  unstable_noStore()
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/sign-in");


  if (sanityUser.role !== "admin") redirect("/dashboard");



  return (
    <main className="grid place-content-center gap-2 min-h-screen w-full">
      <h1 className="text-lg font-bold">Welcome Admin {sanityUser.firstName}</h1>
    </main>
  );
};

export default page;
