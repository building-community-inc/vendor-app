import { getSanityUserByEmail, getUserPaymentRecords } from "@/sanity/queries/user";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NoBz from "./_components/NoBz";
import { DateTime } from 'luxon';
import Link from "next/link";
import React from "react";
import Button from "../_components/Button";
import { BusinessCard, ContactCard } from "./_components/profileComps";
import { unstable_noStore } from "next/cache";
import { SupportingDocsCard } from "./_components/profileComps/SupportingDocs";
import VendorPayments from "../admin/dashboard/vendors/[id]/VendorPayments";


const page = async () => {
  unstable_noStore();
  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  const userPaymentRecords = await getUserPaymentRecords(sanityUser._id);

  userPaymentRecords.sort((a, b) => {
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
      <section className=" flex flex-wrap gap-10 justify-center">

        {sanityUser.business ? (
          // <section className="flex flex-wrap justify-evenly gap-10 ">
          <BusinessCard credits={sanityUser.credits || 0} business={sanityUser.business} ownerName={`${sanityUser.firstName} ${sanityUser.lastName}`} />
          // </section>
        ) : (
          <NoBz />
        )}
        <footer className="flex flex-col gap-10 items-center">
          {sanityUser.business && (
            <ContactCard email={sanityUser.email} phone={sanityUser.business?.phone} address={`${sanityUser.business?.address1} ${sanityUser.business?.address2}`} />
          )}

          {sanityUser.business && sanityUser.business.pdfs && sanityUser.business.pdfs.length > 0 && (
            <SupportingDocsCard pdfs={sanityUser.business.pdfs} />
          )}
          <div className="flex gap-8 w-full max-w-[433px] justify-evenly flex-wrap">

            <Link href="/dashboard/edit-profile">
              <Button className="h-fit font-bold font-darker-grotesque text-sm whitespace-nowrap">
                Edit Profile
              </Button>
            </Link>
            <Link href="/dashboard/upload-files">
              <Button className="h-fit font-bold font-darker-grotesque text-sm whitespace-nowrap">
                Upload or Edit Files
              </Button>
            </Link>

          </div>
        </footer>
      </section>

      {userPaymentRecords.length > 0 && (
        <VendorPayments vendorPaymentRecords={userPaymentRecords} />
      )}
    </main>
  );
};

export default page;

