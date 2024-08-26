import Button from "@/app/_components/Button";
import Dialog from "@/app/_components/Dialog/Dialog";
import { cn } from "@/utils";
import { TPdf, TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { DocumentPdfIcon } from "@sanity/icons";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export const BusinessCard = ({ business, ownerName, credits }: {
  business: TUserWithOptionalBusinessRef["business"];
  ownerName: string;
  credits: number;
}) => {
  return (
    <DashboardSection className="h-[514px]">
      {business?.logoUrl && (
        <BusinessSection className="flex justify-center">
          <Image src={business.logoUrl} alt={business.businessName} width={100} height={100} />
        </BusinessSection>
      )}

      <BusinessSection>
        <h1 className="text-3xl font-darker-grotesque text-title-color">{business?.businessName}</h1>
        <span className="font-segoe text-xl">{business?.industry}</span>
      </BusinessSection>
      <BusinessSection className="text-black flex flex-col gap-5">
        <div>
          <p className="text-xl font-segoe font-bold text-black">Owner Name:</p>
          <p className="font-segoe text-2xl">{ownerName}</p>
        </div>
        <div>
          <p className="text-xl font-segoe font-bold text-black">Instagram Handle:</p>
          <p className="font-segoe text-2xl">{business?.instagramHandle}</p>
        </div>
      </BusinessSection>
      <BusinessSection className="text-black border-none">
        <div>
          <p className="text-xl  font-segoe font-bold text-black">Credit Balance:</p>
          <p className="font-segoe text-2xl">${credits}</p>
        </div>

        {/* <div className=""></div> */}
      </BusinessSection>
    </DashboardSection >
  )
}

export const DashboardSection = ({ children, className }: React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode;
}) => {
  return (
    <section className={cn("max-w-[433px] w-full h-fit border rounded-3xl border-button-border-color shadow-md shadow-button-border-color", className)}>
      {children}
    </section>
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
        <p className="font-segoe text-2xl">{email}</p>
      </div>
      <div>
        <p className="text-xl font-segoe font-bold text-black">Phone:</p>
        <p className="font-segoe text-2xl">{phone}</p>
      </div>
      <div>
        <p className="text-xl font-segoe font-bold text-black">Dddress:</p>
        <p className="font-segoe text-2xl">{address}</p>
      </div>
    </DashboardSection>
  )
}

export const SupportingDocsCard = ({
  pdfs
}: {
  pdfs: TPdf[];
}) => {

  return (
    <DashboardSection className="py-5 px-3 flex flex-col gap-5">
      <h3 className="text-xl font-segoe font-bold text-black">Supporting Documents:</h3>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf._id} className="flex items-center justify-between">
            <a href={pdf.url} target="_blank" rel="noreferrer" className="font-segoe text-2xl flex items-center">
              <DocumentPdfIcon className="text-2xl" />
              <span>
                {pdf.originalFileName}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}



export const PaymentCard = ({ market, paymentId }: {
  market: {
    _id: string;
    name: string;
    dates: string[];
  }
  paymentId: string;
}) => {

  return (
    <li key={market._id} className="px-5 py-5 flex flex-wrap gap-8 border rounded-2xl justify-between border-button-border-color shadow-md shadow-button-border-color">

      <MarketSection title="Date">
        <ul className="flex flex-col gap-2">
          {market.dates.map(date => (
            <li key={date} className="flex items-center gap-2">
              <span>{date}</span>
            </li>
          ))}
        </ul>
      </MarketSection>
      <MarketSection title="Market Name">
        <span>{market.name}</span>
      </MarketSection>
      {/* <MarketSection title  */}
      <MarketSection title="Table">
        2
      </MarketSection>
      <MarketSection title="Amount Owing">
        $0
      </MarketSection>
      <MarketSection title="Booking Status">
        Reserved
      </MarketSection>
      <Button className="h-fit">
        <Link href={`/dashboard/bookings/${paymentId}`}>Review Booking</Link>
      </Button>
    </li>
  )
}

const MarketSection = ({ title, children }: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="flex flex-col gap-2">
      {title && <h3 className="font-darker-grotesque font-bold">{title}</h3>}
      {children}
    </section>
  )

}


