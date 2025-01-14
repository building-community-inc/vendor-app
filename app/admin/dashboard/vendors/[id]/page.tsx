import { getVendorById } from "@/sanity/queries/admin/vendors";
import Link from "next/link";
import { approveVendor, disapproveVendor } from "../actions";
import Button from "@/app/_components/Button";
import { ContactCard, PaymentCard, SupportingDocsCard } from "@/app/dashboard/_components/profileComps";
import NoBz from "@/app/dashboard/_components/NoBz";
import { getUserPayments } from "@/sanity/queries/user";
import { AdminBusinessCard } from "./AdminBusinessCard";
import { unstable_noStore } from "next/cache";

const Page = async ({ params }: {
  params: {
    id: string;
  }
}) => {

  unstable_noStore();
  const vendorData = await getVendorById(params.id);

  if (!vendorData) {
    return (
      <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
        <h1 className="font-segoe font-bold text-3xl">Vendor not found</h1>
      </main>
    );
  }


  if (!vendorData.success) {
    return null;
  }

  const vendor = vendorData.data;

  const vendorPayments = await getUserPayments(vendor._id);

  return (
    <main className="flex px-10 py-24 gap-24 min-h-screen w-full flex-col justify-center">
      <section className=" flex flex-wrap gap-10 justify-center">

        {vendorData.data.business ? (
          // <section className="flex flex-wrap justify-evenly gap-10 ">
          <AdminBusinessCard
            vendorId={vendorData.data._id}
            credits={vendorData.data.credits || 0}
            business={vendorData.data.business}
            ownerName={`${vendorData.data.firstName} ${vendorData.data.lastName}`}
          />
          // </section>
        ) : (
          <NoBz />
        )}
        <footer className="flex flex-col gap-10 items-center">
          {vendorData.data.business && (
            <ContactCard email={vendorData.data.email} phone={vendorData.data.business?.phone} address={`${vendorData.data.business?.address1} ${vendorData.data.business?.address2}`} />
          )}

          {vendorData.data.business && vendorData.data.business.pdfs && vendorData.data.business.pdfs.length > 0 && (
            <SupportingDocsCard pdfs={vendorData.data.business.pdfs} />
          )}
          <div className="flex gap-8 w-full max-w-[433px] justify-evenly">

            <Button className="h-fit font-bold font-darker-grotesque">
              <Link href="/dashboard/edit-profile">Edit Profile</Link>
            </Button>
            <Button className="h-fit font-bold font-darker-grotesque">
              <Link href="/dashboard/upload-files">Upload or Edit Files</Link>
            </Button>

          </div>
          {vendor.status === "pending" ? (

            <form action={approveVendor}>
              <input type="hidden" name="vendorId" value={vendor._id} />
              <Button>Approve</Button>
            </form>
          ) : (
            <form action={disapproveVendor}>
              <input type="hidden" name="vendorId" value={vendor._id} />
              <Button>Disaprove</Button>
            </form>
          )}

        </footer>
      </section>

      <section className="flex flex-col gap-2">
        <header className="border-2 border-b-black">

          <h2 className="text-2xl font-bold font-darker-grotesque text-black">Market Bookings</h2>
        </header>
        <ul className="flex flex-col gap-5">
          {vendorPayments.map(payment => (
            <PaymentCard amount={payment.amount} paymentId={payment._id} key={payment._id} market={payment.market} items={payment.items} />
          ))}
        </ul>


      </section>
    </main>
  );
}

export default Page;
