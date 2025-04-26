import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminNavbar from "./_components/AdminNavbar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) return;
  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (sanityUser?.role !== "admin") return;

  return (
    <section className="flex bg-nav-bg text-nav-text h-screen overflow-y-hidden">
      <AdminNavbar />
      <div className="h-full overflow-y-scroll w-full hide-scrollbar pb-5">
        {children}
      </div>
    </section>
  );
};

export default DashboardLayout;
