"use client";
import Image from "next/image";
import Link from "next/link";
import navOptions from "./navOptions.json";
import { SignOutButton } from "@clerk/nextjs";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { usePathname } from "next/navigation";

const AdminNavbar = ({ user }: { user: TUserWithOptionalBusinessRef }) => {
  const pathname = usePathname();
  // console.log({ pathname });
  return (
    <aside className="bg-nav-bg shadow-[10px_3px_6px_#00000029] text-nav-text px-10 flex flex-col py-[10px] gap-2 h-screen overflow-y-scroll hide-scrollbar pb-10">
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
            <div className="flex flex-col items-center mb-2">
              <Link
                href={option.href}
                key={option.title}
                className="text-center uppercase font-bold text-xl mb-4 relative"
              >
                {pathname === option.href && (
                  <span className="absolute -left-5 top-1/2 -translate-y-1/2">{"->"}</span>
                )}
                {option.title}
              </Link>
              {option.links && (
                <>
                  {option.links.map((link) => (
                    <Link
                      href={link.href}
                      key={link.title}
                      className="text-center relative"
                    >
                      {pathname === link.href && (
                        <span className="absolute -left-4">{"->"}</span>
                      )}
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
  );
};

export default AdminNavbar;
