import { getSanityUserByEmail } from "@/sanity/queries/user";
import { SignOutButton, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const navOptions = [
  {
    title: "Home",
    href: "/admin/dashboard",
  },
  {
    title: "Markets",
    href: "/admin/dashboard/markets",
    links: [
      {
        title: "Create New Market",
        href: "/admin/dashboard/markets/create",
      },
      {
        title: "Market Monitoring",
        href: "/admin/dashboard/markets/manage",
      },
    ],
  },
  {
    title: "Vendors",
    href: "/admin/dashboard/vendors",
    links: [
      {
        title: "Vendor Listings",
        href: "/admin/dashboard/vendors/listings",
      },
    ],
  },
  {
    title: "Payments",
    href: "/admin/dashboard/payments",
    links: [
      {
        title: "Payment History",
        href: "/admin/dashboard/payments/history",
      },
      {
        title: "Invoices",
        href: "/admin/dashboard/payments/invoices",
      },
      {
        title: "Payment Information",
        href: "/admin/dashboard/payments/information",
      },

    ]
  },
  {
    title: "Message Centre",
    href: "/admin/dashboard/messages",
    links: [
      {
        title: "Message Vendors",
        href: "/admin/dashboard/messages/vendors",
      },
      {
        title: "Notifications",
        href: "/admin/dashboard/messages/notifications",
      },
    ]
  },
  {
    title: "Terms & Conditions",
    href: "/admin/dashboard/terms",
  },
  {
    title: "View Vendor Dashboard",
    href: "/dashboard",
  },
  {
    title: "Logout",
    href: "/admin/dashboard/logout",
  },
];
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (sanityUser.role !== "admin" && sanityUser.role !== "dev") {
    return redirect("/dashboard");
  }

  return (
    <section className="flex">
      <aside className="bg-nav-bg text-nav-text px-10 flex flex-col py-[10px] gap-[10px]">
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
              <div className="flex flex-col items-center">
                <Link
                  href={option.href}
                  key={option.title}
                  className="text-center uppercase font-bold text-xl mb-4"
                >
                  {option.title}
                </Link>
                {option.links && (
                  <>
                    {option.links.map((link) => (
                      <Link
                        href={link.href}
                        key={link.title}
                        className="text-center"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        ))}
      </aside>
      {children}
    </section>
  );
};

export default DashboardLayout;