import { TPayment, getAllPayments } from "@/sanity/queries/admin/payments";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import { DateTime } from "luxon";
import Search from "@/app/dashboard/explore/_components/Search";
import { formatDateString } from "@/utils/helpers";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) => {
  noStore()

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

  const search = searchParams.search?.toLowerCase();

  const filterPayments = (paymentsArray: TPayment[]) => paymentsArray.filter((payment) => {
    if (!search) {
      return true;
    }

    const vendorBusinessName = payment.vendor.businessName?.toLowerCase() || "No Business";

    return vendorBusinessName.toLowerCase().includes(search)
      || payment.vendor.email.toLowerCase().includes(search)
      || payment.market.name.toLowerCase().includes(search)
      || payment._id.toLowerCase().includes(search)
      || payment.market.dates.map((date) => formatDateString(date)).join().toLowerCase().includes(search)
      || payment.items.map(({ date }) => formatDateString(date).toLowerCase()).includes(search);
  });

  return (
    <main className="flex flex-col px-10 py-10 gap-2 min-h-screen w-full">
      <header className="flex w-full justify-between">
        <h1 className="font-bold text-xl">Payments</h1>
        <Search urlForSearch="/admin/dashboard/payments" theme="light" placeholder="Find a Payment" />
      </header>
      {balancesOwedPayments.length > 0 && (
        <section className="">

          <FormTitleDivider title="Outstanding Balances" />
          <ul className="flex flex-col gap-2">
            {filterPayments(balancesOwedPayments).map((payment) => {
              const dateList = payment.items.map(({ date }) => {
                return formatDateString(date);
              });

              return (
                <PaymentItem key={payment._id}>
                  <div className="flex gap-5 justify-between">

                    <div className="flex flex-col">
                      <TitleName title="Vendor Name" name={payment.vendor.businessName} />
                      <TitleName title="Order Id" name={payment._id} />
                    </div>
                    <div className="flex flex-col">
                      <TitleName title="Market Name" name={payment.market.name.split(" - ")[0]} />
                      <TitleName title="Market Dates" name={payment.market.name.split(" - ")[1]} />
                    </div>
                  </div>
                  <TitleName title="Dates Booked" list={dateList} />
                  <div className="flex flex-col items-end">
                    <TitleName title="Amount Owing" name={`$${payment.amount.owed}`} />
                    <TitleName title="Due Date" name={formatDateString(payment.market.dates[0])} />
                  </div>
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
            {filterPayments(paymentHistory).map((payment) => {
              const datesBookedList = payment.items.map(({ date }) => {
                const [year, month, day] = date.split('-').map(Number);
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const newDate = DateTime.fromISO(formattedDate, { zone: 'America/Toronto' }).startOf('day');
                const formattedDateString = newDate.toFormat('EEE, MMM d, yyyy');
                return formattedDateString;
              });
              return (
                <PaymentItem key={payment._id}>
                  <div className="flex flex-col">
                    <TitleName title="Vendor Name" name={payment.vendor.businessName} />
                    <TitleName title="Order Id" name={payment._id} />
                  </div>                  <div className="flex flex-col">
                    <TitleName title="Market Name" name={payment.market.name.split(" - ")[0]} />
                    <TitleName title="Market Dates" name={payment.market.name.split(" - ")[1]} />
                  </div>
                  <TitleName title="Dates Booked" list={datesBookedList} />
                  <TitleName title="Amount Paid" name={`$${payment.amount.paid}`} />
                </PaymentItem>
              )
            })}
          </ul>
        </section>
      )}
    </main>
  );
}

export default Page;

const PaymentItem = ({ children }:
  {
    children: React.ReactNode;
  }) => {
  return (
    <li className="border border-black rounded flex flex-wrap p-2 gap-2 flex-grow justify-between shadow-[5px_3px_6px_#00000029]">{children}</li>
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