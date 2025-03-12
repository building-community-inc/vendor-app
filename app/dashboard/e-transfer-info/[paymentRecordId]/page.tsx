import { getPaymentByIdWithMarket } from "@/sanity/queries/payments";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import Box from "../../markets/[id]/select-preferences/_components/Box";
import { formatDateWLuxon } from "@/utils/helpers";
import Link from "next/link";
import Button from "@/app/_components/Button";
import Email from "./Email";


const PAYMENT_EMAIL = "accounting@buildingcommunityinc.com";

const Page = async ({ params }: {
  params: {
    paymentRecordId: string;
  }
}) => {
  unstable_noStore();

  const user = await currentUser();

  if (!user) redirect("/sign-in")

  const sanityUser = await getSanityUserByEmail(user.emailAddresses[0].emailAddress)

  if (!sanityUser) redirect("/sign-in")

  const paymentRecord = await getPaymentByIdWithMarket(params.paymentRecordId)

  console.log({ paymentRecord })

  if (paymentRecord.status === "pending") {

    return (
      <main className="pt-10 flex flex-col gap-10 items-center font-darker-grotesque bg-white px-5">

        <Box className="gap-5">
          <header className="text-center flex flex-col gap-2">

            <h1 className="text-[1.9rem] font-bold font-darker-grotesque text-black">Booking Details</h1>
            <h2 className="font-bold text-blac text-[1rem] text-black">To complete your reservation please remit your payment of ${paymentRecord.amount.owed} within 24 hours to:</h2>
            <div className="my-2">

              <Email paymentEmail={PAYMENT_EMAIL} />
            </div>
            <p className="text-left">Your booking status will remain pending until your payment has been processed.</p>
            <p className="text-black text-left">
              <strong>Event: </strong>
              {paymentRecord.market.name}
            </p>
            <header className="flex justify-between w-full">
              <h3 className="text-lg text-left font-bold font-darker-grotesque text-black flex-1">Date</h3>
              <h3 className="text-lg text-left font-bold font-darker-grotesque text-black flex-1">Table ID</h3>
              <h3 className="text-lg text-left font-bold font-darker-grotesque text-black flex-1">Price</h3>

            </header>
            <ul className="flex flex-col gap-2 w-full">
              {paymentRecord.items.map(item => (
                <li key={item.tableId} className="flex justify-between gap-2 w-full">
                  <div className="flex-1 text-left">
                    <span>{formatDateWLuxon(item.date)}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <span>{item.tableId}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  {/* <div>
                  <h3>Price:</h3>
                  <span>${item.}</span>
                </div> */}
                </li>
              ))}
            </ul>
          </header>

          <section className="w-full flex flex-col gap-2">
            <footer className="text-black flex flex-col gap-4">

              <p className="flex items-center gap-1">
                <strong>
                  Sub-Total:
                </strong>
                ${(paymentRecord.amount.owed || 0) - paymentRecord.amount.hst}
              </p>
              <p className="flex items-center gap-1">
                <strong>
                  Hst:
                </strong>
                ${paymentRecord.amount.hst}
              </p>
              <p className="flex items-center gap-1">
                <strong>
                  Total:
                </strong>
                ${paymentRecord.amount.owed}
              </p>
              <p className="flex items-center gap-1">
                <strong>
                  Paid:
                </strong>
                ${paymentRecord.amount.paid}
              </p>

            </footer>
          </section>
        </Box>
        <Box className="text-black gap-5">
          <header>
            <h2 className="text-[1.9rem] font-bold">Venue Details</h2>
          </header>
          <section className="grid gap-5">
            <div className="grid grid-cols-2 gap-5">

              <div className="">
                <h3 className="font-bold text-[1.2rem]">Name</h3>
                <p>{paymentRecord.market.name}</p>
              </div>

              <div className="">
                <h3 className="font-bold text-[1.2rem]">Address</h3>
                <p>{`${paymentRecord.market.venue.address}, ${paymentRecord.market.venue.city}`}</p>
              </div>

              <div className="">
                <h3 className="font-bold text-[1.2rem]">Hours</h3>
                <p>{paymentRecord.market.venue.hours}</p>
              </div>

              <div className="">
                <h3 className="font-bold text-[1.2rem]">Phone</h3>
                <p>{paymentRecord.market.venue.phone}</p>
              </div>

            </div>

            <div className="">
              <h3 className="font-bold text-[1.2rem]">Load In Instructions:</h3>
              <p>{paymentRecord.market.venue.loadInInstructions}</p>
            </div>
          </section>
        </Box>

        <Link href={`/dashboard/`}>
          <Button className="h-fit">
            Back to Profile
          </Button>
        </Link>
      </main >

    );
  } else {
    redirect(`/dashboard/bookings/${params.paymentRecordId}`)
  }
}

export default Page;