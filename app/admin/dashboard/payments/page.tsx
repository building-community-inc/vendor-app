import { getAllPayments } from "@/sanity/queries/admin/payments";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import { DateTime } from "luxon";

const Page = async () => {
  noStore();

  const allPayments = await getAllPayments();


  if (!allPayments) {
    return <main className="grid place-content-center min-h-screen w-full">
      No payments found
    </main>;
  }

  const balancesOwedPayments = allPayments.filter(
    (payment) => payment.amount.owed > 0
  );

  const paymentHistory = allPayments.filter(
    (payment) => payment.amount.owed === 0
  );
  

  const totalPaid = paymentHistory.reduce((acc, payment) => {
    return acc + payment.amount.paid;
  }, 0);

  return (
    <main className="flex flex-col px-10 py-10 gap-2 min-h-screen w-full">
      <h1 className="font-bold text-xl">Payments</h1>
      {balancesOwedPayments.length > 0 && (
        <section className="mt-5">

          <FormTitleDivider title="Outstanding Balances" />
          <ul className="flex flex-wrap gap-2">
            {balancesOwedPayments.map((payment) => {
              const [dueDateYear, dueDateMonth, dueDateday] = payment.market.dates[0].split('-').map(Number);
              const formattedDueDate = `${dueDateYear}-${dueDateMonth.toString().padStart(2, '0')}-${dueDateday.toString().padStart(2, '0')}`;
              const newDueDate = DateTime.fromISO(formattedDueDate, { zone: 'America/Toronto' }).startOf('day');
              const formattedDueDateString = newDueDate.toFormat('EEE, MMM d, yyyy');
              const dateList = payment.items.map(({ date }) => {
                const [year, month, day] = date.split('-').map(Number);
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const newDate = DateTime.fromISO(formattedDate, { zone: 'America/Toronto' }).startOf('day');
                const formattedDateString = newDate.toFormat('EEE, MMM d, yyyy');
                return formattedDateString;
              });

              return (
                <PaymentItem key={payment._id}>
                  <TitleName title="Market Name" name={payment.market.name.split(" - ")[0]} />
                  <TitleName title="Market Dates" name={payment.market.name.split(" - ")[1]} />
                  <TitleName title="Dates Booked" list={dateList} />
                  <TitleName title="Vendor Name" name={payment.vendor.businessName} />
                  <TitleName title="Amount Owing" name={`$${payment.amount.owed}`} />
                  <TitleName title="Due Date" name={formattedDueDateString} />
                </PaymentItem>
              )
            })}
          </ul>
        </section>
      )}
      {paymentHistory.length > 0 && (
        <section className="flex flex-col mt-10">
          <FormTitleDivider title="Payment History" />
          <ul className="flex flex-wrap gap-2">
            {paymentHistory.map((payment) => {
              const datesBookedList = payment.items.map(({ date }) => {
                const [year, month, day] = date.split('-').map(Number);
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const newDate = DateTime.fromISO(formattedDate, { zone: 'America/Toronto' }).startOf('day');
                const formattedDateString = newDate.toFormat('EEE, MMM d, yyyy');
                return formattedDateString;
              });
              return (
                <PaymentItem key={payment._id}>
                  <TitleName title="Order Id" name={payment._id} />
                  <TitleName title="Vendor Name" name={payment.vendor.businessName} />
                  <TitleName title="Market Name" name={payment.market.name.split(" - ")[0]} />
                  <TitleName title="Market Dates" name={payment.market.name.split(" - ")[1]} />
                  <TitleName title="Dates Booked" list={datesBookedList} />
                  <TitleName title="Amount Paid" name={`$${payment.amount.paid}`} />
                </PaymentItem>
              )
            })}
          </ul>
        </section>
      )}

    <span>Total Paid: {totalPaid}</span>

    </main>
  );
}

export default Page;

const PaymentItem = ({ children }:
  {
    children: React.ReactNode;
  }) => {
  return (
    <li className="border border-black rounded flex flex-col p-2 gap-2 flex-grow shadow-[5px_3px_6px_#00000029]">{children}</li>
  )
}
const TitleName = ({ title, name, list }: {
  title: string;
  name: string;
  list?: never;
} | {
  title: string;
  name?: never;
  list: string[];
}
) => {
  return (
    <div className="flex gap-2">
      <h2 className="font-bold">{title}</h2>
      {list ? (
        <ul className="flex flex-col">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="">{name}</p>
      )}
    </div>
  )
}