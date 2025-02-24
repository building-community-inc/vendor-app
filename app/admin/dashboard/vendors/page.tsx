import { getAllVendors } from "@/sanity/queries/admin/vendors";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import Button from "@/app/_components/Button";
import { setUserStatus } from "./actions";
import Link from "next/link";
import Search from "@/app/dashboard/explore/_components/Search";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import VendorFilters from "./VendorFilters";



const Page = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) => {
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
      <header className="flex flex-col w-full p-5 gap-2 sticky top-0 left-0 bg-background z-1">
        <div className="flex gap-5 items-center">
          <h1 className="font-segoe font-bold text-3xl text-center">Vendors</h1>
          <Search urlForSearch="/admin/dashboard/vendors" theme="light" placeholder="Find a Vendor" />
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
      <section className="flex items-center justify-between gap-2 flex-grow flex-col w-full lg:flex-row">
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
        {vendor.status === "pending" ? (
          <>
            <form action={setUserStatus}>
              <input type="hidden" name="vendorId" value={vendor._id} />
              <input type="hidden" name="status" value={"approved"} />
              <Button className="bg-green-300 border border-green-400 transition-all">Approve</Button>
            </form>
            <form action={setUserStatus}>
              <input type="hidden" name="vendorId" value={vendor._id} />
              <input type="hidden" name="status" value={"not-approved"} />
              <Button className="bg-red-500 border border-red-500 transition-all">Don't Approve</Button>
            </form>
          </>
        ) : (
          <>
            {vendor.status === "suspended" ? (
              <form action={setUserStatus}>
                <input type="hidden" name="vendorId" value={vendor._id} />
                <input type="hidden" name="status" value={"approved"} />
                <Button className="bg-green-300 border border-green-400 transition-all">Reactivate</Button>
              </form>
            ) : (
              <form action={setUserStatus}>
                <input type="hidden" name="vendorId" value={vendor._id} />
                <input type="hidden" name="status" value={"suspended"} />
                <Button className="bg-red-200">Suspend</Button>
              </form>
            )}
            {vendor.status === "not-approved" && (
              <>
                <form action={setUserStatus}>
                  <input type="hidden" name="vendorId" value={vendor._id} />
                  <input type="hidden" name="status" value={"approved"} />
                  <Button className="bg-green-300 border border-green-400 transition-all">Approve</Button>
                </form>
                <form action={setUserStatus}>
                  <input type="hidden" name="vendorId" value={vendor._id} />
                  <input type="hidden" name="status" value={"pending"} />
                  <Button className="bg-red-200">Set as Pending</Button>
                </form>
              </>
            )}
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