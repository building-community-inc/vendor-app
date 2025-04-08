import { getVendorById } from "@/sanity/queries/admin/vendors";
import Link from "next/link";
import { approveVendor, disapproveVendor } from "../actions";
import Button from "@/app/_components/Button";
import { ContactCard, DateOfAcceptance } from "@/app/dashboard/_components/profileComps";
import NoBz from "@/app/dashboard/_components/NoBz";
import { getUserPaymentRecords } from "@/sanity/queries/user";
import { AdminBusinessCard } from "./AdminBusinessCard";
import { unstable_noStore } from "next/cache";
import { SupportingDocsCard } from "@/app/dashboard/_components/profileComps/SupportingDocs";
import VendorPayments from "./VendorPayments";
import { ApproveVendorForm, DisapproveVendorForm } from "./VendorForms";

const Page = async (
  props: {
    params: Promise<{
      id: string;
    }>
  }
) => {
  const params = await props.params;

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
  const vendorPaymentRecords = await getUserPaymentRecords(vendor._id);

  return (
    (<main className="flex px-10 py-24 gap-24 min-h-screen w-full flex-col justify-center">
      <section className=" flex flex-wrap gap-10 justify-center">

        {vendorData.data.business ? (
          // <section className="flex flex-wrap justify-evenly gap-10 ">
          (<AdminBusinessCard
            status={vendorData.data.status}
            vendorId={vendorData.data._id}
            credits={vendorData.data.credits || 0}
            business={vendorData.data.business}
            ownerName={`${vendorData.data.firstName} ${vendorData.data.lastName}`}
          />)
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

          <DateOfAcceptance date={vendor.acceptedTerms?.dateAccepted} />
          <div className="flex gap-8 w-full max-w-[433px] justify-evenly">

            <Link href={`/admin/dashboard/vendors/${vendor.email.replace("@", "-at-").replaceAll(".", "-dot-")}/edit-profile`}>
              <Button className="h-fit font-bold font-darker-grotesque">
                Edit Profile
              </Button>
            </Link>
            <Link href={`/admin/dashboard/vendors/${vendor.email.replace("@", "-at-").replaceAll(".", "-dot-")}/upload-files`}>
              <Button className="h-fit font-bold font-darker-grotesque">
                Upload or Edit Files
              </Button>
            </Link>

          </div>
          {vendor.status === "approved" ? (
            <DisapproveVendorForm vendorId={vendor._id} />
          ) : (
            <ApproveVendorForm vendorId={vendor._id} />
          )}

        </footer>
      </section>
      {vendorPaymentRecords.length > 0 && (
        <VendorPayments vendorPaymentRecords={vendorPaymentRecords} admin />
      )}
    </main>)
  );
}

export default Page;
