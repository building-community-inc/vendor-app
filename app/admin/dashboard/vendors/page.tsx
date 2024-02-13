import { getAllVendors } from "@/sanity/queries/admin/vendors";
import { unstable_noStore as noStore } from "next/cache";
import FormTitleDivider from "../_components/FormTitleDivider";
import Button from "@/app/_components/Button";
import { approveVendor, disapproveVendor } from "./actions";
import Link from "next/link";



const Page = async () => {
  noStore()
  const vendors = await getAllVendors();

  // console.log({ vendors });
  if (!vendors) {
    return null;
  }

  return (
    <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
      <h1 className="font-segoe font-bold text-3xl">Vendors</h1>
      <FormTitleDivider title="Vendors" />

      <ul className="flex gap-2 flex-wrap">
        {vendors?.map((vendor) => (
          <li key={vendor._id} className="border rounded border-black p-5">

            {vendor.business ? (
              <h2>{vendor.business.name}</h2>
            ) : (
              <h2>No Business</h2>
            )}
            <h3>{vendor.firstName} {vendor.lastName}</h3>
            <p>{vendor.email}</p>
            <div className="flex items-center gap-2">

              <p><strong>status:</strong> {vendor.status}</p>

              {vendor.status === "pending" ? (

                <form action={approveVendor}>
                  <input type="hidden" name="vendorId" value={vendor._id} />
                  <Button>approve</Button>
                </form>
              ) : (
                <form action={disapproveVendor}>
                  <input type="hidden" name="vendorId" value={vendor._id} />
                  <Button>disaprove</Button>
                </form>

              )}

              <Link href={`/admin/dashboard/vendors/${vendor._id}`}>
                view vendor
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Page;