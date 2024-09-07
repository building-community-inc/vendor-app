import { getAllVendors } from "@/sanity/queries/admin/vendors";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import Button from "@/app/_components/Button";
import { setUserStatus } from "./actions";
import Link from "next/link";
import Search from "@/app/dashboard/explore/_components/Search";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";



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

  const filterVendors = (arrayVendors: TUserWithOptionalBusinessRef[]) => arrayVendors.filter((vendor) => {
    if (!search) {
      return true;
    }

    const vendorBusinessName = vendor.business?.businessName.toLowerCase() || "No Business";

    return vendorBusinessName.toLowerCase().includes(search) || vendor.email.toLowerCase().includes(search) || vendor.firstName.toLowerCase().includes(search) || vendor.lastName.toLowerCase().includes(search) || vendor.status.toLowerCase().includes(search);
  });

  return (
    <main className="pt-0 w-full min-h-screen mx-auto relative">
      <header className="flex w-full justify- p-5 gap-5 sticky top-0 left-0 bg-white z-1">
        <h1 className="font-segoe font-bold text-3xl">Vendors</h1>
        <Search urlForSearch="/admin/dashboard/vendors" theme="light" placeholder="Find a Vendor" />
      </header>
      <section className="px-5 pt-5">

        <FormTitleDivider title="Pending Vendors" />

        <ul className="flex gap-5 flex-col mb-10 mt-2">
          {filterVendors(pendingVendors)?.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </ul>
        <FormTitleDivider title="Vendors" />
        <ul className="flex gap-5 flex-wrap mt-2">
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
    <li className="border-b border-black pb-5 w-content flex-grow flex items-center justify-between gap-10">
      <section className="flex items-center justify-between gap-2 flex-grow">
        <div className="flex-grow gap-5 flex items-center justify-between">
          <div className="flex-grow flex justify-between">

            <div className="w-fit flex gap-2 flex-wrap">

              {vendor.business ? (
                <>
                  <strong>Business</strong>
                  <h2> {vendor.business.businessName}</h2>
                </>
              ) : (
                <h2 className="text-red-700">No Business</h2>
              )}
            </div>
            <div className="w-fit justify-between flex gap-2 flex-wrap">
              <h3><strong>Contact:</strong> {vendor.firstName} {vendor.lastName}</h3>

              <p><strong>Email: </strong>{vendor.email}</p>
            </div>
          </div>
          <p className="capitalize"><strong>status:</strong> {vendor.status}</p>
        </div>
      </section>

      <section className="flex flex-col justify-center gap-2 items-center">

        {vendor.status === "pending" ? (

          <form action={setUserStatus}>
            <input type="hidden" name="vendorId" value={vendor._id} />
            <input type="hidden" name="status" value={"approved"} />
            <Button className="bg-green-300 border border-green-400 transition-all">approve</Button>
          </form>
        ) : (
          <>
            {vendor.status === "suspended" ? (
              <form action={setUserStatus}>
                <input type="hidden" name="vendorId" value={vendor._id} />
                <input type="hidden" name="status" value={"approved"} />
                <Button className="bg-green-300 border border-green-400 transition-all">reactivate</Button>
              </form>
            ) : (
              <form action={setUserStatus}>
                <input type="hidden" name="vendorId" value={vendor._id} />
                <input type="hidden" name="status" value={"suspended"} />
                <Button className="bg-red-200">suspend</Button>
              </form>
            )}
          </>
        )}

        <Link href={`/admin/dashboard/vendors/${vendor._id}`}>
          <Button className="whitespace-nowrap bg-white border-none hover:text-blue-800 transition-all">
            view vendor
          </Button>
        </Link>
      </section>
    </li>
  )
}