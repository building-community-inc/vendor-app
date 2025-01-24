import Button from "@/app/_components/Button";
import { TAmount, TPayment, TTableItem } from "@/sanity/queries/user";
import { cn } from "@/utils";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import Image from "next/image";
import Link from "next/link";
import { ComponentPropsWithoutRef, useRef } from "react";
import { DateTime } from "luxon";

export const BusinessCard = ({ business, ownerName, credits }: {
  business: TUserWithOptionalBusinessRef["business"];
  ownerName: string;
  credits: number;
}) => {
  return (
    <DashboardSection className="h-fit">
      {business?.logoUrl && (
        <BusinessSection className="flex justify-center">
          <Image src={business.logoUrl} alt={business.businessName} width={100} height={100} />
        </BusinessSection>
      )}

      <BusinessSection>
        <h1 className="text-3xl font-darker-grotesque text-title-color md:text-4xl">{business?.businessName}</h1>
        <span className="font-segoe text-xl md:text-2xl">{business?.industry}</span>
      </BusinessSection>
      <BusinessSection className="text-black flex flex-col gap-5">
        <div>
          <p className="text-xl font-segoe font-bold text-black md:text-2xl">Owner Name:</p>
          <p className="font-segoe text-2xl md:text-3xl">{ownerName}</p>
        </div>
        <div>
          <p className="text-xl font-segoe font-bold text-black md:text-2xl">Instagram Handle:</p>
          <p className="font-segoe text-base">{business?.instagramHandle}</p>
        </div>
      </BusinessSection>
      <BusinessSection className="text-black border-none">
        <div>
          <p className="text-xl  font-segoe font-bold text-black md:text-2xl">Credit Balance:</p>
          <p className="font-segoe text-xl">${credits}</p>
        </div>
      </BusinessSection>
    </DashboardSection >
  )
}

export const DashboardSection = ({ children, className }: React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
}) => {
  return (
    <section className={cn("max-w-[433px] w-full h-fit border rounded-3xl bg-white border-button-border-color shadow-md shadow-button-border-color", className)}>
      {children}
    </section>
  )
}

export const DateOfAcceptance = ({ date }: { date: string | null | undefined }) => {
  if (!date) return (
    <DashboardSection className="py-5 px-3 flex flex-col gap-5">
      <span>Vendor has not accepted terms</span>
    </DashboardSection>
  );

  const formattedDate = DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL);

  return (
    <DashboardSection className="py-5 px-3 flex flex-col gap-5">
      <span className="font-semibold">Vendor accepted terms on:</span>
      <span>{formattedDate}</span>
    </DashboardSection>
  )
}

export const BusinessSection = ({ children, className }: React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
}) => {
  return (
    <section className={cn("w-full border-b py-5 px-3 border-button-border-color", className)}>

      {children}
    </section>
  )
}

export const ContactCard = ({ email, phone, address }: {
  email: string;
  phone: string;
  address: string;
}) => {
  return (
    <DashboardSection className="py-5 px-3 flex flex-col gap-5">
      <div>
        <p className="text-xl font-segoe font-bold text-black">Email:</p>
        <p className="font-segoe text-base">{email}</p>
      </div>
      <div>
        <p className="text-xl font-segoe font-bold text-black">Phone:</p>
        <p className="font-segoe text-base">{phone}</p>
      </div>
      <div>
        <p className="text-xl font-segoe font-bold text-black">Address:</p>
        <p className="font-segoe text-base">{address}</p>
      </div>
    </DashboardSection>
  )
}


export const PaymentRecordCard = ({ market, paymentId, items, amount, admin }: {
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
        Reserved
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


