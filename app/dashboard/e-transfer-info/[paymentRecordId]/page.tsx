import { getPaymentByIdWithMarket } from "@/sanity/queries/payments";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import Box from "../../markets/[id]/select-preferences/_components/Box";
import { formatDateWLuxon } from "@/utils/helpers";
import Link from "next/link";
import Button from "@/app/_components/Button";


const PAYMENT_EMAIL = "payments@buildingcommunityinc.com";

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
      <main className="pt-10 flex flex-col gap-10 items-center font-darker-grotesque">

        <Box className="gap-5">
          <header className="text-center flex flex-col gap-1">

            <h1 className="text-[1.9rem] font-bold font-darker-grotesque text-black">Booking Details </h1>
            <span className="text-[1.3rem]">Vendor Table for has been {paymentRecord.paymentReturned ? "cancelled" : "reserved"} for:</span>
            <h2 className="font-bold text-blac text-[1rem] text-black">{paymentRecord.market.name}</h2>
            <h3 className="text-black text-[1rem]"><strong>Order ID:</strong> {paymentRecord._id}</h3>
            <h4 className="capitalize"><strong> Booking Status:</strong> {paymentRecord.status || "paid"} </h4>
          </header>

          <section className="w-full flex flex-col gap-2">
            {/* <h2 className="font-bold">Date</h2> */}
            <header className="flex justify-between w-full">
              <h3 className="text-lg font-bold font-darker-grotesque text-black flex-1">Date</h3>
              <h3 className="text-lg font-bold font-darker-grotesque text-black flex-1">Table ID</h3>
              <h3 className="text-lg font-bold font-darker-grotesque text-black flex-1">Price</h3>

            </header>
            <ul className="flex flex-col gap-2 w-full">
              {paymentRecord.items.map(item => (
                <li key={item.tableId} className="flex justify-between gap-2 w-full">
                  <div className="flex-1">
                    <span>{formatDateWLuxon(item.date)}</span>
                  </div>
                  <div className="flex-1">
                    <span>{item.tableId}</span>
                  </div>
                  <div className="flex-1">
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  {/* <div>
                  <h3>Price:</h3>
                  <span>${item.}</span>
                </div> */}
                </li>
              ))}
            </ul>
            {paymentRecord.payments && (
              <ul>
                <strong>
                  Payments
                </strong>
                {paymentRecord.payments?.map(payment => (
                  <li key={payment._key}>
                    <p>
                      Payment type: {payment.paymentType}
                    </p>
                    <p>
                      Amount: ${payment.amount}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <footer className="text-black flex flex-col gap-4">
              <strong>Totals:</strong>
              {paymentRecord.amount.owed && paymentRecord.amount.owed > 0 ? (
                <>
                  <div className="">
                    <h3 className="font-bold">Paid</h3>
                    <p>${paymentRecord.amount.paid}</p>
                  </div>
                  <div className="">
                    <h3 className="font-bold">Owed</h3>
                    <p>${paymentRecord.amount.owed}</p>
                  </div>
                </>
              ) : ("")}

              <div className="">
                <h3 className="font-bold">HST</h3>
                <p>${paymentRecord.amount.hst}</p>
              </div>
              {paymentRecord.payments && (
                <div>
                  <h3 className="font-bold">Total</h3>
                  <p>${paymentRecord.payments?.reduce((total, payment) => total + payment.amount, 0).toFixed(2)}</p>
                </div>
              )}
              {/* {paymentRecord.amount.owed && paymentRecord.amount.owed > 0 ? (
              <Button className="h-fit">
                <Link href={`/dashboard/checkout/${paymentRecord._id}/pay-remainder/`}>Pay Remainder</Link>
              </Button>
            ) : ""} */}

              <p>Please send payment of <strong> ${paymentRecord.amount.owed}</strong> to:
                {` ${PAYMENT_EMAIL}`}</p>
              <p>
                Add the following payment code to the message of the payment:
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
    redirect(`/bookings/${params.paymentRecordId}`)
  }
}

export default Page;