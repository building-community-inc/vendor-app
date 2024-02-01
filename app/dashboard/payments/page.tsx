import FormTitleDivider from "@/app/admin/dashboard/_components/FormTitleDivider";
import {
  getAllUserPaymentsById,
  getSanityUserByEmail,
} from "@/sanity/queries/user";
import { buildOrderUrl, formatMarketDate } from "@/utils/helpers";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { TPaymentItem } from "../checkout/success/api/route";
import PaymentNotification from "./_components/PaymentNotification";
import PayNow from "./_components/PayNow";

const DAYS_FOR_PAYMENT = 60;
const PaymentsPage = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (!user) {
    return null;
  }

  const userPayments = await getAllUserPaymentsById(user._id);

  // userPayments[0].items;
  // console.log({ userPayments })
  if (!userPayments || userPayments.length === 0) {
    return null
  }

  const sortedBookedItems = (items: TPaymentItem[]) => {
    return items.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }

  const owedPayments = userPayments.filter((order) => order.amount.owed > 0).sort((a, b) => {
    const nextDateA = new Date(sortedBookedItems(a.items)[0].date);
    const nextDateB = new Date(sortedBookedItems(b.items)[0].date);
    return nextDateA.getTime() - nextDateB.getTime();
  });;

  const paidPayments = userPayments.filter((order) => order.amount.owed === 0);
  const calculateDueDate = (date: string, days: number) => {
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() - days);
    return dueDate;
  }
  const calculateDaysUntil = (dueDate: Date) => {
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  return (
    <main className="overflow-x-auto flex flex-col pt-20 px-10 gap-10 min-h-screen w-full text-xs sm:text-sm md:text-base">
      <h1 className="font-bold text-xl">Payments</h1>
      {owedPayments.length > 0 && (
        <PaymentNotification days={calculateDaysUntil(calculateDueDate(sortedBookedItems(owedPayments[0].items)[0].date, DAYS_FOR_PAYMENT))} />
      )}
      <section className="w-full">
        <FormTitleDivider title="Balances Owing" />
        {owedPayments?.map((order) => {


          const dueDate = order.amount.owed > 0 ? new Date(sortedBookedItems(order.items)[0].date) : null;
          if (dueDate) {
            dueDate.setDate(dueDate.getDate() - DAYS_FOR_PAYMENT);
          }

          return (
            <ul key={order._id} className="border-b border-secondary-admin-border py-2 flex">
              <li className="flex w-full">
                <section className="flex-grow flex flex-wrap gap-4">
                  <PaymentItem title="Id" paragraph={order._id} />
                  <PaymentItem title="Date" paragraph={formatMarketDate(order.createdAt)} />
                  {/*  */}
                  <PaymentItem title="Market Name" paragraph={order.market.name} />

                  <PaymentItem title="Dates Booked" paragraphs={sortedBookedItems(order.items).map((item, index) => `${formatMarketDate(item.date)} - Table: ${item.tableId} ${index < order.items.length - 1 ? ',' : ''}`)} />

                  <PaymentItem title="Payments" paragraphs={order.payments.map((payment, index) => `$${payment.amount} on ${formatMarketDate(payment.paymentDate)} ${index < order.payments.length - 1 ? ',' : ''}`)} />

                  <PaymentItem title="Amounts" paragraphs={[
                    `Amount Owing: $${order.amount.owed}`,
                    `Amount Paid: $${order.amount.paid}`,
                    `Total: $${order.amount.total}`
                  ]} />

                  {dueDate && (
                    <PaymentItem title="Due Date" paragraph={formatMarketDate(dueDate)} />
                  )}

                </section>
                <section className="flex items-center px-2 w-fit">
                  {/* <strong>Actions:</strong> */}
                  {order.amount.owed > 0 && (

                    <PayNow userPayment={order} />
                  )}
                  {/* <Link href={buildOrderUrl("http://localhost:3000", order.payments[0].stripePaymentIntentId)}>
                    <button className="py-1 bg-secondary text-black font-bold rounded-md">Email My Receipt</button>
                  </Link> */}
                </section>
              </li>
            </ul>
          )
        })}
      </section>
      <section className="w-full">
        <FormTitleDivider title="Payment History" />
        {paidPayments?.map((order) => {


          const dueDate = order.amount.owed > 0 ? new Date(sortedBookedItems(order.items)[0].date) : null;
          if (dueDate) {
            dueDate.setDate(dueDate.getDate() - 30);
          }

          return (
            <ul key={order._id} className="border-b border-secondary-admin-border py-2 flex">
              <li className="flex w-full">
                <section className="flex-grow flex flex-wrap gap-4">
                  <PaymentItem title="Id" paragraph={order._id} />
                  <PaymentItem title="Date" paragraph={formatMarketDate(order.createdAt)} />
                  {/*  */}
                  <PaymentItem title="Market Name" paragraph={order.market.name} />

                  <PaymentItem title="Dates Booked" paragraphs={sortedBookedItems(order.items).map((item, index) => `${formatMarketDate(item.date)} - Table: ${item.tableId} ${index < order.items.length - 1 ? ',' : ''}`)} />

                  <PaymentItem title="Payments" paragraphs={order.payments.map((payment, index) => `$${payment.amount} on ${formatMarketDate(payment.paymentDate)} ${index < order.payments.length - 1 ? ',' : ''}`)} />

                  <PaymentItem title="Amounts" paragraphs={[
                    `Amount Owing: $${order.amount.owed}`,
                    `Amount Paid: $${order.amount.paid}`,
                    `Total: $${order.amount.total}`
                  ]} />

                  {dueDate && (
                    <PaymentItem title="Due Date" paragraph={formatMarketDate(dueDate)} />
                  )}

                </section>
                <section className="grid place-content-center gap-2">
                  {/* <Link href={buildOrderUrl("http://localhost:3000", order.payments[0].stripePaymentIntentId)}> */}
                  <Link href={`/dashboard/checkout/create-later-payment-intent/success?paymentId=${order._id}`}>
                    <button className="flex-shring-0 px-2 py-1 bg-secondary text-black font-bold rounded-md">View Payment</button>
                  </Link>
                </section>
              </li>
            </ul>
          )
        })}
      </section>
    </main>
  );
};

export default PaymentsPage;

const PaymentItem = ({ title, paragraph, paragraphs }: {
  title: string;
  paragraph?: string;
  paragraphs?: string[];
}) => {
  return (
    <section className="align-top w-fit h-fit">
      <PaymentContent title={title}>
        {paragraph && (
          <p className="whitespace-nowrap">
            {paragraph}
          </p>
        )}
        {paragraphs && (
          <ul className="list-inside">
            {paragraphs.map((paragraph, index) => (
              <li key={index}>
                {paragraph}
              </li>
            ))}
          </ul>

        )}

      </PaymentContent>
    </section>
  )
}
const PaymentContent = ({ title, children }: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="">
      <h3 className="font-bold">
        {title}
      </h3>
      {children}
    </section>
  )
}