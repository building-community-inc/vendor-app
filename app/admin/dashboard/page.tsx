import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/sign-in");


  if (sanityUser.role !== "admin") redirect("/dashboard");



  return (
    <main className="grid place-content-center gap-2 min-h-screen w-full bg-indigo-900">
      <h2>Welcome Admin {sanityUser.firstName}</h2>
    </main>
  );
};

export default page;
