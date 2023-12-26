import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NavBar from "./_components/NavBar";


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  return (
    <section className="flex  h-screen overflow-y-hidden">
      <NavBar user={sanityUser} />

      <div className="h-full overflow-y-scroll w-full hide-scrollbar pb-5">
        {children}
      </div>
    </section>
  );
};

export default DashboardLayout;
