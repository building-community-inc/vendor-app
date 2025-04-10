import ContinueButton from "@/app/dashboard/markets/[id]/_components/ContinueButton";
import { getPaymentByIdWithMarket } from "@/sanity/queries/payments";
import { formatDateWLuxon } from "@/utils/helpers";
import Link from "next/link";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const Page = async (
  props: {
    searchParams: Promise<{
      [key: string]: string | undefined;
    }>;
  }
) => {
  const searchParams = await props.searchParams;

  if (!searchParams.paymentId) {
    return (
      <main>
        <h1>Payment Not Found</h1>
      </main>
    );
  }

  const payment = await getPaymentByIdWithMarket(searchParams.paymentId);
  return (
    <main className="pt-14 px-5 w-full min-h-screen max-w-3xl mx-auto flex flex-col items-center gap-6">
      <IoMdCheckmarkCircleOutline className="text-[#35d124] border-2 w-24 h-24 border-secondary rounded-full" />
      <h1 className="text-xl font-semibold">Payments Success!</h1>

      <p><strong>Order Id:</strong>{payment._id}</p>
      <Link href={`/dashboard/markets/${payment.market._id}`}>
        <p><strong>Market:</strong>{payment.market.name}</p>
      </Link>
      <p><strong>Amount Owed:</strong>${payment.amount.owed}</p>
      <p><strong>Price before Tax:</strong>${payment.amount.total}</p>
      <p><strong>Amount Paid:</strong>${payment.amount.paid}</p>
      <ul>
        <h2 className="font-bold text-lg">Payments</h2>
        {payment.payments?.map((payment, index) => (
          <li key={payment.paymentDate} className="flex items-start gap-2">
            <span>{index + 1}.</span>
            <div>

              <p><strong>Date:</strong>{formatDateWLuxon(payment.paymentDate)}</p>
              <p><strong>Amount:</strong>${payment.amount}</p>
            </div>
          </li>
        ))}
      </ul>
      <ul>
        <h2 className="font-bold text-lg">Tables Booked</h2>
        {payment.items.map((item, index) => (
          <li key={item.date} className="flex items-start gap-2">
            <span>{index + 1}.</span>
            <div>

              <p><strong>Date:</strong>{formatDateWLuxon(item.date)}</p>
              <p><strong>Table Id:</strong>{item.tableId}</p>
            </div>
          </li>
        ))}
      </ul>
      <footer className="flex gap-10 flex-wrap">

        <ContinueButton>
          <Link href="/dashboard/">
            Back to Profile
          </Link>
        </ContinueButton>
        <ContinueButton>
          <Link href="/dashboard/explore">
            Book Another Market
          </Link>
        </ContinueButton>
      </footer>
    </main>
  );
}

export default Page;