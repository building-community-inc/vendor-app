import Button from "@/app/_components/Button";
import { TAmount, TPayment, TTableItem } from "@/sanity/queries/user";
import { cn } from "@/utils";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export const PaymentRecordCard = ({ market, paymentId, items, amount, admin, returned }: {
  market: {
    _id: string;
    name: string;
    dates: string[];
  }
  paymentId: string;
  items: TTableItem[];
  amount: TAmount;
  payments: TPayment[];
  admin?: boolean;
  returned?: boolean | undefined | null;
}) => {

  return (
    <li key={market._id} className="px-5 py-5 flex flex-wrap gap-8 border rounded-2xl justify-between border-button-border-color shadow-md shadow-button-border-color">

      <MarketSection title="Date">
        <ul className="flex flex-col gap-2">
          {items.map(date => (
            <li key={date.date} className="flex items-center gap-2">
              <span>{date.date}</span>
            </li>
          ))}
        </ul>
      </MarketSection>
      <MarketSection title="Venue" className="flex-1">
        {admin ? (
          <Link href={`/admin/dashboard/markets/${market._id}`} target="_blank" rel="noreferrer">
            <span>{market.name}</span>
          </Link>
        ) : (
          <span>{market.name}</span>
        )}

      </MarketSection>
      {/* <MarketSection title  */}
      <MarketSection title="Table">
        {/* {market.} */}
        {items.map(item => (
          <TableItem key={item.tableId} item={item} />
        ))}
      </MarketSection>
      <MarketSection title="Amounts">
        {amount.owed && amount.owed > 0 && (
          <>
            <p>Owed: ${amount.owed} </p>
            <p>Paid: ${amount.paid} </p>
          </>
        )}
        <p>Hst: ${amount.hst} </p>
        <p>Total: ${amount.total} </p>
      </MarketSection>
      <MarketSection title="Booking Status">
        {returned ? "Cancelled" : "Reserved"}
      </MarketSection>
      <section className="grid gap-5">
        <Button className="h-fit ">
          <Link className="text-center" href={`/dashboard/bookings/${paymentId}`}>Review Booking</Link>
        </Button>
        {amount.owed ? amount.owed > 0 && (
          <Button className="h-fit">
            <Link href={`/dashboard/checkout/${paymentId}/pay-remainder/`}>Pay Remainder</Link>
          </Button>
        ) : undefined}

        {admin && (
          <Link href={`/studio/structure/paymentRecord;${paymentId}`} target="_blank" rel="noreferrer">
            <p>
              <strong>
                ID:
              </strong>
              {` ${paymentId}`}
            </p>
          </Link>
        )}

      </section>
    </li>
  )
}

const TableItem = ({ item }: {
  item: TTableItem;
}) => {
  // const dialogRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex items-center gap-2">
      {/* <span>{item.tableId}</span> */}
      {/* <Button onClick={() => dialogRef.current?.click()}>View</Button> */}
      <div className="flex" >
        {/* <p>{item.date}</p> */}
        <p>{item.tableId}</p>
        {/* <p>Price: ${item.price}</p> */}
      </div>
    </div>
  )
}

const MarketSection = ({ title, children, className = "", ...rest }: ComponentPropsWithoutRef<"section"> & {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className={cn("flex flex-col gap-2", className)} {...rest}>
      {title && <h3 className="font-darker-grotesque font-bold">{title}</h3>}
      {children}
    </section>
  )

}


