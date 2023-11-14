import { getSanityUserByEmail } from "@/sanity/queries/user";
import { SignOutButton, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <section className="flex">
      <aside className="bg-nav-bg text-nav-text px-10 flex flex-col py-[10px] gap-[45px]">
        <Link href="/">
          <Image
            src={"/logo-on-white-bg.png"}
            alt="logo"
            width={468}
            height={468}
          />
        </Link>

        {navOptions.map((option) => (
          <>
            {option.title === "Logout" ? (
              <div className="text-center uppercase font-bold text-xl">
                <SignOutButton key={option.href} />
              </div>
            ) : (
              <Link
                href={option.href}
                key={option.title}
                className="text-center uppercase font-bold text-xl"
              >
                {option.title}
              </Link>
            )}
          </>
        ))}
        {sanityUser.role === "admin" && (
          <Link href="/admin/dashboard" className="text-center font-bold text-xl">
            View Admin
          </Link>
        
        )}
      </aside>
      {children}
    </section>
  );
};

export default DashboardLayout;
