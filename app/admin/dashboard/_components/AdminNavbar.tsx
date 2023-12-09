"use client";
import Image from "next/image";
import Link from "next/link";
import navOptions from "./navOptions.json";
import { SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Burger from "@/app/_components/Burger";

const AdminNavbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  // console.log({ pathname });


  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname])
  return (
    <aside
      className={`absolute z-10 md:relative text-nav-text px-10 flex flex-col py-[10px] gap-2 h-screen overflow-y-scroll hide-scrollbar pb-10 ${
        isNavOpen ? "w-[360px] shadow-[10px_3px_6px_#00000029] bg-nav-bg" : "w-0 bg-none"
      } transition-all duration-200 ease-in-out md:w-[360px] md:shadow-[10px_3px_6px_#00000029]`}
    >
      <div className="absolute top-4 left-5 md:hidden">
        <Burger
          isNavOpen={isNavOpen}
          onClickHandler={() => setIsNavOpen(!isNavOpen)}
        />
      </div>
      {/* {isNavOpen && ( */}
        <div className={`${isNavOpen ? "" : "hidden"} md:block`}>
          <Link href="/">
            <Image
              src={"/logo-on-white-bg.png"}
              alt="logo"
              width={468}
              height={468}
            />
          </Link>

          {navOptions.map((option) => (
            <React.Fragment key={option.href}>
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
                      <span className="absolute -left-5 top-1/2 -translate-y-1/2">
                        {"->"}
                      </span>
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
            </React.Fragment>
          ))}
        </div>
      {/* )} */}
    </aside>
  );
};

export default AdminNavbar;
