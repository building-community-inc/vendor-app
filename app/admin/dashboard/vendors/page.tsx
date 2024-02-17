import { getAllVendors } from "@/sanity/queries/admin/vendors";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import Button from "@/app/_components/Button";
import { approveVendor, disapproveVendor, setUserStatus } from "./actions";
import Link from "next/link";
import { TVendor } from "@/sanity/queries/admin/vendors";



const Page = async () => {
  noStore()
  const vendors = await getAllVendors();

  if (!vendors) {
    return null;
  }
  const pendingVendors = vendors.filter(vendor => vendor.status === 'pending');
  const otherVendors = vendors.filter(vendor => vendor.status !== 'pending');

  return (
    <main className="pt-14 px-5 w-[80%] min-h-screen mx-auto">
      <h1 className="font-segoe font-bold text-3xl">Vendors</h1>
      <FormTitleDivider title="Pending Vendors" />

      <ul className="flex gap-2 flex-wrap mb-10 mt-2">
        {pendingVendors?.map((vendor) => (
          <VendorCard vendor={vendor} />
        ))}
      </ul>
      <FormTitleDivider title="Vendors" />
      <ul className="flex gap-2 flex-wrap mt-2">
        {otherVendors?.map((vendor) => (
          <VendorCard vendor={vendor} />
        ))}
      </ul>
    </main>
  );
}

export default Page;



const VendorCard = ({ vendor }: {
  vendor: TVendor
}) => {
  return (
    <li key={vendor._id} className="shadow-[5px_3px_6px_#00000029] border rounded border-black p-5 w-content flex-grow">

      {vendor.business ? (
        <h2><strong>Business:</strong> {vendor.business.name}</h2>
      ) : (
        <h2>No Business</h2>
      )}
      <h3><strong>Contact:</strong> {vendor.firstName} {vendor.lastName}</h3>
      <p>{vendor.email}</p>
      <div className="flex flex-col gap-2">

        <p className="capitalize"><strong>status:</strong> {vendor.status}</p>
        <footer className="flex items-center gap-2 justify-center">

          {vendor.status === "pending" ? (

            <form action={setUserStatus}>
              <input type="hidden" name="vendorId" value={vendor._id} />
              <input type="hidden" name="status" value={"approved"} />
              <Button className="bg-green-200">approve</Button>
            </form>
          ) : (
            <>
              {vendor.status === "suspended" ? (
                <form action={setUserStatus}>
                  <input type="hidden" name="vendorId" value={vendor._id} />
                  <input type="hidden" name="status" value={"approved"} />
                  <Button className="bg-green-200">reactivate</Button>
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
            <Button>
              view vendor
            </Button>
          </Link>
        </footer>
      </div>
    </li>
  )
}