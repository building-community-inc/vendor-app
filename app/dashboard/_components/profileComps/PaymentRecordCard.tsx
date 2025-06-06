import Button from "@/app/_components/Button";
import { TAmount, TPayment, TTableItem } from "@/sanity/queries/user";
import { cn } from "@/utils";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export const PaymentRecordCard = ({
  market,
  paymentId,
  items,
  amount,
  admin,
  returned,
  payments,
  status,
}: {
  market: {
    _id: string;
    name: string;
    dates: string[];
  };
  paymentId: string;
  items: TTableItem[];
  amount: TAmount;
  payments?: TPayment[] | null | undefined;
  admin?: boolean;
  returned?: boolean | undefined | null;
  status?: "pending" | "approved" | "cancelled" | string | undefined | null;
}) => {
  return (
    <li
      key={market._id}
      className="px-5 py-5 flex gap-5 flex-col border rounded-2xl justify-between border-button-border-color shadow-md shadow-button-border-color"
    >
      <div className="flex gap-8 flex-wrap">
        <MarketSection title="Date">
          <ul className="flex flex-col gap-2">
            {items.map((date, index) => (
              <li
                key={`${market._id}-${paymentId}-date-${date.date}-${date.tableId}-${index}`}
                className="flex items-center gap-2"
              >
                <span>{date.date}</span>
              </li>
            ))}
          </ul>
        </MarketSection>
        <MarketSection title="Venue" className="flex-1">
          {admin ? (
            <Link
              href={`/admin/dashboard/markets/${market._id}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>{market.name}</span>
            </Link>
          ) : (
            <span>{market.name}</span>
          )}
        </MarketSection>
        {/* <MarketSection title  */}
        <MarketSection title="Table">
          {/* {market.} */}
          {items.map((item) => (
            <TableItem
              key={`${market._id}-table-${item.tableId}-date-${item.date}`}
              item={item}
            />
          ))}
        </MarketSection>
        <MarketSection title="Amounts">
          <ul className="flex flex-col gap-2">
            {items.map((date, index) => (
              <li key={`amounts-${date.date}-${index}`}>${date.price}</li>
            ))}
          </ul>
        </MarketSection>
      </div>
      <div className="flex gap-8 flex-wrap justify-between">
        <div className="flex gap-8 flex-wrap">
          <MarketSection title="Booking Status">
            {returned ? "Cancelled" : status || "paid"}
          </MarketSection>
          {payments && payments.length > 0 && (
            <MarketSection title="Payments">
              <ul>
                {payments?.map((payment, index) => (
                  <li key={`payment-${payment.amount}-${index}`} className="">
                    <p>
                      {index + 1}.{" "}
                      {payment.paymentType
                        ? payment.paymentType
                        : payment.stripePaymentIntentId
                        ? "stripe"
                        : ""}{" "}
                      ${payment.amount}
                    </p>
                  </li>
                ))}
              </ul>
            </MarketSection>
          )}
          <MarketSection title="Totals" className="">
            <p>HST: {amount.hst}</p>
            <p>Subtotal: {amount.total}</p>
            {amount.paid ? <p>Total: {amount.paid}</p> : ""}
            {amount.owed ? <p>Owed: {amount.owed}</p> : ""}
          </MarketSection>
        </div>
        <section className="grid gap-5">
          {status === "pending" && (
            <Link
              className="text-center"
              href={`/dashboard/e-transfer-info/${paymentId}`}
            >
              <Button className="h-fit ">View Payment Information</Button>
            </Link>
          )}
          {status === "paid" && (
            <Link
              className="text-center"
              href={`/dashboard/bookings/${paymentId}`}
            >
              <Button className="h-fit ">Review Booking</Button>
            </Link>
          )}
          {/* {amount.owed ? amount.owed > 0 && (
            <Button className="h-fit">
              <Link href={`/dashboard/checkout/${paymentId}/pay-remainder/`}>Pay Remainder</Link>
            </Button>
          ) : undefined} */}

          {admin && (
            <Link
              href={`/studio/structure/paymentRecord;${paymentId}`}
              target="_blank"
              rel="noreferrer"
            >
              <p>
                <strong>ID:</strong>
                {` ${paymentId}`}
              </p>
            </Link>
          )}
        </section>
      </div>
    </li>
  );
};

const TableItem = ({ item }: { item: TTableItem }) => {
  // const dialogRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex items-center gap-2">
      {/* <span>{item.tableId}</span> */}
      {/* <Button onClick={() => dialogRef.current?.click()}>View</Button> */}
      <div className="flex">
        {/* <p>{item.date}</p> */}
        <p>{item.tableId}</p>
        {/* <p>Price: ${item.price}</p> */}
      </div>
    </div>
  );
};

const MarketSection = ({
  title,
  children,
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"section"> & {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className={cn("flex flex-col gap-2", className)} {...rest}>
      {title && <h3 className="font-darker-grotesque font-bold">{title}</h3>}
      {children}
    </section>
  );
};
