import { getSanityUserByEmail, getUserMarkets } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import NoBz from "./_components/NoBz";
import { DateTime } from 'luxon';
import Link from "next/link";
import React from "react";
import { TPdf, TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { cn } from "@/utils";
import Button from "../_components/Button";
import { DocumentPdfIcon } from '@sanity/icons'


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
    <main className="flex px-10 py-24 gap-24 min-h-screen w-full flex-col justify-center">
      <section className=" flex flex-col gap-10 items-center">

        {sanityUser.business ? (
          <section className="flex flex-wrap justify-evenly gap-10 ">
            <BusinessCard credits={sanityUser.credits || 0} business={sanityUser.business} ownerName={`${sanityUser.firstName} ${sanityUser.lastName}`} />
            <ContactCard email={sanityUser.email} phone={sanityUser.business?.phone} address={`${sanityUser.business?.address1} ${sanityUser.business?.address2}`} />
          </section>
        ) : (
          <NoBz />
        )}
        {sanityUser.business && sanityUser.business.pdfs && sanityUser.business.pdfs.length > 0 && (
          <SupportingDocsCard pdfs={sanityUser.business.pdfs} />
        )}
        <footer className="flex w-full max-w-[433px] justify-evenly">

          <Button className="h-fit font-bold font-darker-grotesque">
            <Link href="/dashboard/edit-profile">Edit Profile</Link>
          </Button>
          <Button className="h-fit font-bold font-darker-grotesque">
            <Link href="/dashboard/upload-files">Upload or Edit Files</Link>
          </Button>

        </footer>
      </section>

      <section className="flex flex-col gap-2">
        <header className="border-2 border-b-black">

          <h2 className="text-2xl font-bold font-darker-grotesque text-black">My Market Bookings</h2>
        </header>
        <ul className="flex flex-col gap-5">
          {userMarkets.map(({ market }) => (
            <MarketCard key={market._id} market={market} />
          ))}
        </ul>


      </section>
    </main>
  );
};

export default page;

const MarketCard = ({ market }: {
  market: {
    _id: string;
    name: string;
    dates: string[];
  }
}) => {

  return (
    <li key={market._id} className="px-5 py-5 flex flex-wrap gap-8 border rounded-2xl justify-between border-button-border-color shadow-md shadow-button-border-color">

      <MarketSection title="Date">
        <ul className="flex flex-col gap-2">
          {market.dates.map(date => (
            <li key={date} className="flex items-center gap-2">
              <span>{date}</span>
            </li>
          ))}
        </ul>
      </MarketSection>
      <MarketSection title="Market Name">
        <span>{market.name}</span>
      </MarketSection>
      {/* <MarketSection title  */}
      <MarketSection title="Table">
        2
      </MarketSection>
      <MarketSection title="Amount Owing">
        $0
      </MarketSection>
      <MarketSection title="Booking Status">
        Reserved
      </MarketSection>
      <Button className="h-fit">
        <Link href={`#`}>Review Booking</Link>
      </Button>
    </li>
  )
}

const MarketSection = ({ title, children }: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="flex flex-col gap-2">
      {title && <h3 className="font-darker-grotesque font-bold">{title}</h3>}
      {children}
    </section>
  )

}

const SupportingDocsCard = ({
  pdfs
}: {
  pdfs: TPdf[];
}) => {

  return (
    <DashboardSection className="py-5 px-3 flex flex-col gap-5">
      <h3 className="text-xl font-segoe font-bold text-black">Supporting Documents:</h3>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf._id} className="flex items-center justify-between">
            <a href={pdf.url} target="_blank" rel="noreferrer" className="font-segoe text-2xl flex items-center">
              <DocumentPdfIcon className="text-2xl" />
              <span>
                {pdf.originalFileName}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}

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