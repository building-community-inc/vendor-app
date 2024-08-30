import { getSanityUserByEmail, getUserPayments } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NoBz from "./_components/NoBz";
import { DateTime } from 'luxon';
import Link from "next/link";
import React from "react";
import Button from "../_components/Button";
import { BusinessCard, ContactCard, DashboardSection, PaymentCard, SupportingDocsCard } from "./_components/profileComps";


const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  const userPayments = await getUserPayments(sanityUser._id);
  // console.log(userPayments)

  userPayments.sort((a, b) => {
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

  console.log({items: userPayments[10].items})
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
          <div className="flex gap-8 w-full max-w-[433px] justify-evenly">

            <Button className="h-fit font-bold font-darker-grotesque">
              <Link href="/dashboard/edit-profile">Edit Profile</Link>
            </Button>
            <Button className="h-fit font-bold font-darker-grotesque">
              <Link href="/dashboard/upload-files">Upload or Edit Files</Link>
            </Button>

          </div>
        </footer>
      </section>

      <section className="flex flex-col gap-2">
        <header className="border-2 border-b-black">

          <h2 className="text-2xl font-bold font-darker-grotesque text-black">My Market Bookings</h2>
        </header>
        <ul className="flex flex-col gap-5">
          {userPayments.map(payment => (
            <PaymentCard amount={payment.amount} paymentId={payment._id} key={payment._id} market={payment.market} items={payment.items} />
          ))}
        </ul>


      </section>
    </main>
  );
};

export default page;

