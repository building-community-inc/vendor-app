import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

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
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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
              <div className="text-center uppercase font-bold text-xl" key={option.href}>
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
      </aside>
      {children}
    </section>
  );
};

export default DashboardLayout;
