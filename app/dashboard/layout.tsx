import { getSanityUserByEmail } from "@/sanity/queries/user";
import { SignOutButton, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import VendorNavBar from "./_components/VendorNavBar";

const navOptions = [
  {
    title: "My Profile",
    href: "/dashboard",
  },
  {
    title: "Exlore Markets",
    href: "/dashboard/explore",
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
  },
  {
    title: "Logout",
    href: "/dashboard/logout",
  },
];
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  return (
    <section className="flex  h-screen overflow-y-hidden">
      <VendorNavBar user={sanityUser} />
      <div className="h-full overflow-y-scroll w-full hide-scrollbar pb-5">
        {children}
      </div>
    </section>
  );
};

export default DashboardLayout;
