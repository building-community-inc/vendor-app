"use client";

import Burger from "@/app/_components/Burger";
import SignOutButton from "@/app/_components/clerk/SignOut";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RedDot from "./RedDot";
import { UserButton } from "@clerk/nextjs";

import "./Navbar.css"

const navOptions = [
  {
    title: "My Profile",
    href: "/dashboard",
  },
  {
    title: "Explore Markets",
    href: "/dashboard/explore",
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
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

const NavBar = ({ user, areThereNewMessages }: { user: TUserWithOptionalBusinessRef, areThereNewMessages: boolean }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const [localUrl, setLocalUrl] = useState<string>();

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    setLocalUrl(window.location.href);
  }, []);
  return (
    <aside
      className={`absolute z-10 md:relative md:bg-nav-bg text-nav-text px-10 flex flex-col py-[10px] gap-2 h-screen overflow-y-scroll hide-scrollbar pb-10 ${isNavOpen
        ? "w-full shadow-md shadow-title-color bg-nav-bg"
        : "w-0 h-12"
        } transition-all duration-200 ease-in-out md:w-[360px] md:shadow-md md:shadow-title-color`}
    >
      <div className="absolute top-4 left-5 md:hidden">
        <Burger
          isNavOpen={isNavOpen}
          onClickHandler={() => setIsNavOpen(!isNavOpen)}
          barColor={'bg-black'}
        />
      </div>
      <div className={`${isNavOpen ? "" : "hidden"} md:block `}>
        <Link href="/" className="">
          <Image
            src={"/logo-on-white-bg.png"}
            alt="logo"
            width={468}
            height={468}
            className="w-[468px] object-cover mx-auto"
          />
        </Link>
        <div className="mx-auto w-fit mb-6">
          <UserButton
            afterSignOutUrl={localUrl}
          />
        </div>
        <ul className="flex flex-col gap-4">
          {navOptions.map((option) => (
            <li key={option.title} className="w-fit mx-auto hover:scale-105 transition-all">
              {option.title === "Logout" ? (
                <div className="text-center uppercase font-bold text-xl">
                  <SignOutButton key={option.href} />
                </div>
              ) : option.title === "Messages" ? (
                <Link
                  href={option.href}
                  key={option.title}
                  className="relative text-center uppercase font-bold text-xl"
                >
                  {option.title}
                  {areThereNewMessages &&
                    <RedDot className="left-auto -right-5" />
                  }
                </Link>
              ) : (
                <Link
                  href={option.href}
                  key={option.title}
                  className="text-center uppercase font-bold text-xl"
                >
                  {option.title}
                </Link>
              )}
            </li>
          ))}
          {user.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="text-center font-bold text-xl hover:text-2xl transition-all"
            >
              View Admin
            </Link>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default NavBar;
