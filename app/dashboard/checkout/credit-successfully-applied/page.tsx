import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import { getPaymentById } from "@/sanity/queries/payments";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ContinueButton from "../../markets/[id]/_components/ContinueButton";
import Link from "next/link";
import { formatDateWLuxon } from "@/utils/helpers";
import { unstable_noStore } from "next/cache";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  unstable_noStore();

  const paymentRecordId = searchParams.paymentRecordId as string;

  try {
    const paymentRecord = await getPaymentById(paymentRecordId)

    const market = await getMarketById(paymentRecord.marketId)

    return (
      <main className="pt-14 px-5 w-full min-h-screen max-w-3xl mx-auto flex flex-col items-center gap-6">
        <IoMdCheckmarkCircleOutline className="text-[#35d124] border-2 w-24 h-24 border-secondary rounded-full" />
        <h1 className="text-xl font-semibold">Payment Success!</h1>
        <p className="">Vendor Table has been reserved for:</p>
        <h2 className="text-lg font-semibold">{market?.name}</h2>
        <section className="w-fit flex flex-col gap-24">
          <table className="w-full text-left">
            <thead>
              <tr className="w-full">
                <th>Date</th>
                <th>Table ID</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {paymentRecord.items.map((item, index) => (
                <tr key={index} className="w-full">
                  <td className="">{formatDateWLuxon(item.date)}</td>
                  <td className="">{item.tableId}</td>
                  <td className="">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <section className="w-full">
            <p>
              <strong>Order Id:</strong> {paymentRecord._id}
            </p>
            <p>
              <strong>Paid:</strong> ${paymentRecord.amount.paid}
            </p>
            {/* <p>
              <strong>Still Owing:</strong> ${paymentRecord.amount.owed}
            </p> */}
            <p>
              <strong>Price before tax:</strong> ${paymentRecord.amount.total}
            </p>
          </section>
          <footer className="flex gap-10 flex-wrap">
            {paymentRecord.amount.owed > 0 && (
              <Link href={`/dashboard/checkout/${paymentRecord._id}/pay-remainder`}>
                <ContinueButton>
                  Pay Remainder
                </ContinueButton>
              </Link>
            )}
            <Link href="/dashboard/">
              <ContinueButton>
                Back to Profile
              </ContinueButton>
            </Link>
            <Link href="/dashboard/explore">
              <ContinueButton>
                Book Another Market
              </ContinueButton>
            </Link>
          </footer>
        </section>

      </main>
    );

  } catch (error) {
    return (
      <main>
        <h1>Payment Not Found</h1>
      </main>
    );
  }

}

export default Page;