import { getVendorById } from "@/sanity/queries/admin/vendors";
import FormTitleDivider from "../../_components/FormTitleDivider";
import Image from "next/image";
import Link from "next/link";
import { approveVendor, disapproveVendor } from "../actions";
import Button from "@/app/_components/Button";
import { ContactCard, PaymentCard, SupportingDocsCard } from "@/app/dashboard/_components/profileComps";
import NoBz from "@/app/dashboard/_components/NoBz";
import { getUserPayments } from "@/sanity/queries/user";
import { AdminBusinessCard } from "./AdminBusinessCard";

const Page = async ({ params }: {
  params: {
    id: string;
  }
}) => {

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
    // <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
    //   <h1 className="font-segoe text-3xl font-bold">Vendor Profile</h1>
    //   <FormTitleDivider title="Vendor Information" />
    //   <article>
    //     <header className="flex">
    //       <section className="p-5 rounded border border-black flex">
    //         {vendor.business && vendor.business.logo ? (
    //           <Image
    //             src={vendor.business.logo}
    //             alt={vendor.business.name}
    //             width={228}
    //             height={228}
    //             className="rounded-2xl object-cover w-fit h-fit"
    //           />
    //         ) : (
    //           <div className="w-[228px] h-[228px] bg-white flex items-center justify-center text-black rounded-2xl">
    //             <p className="font-bold text-center rotate-45 max-w-[6ch] text-xl">
    //               Vendor Logo
    //             </p>
    //           </div>
    //         )}
    //         <section className="flex flex-col">
    //           {vendor.business ? (
    //             <>
    //               <h2 className="rounded-full bg-white text-black font-bold px-4 py-1 border border-black">
    //                 {vendor.business.name}
    //               </h2>
    //               <TitleValue title="Product Category" value={vendor.business?.category} />
    //               <TitleValue title="Owner Name" value={`${vendor.firstName} ${vendor.lastName}`} />
    //               <TitleValue title="Address" value={vendor.business.address} />
    //               <TitleValue title="City" value={vendor.business.city} />
    //               <TitleValue title="Province" value={vendor.business.province} />
    //               <TitleValue title="Postal Code" value={vendor.business.postalCode} />
    //               <TitleValue title="Country" value={vendor.business.country} />
    //               <TitleValue title="Email" value={vendor.email} />
    //               <TitleValue title="Phone" value={vendor.business.phone} />
    //               {vendor.business.instagramHandle && (
    //                 <TitleValue title="Instagram" value={vendor.business.instagramHandle} />
    //               )}
    //               {vendor.business.docs && vendor.business.docs.length > 0 && (
    //                 <>
    //                   <h3 className="font-bold">Supporting Documents:</h3>
    //                   <ul>
    //                     {vendor.business.docs.map((doc, i) => (
    //                       <li key={doc.url} className="flex items-center">
    //                         <DocumentPdfIcon className="mr-1 w-[34px] h-[42px]" />
    //                         <Link href={doc.url} target="_blank" rel="noreferrer">{doc.name}</Link>
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </>
    //               )}

    //               <div className="flex items-center gap-2">

    //                 <p><strong>Status:</strong> {vendor.status}</p>

    //                 {vendor.status === "pending" ? (

    //                   <form action={approveVendor}>
    //                     <input type="hidden" name="vendorId" value={vendor._id} />
    //                     <Button>approve</Button>
    //                   </form>
    //                 ) : (
    //                   <form action={disapproveVendor}>
    //                     <input type="hidden" name="vendorId" value={vendor._id} />
    //                     <Button>disaprove</Button>
    //                   </form>

    //                 )}

    //               </div>
    //             </>
    //           ) : (
    //             <h2>Vendor hasn&apos;t filled up his business information</h2>
    //           )}
    //         </section>
    //       </section>
    //     </header>
    //   </article>

    // </main>
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

          <h2 className="text-2xl font-bold font-darker-grotesque text-black">My Market Bookings</h2>
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
