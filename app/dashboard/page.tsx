import { getSanityUserByEmail, getUserMarkets } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import NoBz from "./_components/NoBz";
import { formatDateWLuxon } from "@/utils/helpers";
import { DateTime } from 'luxon';

const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  const userMarkets = await getUserMarkets(sanityUser._id);
  

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
    <main className="flex gap-2 min-h-screen w-full">
      {sanityUser.business ? (
        <section className="flex flex-col gap-5 xl:gap-10 items-center justify-center w-full px-10">
          <section className="flex flex-col sm:flex-row items-center gap-10">
            {sanityUser.business.logoUrl ? (
              <Image
                src={sanityUser.business.logoUrl}
                alt={sanityUser.business.businessName}
                width={228}
                height={228}
                className="rounded-2xl object-cover w-fit h-fit"
              />
            ) : (
              <div className="w-[228px] h-[228px] bg-white flex items-center justify-center text-black rounded-2xl">
                <p className="font-bold text-center rotate-45 max-w-[6ch] text-xl">
                  Vendor Logo
                </p>
              </div>
            )}
            <section className="w-fit flex flex-col gap-2">
              <h2 className="rounded-full bg-white text-black font-bold px-4 py-1">
                {sanityUser.business.businessName}
              </h2>
              <p className="flex gap-2">
                <strong>Product Category:</strong>
                {sanityUser.business.industry}
              </p>
              <p className="flex gap-2">
                <strong>Owner Name:</strong>
                {`${sanityUser.firstName} ${sanityUser.lastName}`}
              </p>
              <p className="flex gap-2">
                <strong>Address:</strong>
                {`${sanityUser.business.address1} ${sanityUser.business.address2}`}
              </p>
              <p className="flex gap-2">
                <strong>City:</strong>
                {sanityUser.business.city}
              </p>
              <p className="flex gap-2">
                <strong>Province:</strong>
                {sanityUser.business.province}
              </p>
              <p className="flex gap-2">
                <strong>Postal Code:</strong>
                {sanityUser.business.postalCode}
              </p>
              <p className="flex gap-2">
                <strong>Country:</strong>
                {sanityUser.business.country}
              </p>
              <p className="flex gap-2">
                <strong>Email:</strong>
                {sanityUser.email}
              </p>
              <p className="flex gap-2">
                <strong>Phone:</strong>
                {sanityUser.business.phone}
              </p>
              <p className="flex gap-2">
                <strong>Instagram Handle:</strong>
                <span className="text-[#0A6FA2]">
                  @{sanityUser.business.instagramHandle ?? ""}
                </span>
              </p>
              {sanityUser.business.pdfs && (
                <ul className="flex gap-2 flex-col">
                  <strong>Supporting Documents:</strong>
                  {sanityUser.business.pdfs.map((pdf) => (
                    <li key={pdf.url}>- {pdf.name}</li>
                  ))}
                </ul>
              )}
            </section>
          </section>
          {userMarkets.length > 0 && (
            <section>
              <div className="flex items-center gap-5">
                <h3 className="whitespace-nowrap flex-shrink-0 font-bold text-lg">
                  My Markets
                </h3>
                <div className="h-[1px] w-full flex-grow bg-[#707070] " />
              </div>
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2">Market Date</th>
                    <th className="text-left p-2">Market</th>
                    <th className="text-left p-2">Table Info</th>
                    <th className="text-left p-2">Amounts</th>
                  </tr>
                </thead>
                <tbody>
                  {userMarkets.map((booking) => (
                    <>
                      {booking.items.map((item, index) => (
                        <tr key={`${booking._id}-${index}`}>
                          <td className="text-left p-2">
                            {formatDateWLuxon(booking.market.dates[0])}
                          </td>
                          <td className="text-left p-2">{booking.market.name}</td>
                          <td className="text-left p-2">table: {item.tableId} date: {formatDateWLuxon(item.date)}</td>
                          <td className="text-left p-2">paid: {booking.amount.paid} total: {booking.amount.total}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </section>
      ) : (
        <NoBz />
      )}
    </main>
  );
};

export default page;
