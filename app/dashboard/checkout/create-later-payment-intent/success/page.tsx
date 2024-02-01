import { getPaymentByIdWithMarket } from "@/sanity/queries/payments";
import { formatMarketDate } from "@/utils/helpers";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) => {

  if (!searchParams.paymentId) {
    return (
      <main>
        <h1>Payment Not Found</h1>
      </main>
    );
  }

  const payment = await getPaymentByIdWithMarket(searchParams.paymentId);
  return (
    <main className="flex flex-col items-center h-full justify-center">
      <h1 className="font-bold text-xl">Payment Successful</h1>

      <p><strong>Order Id:</strong>{payment._id}</p>
      <p><strong>Market:</strong>{payment.market.name}</p>
      <p><strong>Amount Paid:</strong>${payment.amount.paid}</p>
      <p><strong>Amount Owed:</strong>${payment.amount.owed}</p>
      <p><strong>Amount Total:</strong>${payment.amount.total}</p>
      <ul>
        <h2 className="font-bold text-lg">Payments</h2>
        {payment.payments.map((payment, index) => (
          <li key={payment.paymentDate} className="flex items-start gap-2">
            <span>{index + 1}.</span>
            <div>

              <p><strong>Date:</strong>{formatMarketDate(payment.paymentDate)}</p>
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

              <p><strong>Date:</strong>{formatMarketDate(item.date)}</p>
              <p><strong>Table Id:</strong>{item.tableId}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Page;