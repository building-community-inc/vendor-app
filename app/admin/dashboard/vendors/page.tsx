import { getAllVendors } from "@/sanity/queries/admin/vendors";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import Button from "@/app/_components/Button";
import Link from "next/link";
import Search from "@/app/dashboard/explore/_components/Search";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import VendorFilters from "./VendorFilters";
import StatusUpdateButton from "./StatusUpdateButton";



const Page = async (
  props: {
    searchParams: Promise<{
      [key: string]: string | undefined;
    }>;
  }
) => {
  const searchParams = await props.searchParams;
  noStore()
  const vendors = await getAllVendors();

  if (!vendors) {
    return null;
  }
  const pendingVendors = vendors.filter(vendor => vendor.status === 'pending');
  const otherVendors = vendors.filter(vendor => vendor.status !== 'pending');

  const search = searchParams.search?.toLowerCase();
  const selectedVendorStatus = searchParams.vendorStatus;

  const filterVendors = (arrayVendors: TUserWithOptionalBusinessRef[]) => arrayVendors.filter((vendor) => {
    if (selectedVendorStatus && selectedVendorStatus !== 'all' && vendor.status !== selectedVendorStatus) {
      return false;
    }

    if (!search) {
      return true;
    }

    const vendorBusinessName = vendor.business?.businessName.toLowerCase() || "No Business";

    return vendorBusinessName.toLowerCase().includes(search) || vendor.email.toLowerCase().includes(search) || vendor.firstName.toLowerCase().includes(search) || vendor.lastName.toLowerCase().includes(search) || vendor.status.toLowerCase().includes(search);
  });

  const vendorStatuses = new Set();
  vendors.forEach(vendor => {
    vendorStatuses.add(vendor.status)
  })

  return (
    <main className="pt-0 w-full min-h-screen mx-auto relative bg-background">
      <header className="flex flex-col w-full px-5 py-2 gap-2 sticky top-0 left-0 bg-background z-1">
        <div className="pl-10 lg:pl-0 flex gap-5 items-center">
          <h1 className="font-segoe font-bold text-3xl text-center">Vendors</h1>
          <div className="flex-grow">
            <Search urlForSearch="/admin/dashboard/vendors" theme="light" placeholder="Find a Vendor" />
          </div>
        </div>
        <VendorFilters vendorStatuses={[...vendorStatuses] as string[]} />
      </header>
      <section className="px-5 pt-5">

        <FormTitleDivider title="Pending Vendors" />

        <ul className="flex gap-5 flex-col mb-10 mt-2">
          {filterVendors(pendingVendors)?.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </ul>
        <FormTitleDivider title="Vendors" />
        <ul className="flex gap-5 flex-col mt-2">
          {filterVendors(otherVendors)?.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Page;



const VendorCard = ({ vendor }: {
  vendor: TUserWithOptionalBusinessRef
}) => {
  return (
    <li className="border-b border-black pb-5 w-content flex-grow flex flex-col items-center justify-between gap-10">
      <section className="flex flex-wrap items-center justify-between gap-2 flex-grow flex-col w-full lg:flex-row">
        {vendor.business ? (
          <CardItem title="Business:" value={vendor.business.businessName} />
        ) : (
          <CardItem value={"No Business"} />
        )}
        <CardItem title="Contact:" value={`${vendor.firstName} ${vendor.lastName}`} />
        <CardItem title="Email:" value={vendor.email} />
        <CardItem title="Instagram:" value={vendor.business?.instagramHandle || "no handle"} />

        <CardItem title="Status:" value={vendor.status} />
      </section>

      <section className="flex flex-wrap justify-center gap-2 items-center">
        {vendor.status === "pending" && (
          <>
            <StatusUpdateButton
              vendorId={vendor._id}
              status="approved"
              buttonText="Approve"
              pendingText="Approving..."
              buttonClassName="bg-green-300 border border-green-400 transition-all"
            />
            <StatusUpdateButton
              vendorId={vendor._id}
              status="archived"
              buttonText="Archive"
              pendingText="Archiving..."
              buttonClassName="bg-red-500 border border-red-500 transition-all"
            />
          </>
        )}

        {vendor.status === "suspended" && (
          <StatusUpdateButton
            vendorId={vendor._id}
            status="approved"
            buttonText="Reactivate"
            pendingText="Reactivating..."
            buttonClassName="bg-green-300 border border-green-400 transition-all"
          />
        )}

        {vendor.status !== "pending" && vendor.status !== "suspended" && (
          <>
            {vendor.status !== "archived" && (
              <StatusUpdateButton
                vendorId={vendor._id}
                status="suspended"
                buttonText="Suspend"
                pendingText="Suspending..."
                buttonClassName="bg-red-200"
              />
            )}
            {vendor.status !== "archived" && (
              <StatusUpdateButton
                vendorId={vendor._id}
                status="archived"
                buttonText="Archive"
                pendingText="Archiving..."
                buttonClassName="bg-red-500 border border-red-500 transition-all"
              />
            )}
          </>
        )}

        {vendor.status === "archived" && (
          <>
            <StatusUpdateButton
              vendorId={vendor._id}
              status="approved"
              buttonText="Approve"
              pendingText="Approving..."
              buttonClassName="bg-green-300 border border-green-400 transition-all"
            />
            <StatusUpdateButton
              vendorId={vendor._id}
              status="pending"
              buttonText="Set as Pending"
              pendingText="Setting as Pending..."
              buttonClassName="bg-red-200"
            />
          </>
        )}

        <Link href={`/admin/dashboard/vendors/${vendor._id}`}>
          <Button className="whitespace-nowrap bg-white border-none hover:text-blue-800 transition-all">
            View Vendor
          </Button>
        </Link>
      </section>
    </li>
  )
}

const CardItem = ({ title, value }: {
  title?: string;
  value: string;
}) => {
  return (
    <div className="flex gap-[1ch] self-start">
      {title && <strong>{title}</strong>}
      <p>{value}</p>
    </div>
  )
}