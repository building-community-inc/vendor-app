import { getSanityUserByEmail, getUserMarkets } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import NoBz from "./_components/NoBz";
import { formatDateWLuxon } from "@/utils/helpers";
import { DateTime } from 'luxon';
import UpdateProfileImage from "./_components/UpdateProfileImage";
import Link from "next/link";
import React from "react";
import { TBusiness, TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { cn } from "@/utils";
import Button from "../_components/Button";

const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  const userMarkets = await getUserMarkets(sanityUser._id);
  // console.log(userMarkets)

  userMarkets.sort((a, b) => {
    // Convert the dates from strings to DateTime objects and find the earliest date
    const datesA = a.market.dates.map(date => {
      const [year, month, day] = date.split('-').map(Number);
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return DateTime.fromISO(formattedDate, { zone: 'America/Toronto' }).startOf('day');
    });
    const datesB = b.market.dates.map(date => {
      const [year, month, day] = date.split('-').map(Number);
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return DateTime.fromISO(formattedDate, { zone: 'America/Toronto' }).startOf('day');
    });
    const minDateA = datesA.reduce((earliest, date) => date < earliest ? date : earliest, DateTime.fromISO('9999-12-31'));
    const minDateB = datesB.reduce((earliest, date) => date < earliest ? date : earliest, DateTime.fromISO('9999-12-31'));

    // Compare the two dates
    return minDateA < minDateB ? -1 : minDateA > minDateB ? 1 : 0;
  });

  return (
    <main className="flex p-10 gap-2 min-h-screen w-full flex-col justify-center">
      <section className=" flex flex-col gap-10">

        {sanityUser.business ? (
          <section className="flex flex-wrap justify-evenly gap-10 ">
            <BusinessCard credits={sanityUser.credits || 0} business={sanityUser.business} ownerName={`${sanityUser.firstName} ${sanityUser.lastName}`} />
            <ContactCard email={sanityUser.email} phone={sanityUser.business?.phone} address={`${sanityUser.business?.address1} ${sanityUser.business?.address2}`} />
          </section>
        ) : (
          <NoBz />
        )}
        <section className="flex w-full justify-evenly">

          <Button className="h-fit font-bold font-darker-grotesque">
            <Link href="/dashboard/edit-profile">Edit Profile</Link>
          </Button>
          <Button className="h-fit font-bold font-darker-grotesque">
            <Link href="/dashboard/upload-files">Upload Files</Link>
          </Button>

        </section>
      </section>
    </main>
  );
};

export default page;

const ContactCard = ({ email, phone, address }: {
  email: string;
  phone: string;
  address: string;
}) => {
  return (
    <DashboardSection className="py-5 px-3 flex flex-col gap-5">
      <div>
        <p className="text-xl font-segoe font-bold text-black">Email:</p>
        <p className="font-segoe text-2xl">{email}</p>
      </div>
      <div>
        <p className="text-xl font-segoe font-bold text-black">Phone:</p>
        <p className="font-segoe text-2xl">{phone}</p>
      </div>
      <div>
        <p className="text-xl font-segoe font-bold text-black">Dddress:</p>
        <p className="font-segoe text-2xl">{address}</p>
      </div>
    </DashboardSection>
  )
}


const BusinessCard = ({ business, ownerName, credits }: {
  business: TUserWithOptionalBusinessRef["business"];
  ownerName: string;
  credits: number;
}) => {
  return (
    <DashboardSection>
      {business?.logoUrl && (
        <BusinessSection className="flex justify-center">
          <Image src={business.logoUrl} alt={business.businessName} width={100} height={100} />
        </BusinessSection>
      )}

      <BusinessSection>
        <h1 className="text-3xl font-darker-grotesque text-title-color">{business?.businessName}</h1>
        <span className="font-segoe text-xl">{business?.industry}</span>
      </BusinessSection>
      <BusinessSection className="text-black flex flex-col gap-5">
        <div>
          <p className="text-xl font-segoe font-bold text-black">Owner Name:</p>
          <p className="font-segoe text-2xl">{ownerName}</p>
        </div>
        <div>
          <p className="text-xl font-segoe font-bold text-black">Instagram Handle:</p>
          <p className="font-segoe text-2xl">{business?.instagramHandle}</p>
        </div>
      </BusinessSection>
      <BusinessSection className="text-black border-none">
        <div>
          <p className="text-xl  font-segoe font-bold text-black">Credit Balance:</p>
          <p className="font-segoe text-2xl">${credits}</p>
        </div>

      </BusinessSection>
    </DashboardSection >
  )

}


const DashboardSection = ({ children, className }: React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
}) => {
  return (
    <section className={cn("max-w-[433px] w-full h-fit border rounded-3xl border-button-border-color shadow-md shadow-button-border-color", className)}>
      {children}
    </section>
  )
}


const BusinessSection = ({ children, className }: React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
}) => {
  return (
    <section className={cn("w-full border-b py-5 px-3 border-button-border-color", className)}>

      {children}
    </section>
  )
}