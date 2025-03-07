"use client";
import { PaymentRecordCard } from "@/app/dashboard/_components/profileComps/PaymentRecordCard";
import { TUserMarket } from "@/sanity/queries/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const VendorPayments = ({ vendorPaymentRecords, admin }: {
  vendorPaymentRecords: TUserMarket[];
  admin?: boolean;
}) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "reserved";

  const onFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    if (filter === "reserved") {
      router.push(pathname, { scroll: false });
    } else {
      router.push(`${pathname}?filter=${filter}`, { scroll: false });
    }
  };

  const filteredVendorPaymentRecords = vendorPaymentRecords.filter(paymentRecord => {
    if (filter === "cancelled") {
      return paymentRecord.paymentReturned;
    } else if (filter === "reserved") {
      return !paymentRecord.paymentReturned;
    } else {
      return true;
    }
  });

  return (
    <section className="flex flex-col gap-2">
      <header className="border-b-2 border-black w-full">
        <h2 className="text-2xl font-bold font-darker-grotesque text-black">Market Bookings</h2>
      </header>
      <div>
        <select
          onChange={onFilterChange}
          className="border-2 border-black rounded-md px-2 py-1"
        >
          <option value="reserved">Reserved</option>
          <option value="cancelled">Cancelled</option>
          <option value="all">All</option>
        </select>
      </div>
      <ul className="flex flex-col gap-5">
        {filteredVendorPaymentRecords.map(paymentRecord => (
          <PaymentRecordCard
            admin={admin}
            returned={paymentRecord.paymentReturned}
            payments={paymentRecord.payments}
            amount={paymentRecord.amount}
            paymentId={paymentRecord._id}
            key={paymentRecord._id}
            market={paymentRecord.market}
            items={paymentRecord.items}
            status={paymentRecord.status}
          />
        ))}
      </ul>
    </section>
  );
}

export default VendorPayments;