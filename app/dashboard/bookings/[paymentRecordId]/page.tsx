import { unstable_noStore } from "next/cache";
import Box from "../../markets/[id]/select-preferences/_components/Box";
import { getPaymentByIdWithMarket } from "@/sanity/queries/payments";
import { formatDateWLuxon } from "@/utils/helpers";
import Button from "@/app/_components/Button";
import Link from "next/link";

const Page = async (
  props: {
    params: Promise<{
      paymentRecordId: string;
    }>;
  }
) => {
  const params = await props.params;
  unstable_noStore();
  const paymentRecordInfo = await getPaymentByIdWithMarket(params.paymentRecordId);

  return (
    <main className="pt-10 flex flex-col gap-10 items-center font-darker-grotesque">

      <Box className="gap-5">
        <header className="text-center flex flex-col gap-1">

          <h1 className="text-[1.9rem] font-bold font-darker-grotesque text-black">Booking Details </h1>
          <span className="text-[1.3rem]">Vendor Table for has been {paymentRecordInfo.paymentReturned ? "cancelled" : "reserved"} for:</span>
          <h2 className="font-bold text-blac text-[1rem] text-black">{paymentRecordInfo.market.name}</h2>
          <h3 className="text-black text-[1rem]"><strong>Order ID:</strong> {paymentRecordInfo._id}</h3>
          <h4 className="capitalize"><strong> Booking Status:</strong> {paymentRecordInfo.status || "paid"} </h4>
        </header>

        <section className="w-full flex flex-col gap-2">
          {/* <h2 className="font-bold">Date</h2> */}
          <header className="flex justify-between w-full">
            <h3 className="text-lg font-bold font-darker-grotesque text-black flex-1">Date</h3>
            <h3 className="text-lg font-bold font-darker-grotesque text-black flex-1">Table ID</h3>
            <h3 className="text-lg font-bold font-darker-grotesque text-black flex-1">Price</h3>

          </header>
          <ul className="flex flex-col gap-2 w-full">
            {paymentRecordInfo.items.map(item => (
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
          {paymentRecordInfo.payments && (
            <ul>
              <strong>
                Payments
              </strong>
              {paymentRecordInfo.payments?.map(payment => (
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
          <footer className="text-black">
            <strong>Totals:</strong>
            {paymentRecordInfo.amount.owed && paymentRecordInfo.amount.owed > 0 ? (
              <>
                <div className="">
                  <h3 className="font-bold">Paid</h3>
                  <p>${paymentRecordInfo.amount.paid}</p>
                </div>
                <div className="">
                  <h3 className="font-bold">Owed</h3>
                  <p>${paymentRecordInfo.amount.owed}</p>
                </div>
              </>
            ) : ("")}

            <div className="">
              <h3 className="font-bold">HST</h3>
              <p>${paymentRecordInfo.amount.hst}</p>
            </div>
            {paymentRecordInfo.payments && (
              <div>
                <h3 className="font-bold">Total</h3>
                <p>${paymentRecordInfo.payments?.reduce((total, payment) => total + payment.amount, 0).toFixed(2)}</p>
              </div>
            )}
            {/* {paymentRecordInfo.amount.owed && paymentRecordInfo.amount.owed > 0 ? (
              <Button className="h-fit">
                <Link href={`/dashboard/checkout/${paymentRecordInfo._id}/pay-remainder/`}>Pay Remainder</Link>
              </Button>
            ) : ""} */}
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
              <p>{paymentRecordInfo.market.name}</p>
            </div>

            <div className="">
              <h3 className="font-bold text-[1.2rem]">Address</h3>
              <p>{`${paymentRecordInfo.market.venue.address}, ${paymentRecordInfo.market.venue.city}`}</p>
            </div>

            <div className="">
              <h3 className="font-bold text-[1.2rem]">Hours</h3>
              <p>{paymentRecordInfo.market.venue.hours}</p>
            </div>

            <div className="">
              <h3 className="font-bold text-[1.2rem]">Phone</h3>
              <p>{paymentRecordInfo.market.venue.phone}</p>
            </div>

          </div>

          <div className="">
            <h3 className="font-bold text-[1.2rem]">Load In Instructions:</h3>
            <p>{paymentRecordInfo.market.venue.loadInInstructions}</p>
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
}

export default Page;