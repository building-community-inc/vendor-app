import { TPayment, getAllPayments } from "@/sanity/queries/admin/payments";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import Search from "@/app/dashboard/explore/_components/Search";
import { formatDateString, formatDateWLuxon } from "@/utils/helpers";
import ChangePaymentStatus from "./ChangePaymentStatus";
import CancelPayment from "./CancelPayment";
import Link from "next/link";
import StatusFilter from "./StatusFilter";
import GeneralFilters from "./GeneralFilters";

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
    (payment) => (payment.amount.owed ?? 0) > 0
  );

  const paymentHistory = allPayments.filter(
    (payment) => payment.amount.owed === 0
  );

  const search = searchParams.search?.toLowerCase();
  const statusFilter = (paymentsArray: TPayment[], filterName: string) => paymentsArray.filter((payment) => {
    const filter = searchParams[filterName];
    const status = payment.status || "paid"
    if (!filter || filter === "all") {
      return true;
    }

    return status === searchParams[filterName]
  });

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

  const filteredBalances = statusFilter(filterPayments(balancesOwedPayments), "balanceStatus");
  const balancesStatuses = balancesOwedPayments.map(payment => payment.status || "paid");
  const singleBalanceStatuses = [...new Set(balancesStatuses)];

  const filteredHistory = statusFilter(filterPayments(paymentHistory), "history");
  const historyStatuses = paymentHistory.map(payment => payment.status || "paid");
  const singleHistoryStatuses = [...new Set(historyStatuses)];
  const selectBalances = searchParams["select-balances"];
  const selectHistory = searchParams["select-history"];
  const selectAll = !selectBalances && !selectHistory

  return (
    <main className="flex flex-col px-10 py-10 gap-2 min-h-screen w-full">
      <header className="flex flex-col gap-2">
        <div className="flex w-full justify-between items-center gap-2">
          <h1 className="font-bold text-xl">Payments</h1>
          <div className="flex-grow">
            <Search urlForSearch="/admin/dashboard/payments" theme="light" placeholder="Find a Payment" />
          </div>
        </div>
        <GeneralFilters />
      </header>
      {(selectBalances || selectAll) && filteredBalances.length > 0 && (
        <section className="flex flex-col gap-2">

          <FormTitleDivider title="Outstanding Balances" />
          {singleBalanceStatuses && singleBalanceStatuses.length > 0 && <StatusFilter filterName="balanceStatus" statuses={singleBalanceStatuses} />}
          <ul className="flex flex-col gap-2">
            {filteredBalances.map((payment) => {
              const datesBookedList = payment.items.map(({ date }) => formatDateWLuxon(date));

              return (
                <PaymentItem key={payment._id} datesBookedList={datesBookedList} payment={payment} />

              )
            })}
          </ul>
        </section>
      )}
      {(selectHistory || selectAll) && filteredHistory.length > 0 && (
        <section className="flex flex-col mt-10 gap-2">
          <FormTitleDivider title="Payment History" />
          {singleHistoryStatuses && singleHistoryStatuses.length > 0 && <StatusFilter filterName="history" statuses={singleHistoryStatuses} />}

          <ul className="flex flex-wrap gap-2">
            {filteredHistory.map((payment) => {
              const datesBookedList = payment.items.map(({ date }) => formatDateWLuxon(date));
              return (
                <PaymentItem key={payment._id} datesBookedList={datesBookedList} payment={payment} />
              )
            })}
          </ul>
        </section>
      )}
    </main>
  );
}

export default Page;

const PaymentItem = ({ payment, datesBookedList }:
  {
    payment: TPayment;
    datesBookedList: string[];
  }) => {
  return (
    <li className="border border-black rounded flex flex-wrap p-2 gap-2 flex-grow justify-between shadow-[5px_3px_6px_#00000029]">  <div className="flex flex-col">
      <Link href={`/admin/dashboard/vendors/${payment.vendor._id}`} target="_blank">
        <TitleNameTest title="Vendor Name" name={payment.vendor.businessName} />
      </Link>
      <TitleNameTest title="Order Id" name={payment._id} />
    </div>
      <div className="flex flex-col">
        <TitleNameTest title="Market Name" name={payment.market.name.split(" - ")[0]} />
        <TitleNameTest title="Market Dates" name={payment.market.dates.map(date => formatDateWLuxon(date)).join(", ")} />
      </div>
      <TitleNameTest title="Dates Booked" list={datesBookedList} />
      <TitleNameTest title="Amount Paid" name={`$${payment.amount.paid}`} />
      <div className="flex flex-col items-end">
        <TitleNameTest title="Status" name={payment.status || "paid"} />
      </div>
      {payment.payments && payment.payments.length > 0 && (
        <div className="flex flex-col">
          <strong>Payments:</strong>
          <ul>
            {payment.payments?.map((payment, index) => (
              <li key={`payment-${payment.amount}-${index}`} className="">
                <p>
                  {index + 1}. {payment.paymentType ? payment.paymentType : payment.stripePaymentIntentId ? "stripe" : ""} ${payment.amount}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-5 w-full">
        {payment.status === "pending" && (
          <ChangePaymentStatus
            marketName={payment.market.name}
            amountPaid={payment.amount.owed || 0}
            paymentRecordId={payment._id}
            status={payment.status || "paid"}
            contactName={`${payment.vendor.firstName} ${payment.vendor.lastName}`}
            vendorName={payment.vendor.businessName}
          />
        )}
        {payment.amount.paid > 0 && payment.status !== "cancelled" && (
          <CancelPayment paymentRecordId={payment._id} amountPaid={payment.amount.paid} />
        )}
      </div>
    </li>
  )
}
const TitleNameTest = ({ title, name, list }: {
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
