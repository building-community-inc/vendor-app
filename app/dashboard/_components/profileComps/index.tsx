import { cn } from "@/utils";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import Image from "next/image";
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




