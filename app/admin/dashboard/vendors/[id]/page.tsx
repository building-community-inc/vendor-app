import { getVendorById } from "@/sanity/queries/admin/vendors";
import FormTitleDivider from "../../_components/FormTitleDivider";
import Image from "next/image";
import Link from "next/link";
import { DocumentPdfIcon } from '@sanity/icons'
import { approveVendor, disapproveVendor } from "../actions";
import Button from "@/app/_components/Button";

const Page = async ({ params }: {
  params: {
    id: string;
  }
}) => {

  const vendor = await getVendorById(params.id);

  if (!vendor) {
    return (
      <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
        <h1 className="font-segoe font-bold text-3xl">Vendor not found</h1>
      </main>
    );
  }

  console.log({ pdf: vendor.business?.docs })
  return (
    <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
      <h1 className="font-segoe text-3xl font-bold">Vendor Profile</h1>
      <FormTitleDivider title="Vendor Information" />
      <article>
        <header className="flex">
          <section className="p-5 rounded border border-black flex">
            {vendor.business && vendor.business.logo ? (
              <Image
                src={vendor.business.logo}
                alt={vendor.business.name}
                width={228}
                height={228}
                className="rounded-2xl object-cover w-fit h-fit"
              />
            ) : (
              <div className="w-[228px] h-[228px] bg-white flex items-center justify-center text-black rounded-2xl">
                <p className="font-bold text-center rotate-45 max-w-[6ch] text-xl">
                  Vendor Logo
                </p>
              </div>
            )}
            <section className="flex flex-col">
              {vendor.business ? (
                <>
                  <h2 className="rounded-full bg-white text-black font-bold px-4 py-1 border border-black">
                    {vendor.business.name}
                  </h2>
                  <TitleValue title="Product Category" value={vendor.business?.category} />
                  <TitleValue title="Owner Name" value={`${vendor.firstName} ${vendor.lastName}`} />
                  <TitleValue title="Address" value={vendor.business.address} />
                  <TitleValue title="City" value={vendor.business.city} />
                  <TitleValue title="Province" value={vendor.business.province} />
                  <TitleValue title="Postal Code" value={vendor.business.postalCode} />
                  <TitleValue title="Country" value={vendor.business.country} />
                  <TitleValue title="Email" value={vendor.email} />
                  <TitleValue title="Phone" value={vendor.business.phone} />
                  {vendor.business.instagramHandle && (
                    <TitleValue title="Instagram" value={vendor.business.instagramHandle} />
                  )}
                  {vendor.business.docs && vendor.business.docs.length > 0 && (
                    <>
                      <h3 className="font-bold">Supporting Documents:</h3>
                      <ul>
                        {vendor.business.docs.map((doc, i) => (
                          <li key={doc.url} className="flex items-center">
                            <DocumentPdfIcon className="mr-1 w-[34px] h-[42px]" />
                            <Link href={doc.url} target="_blank" rel="noreferrer">{doc.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="flex items-center gap-2">

                    <p><strong>Status:</strong> {vendor.status}</p>

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

                  </div>
                </>
              ) : (
                <h2>Vendor hasn&apos;t filled up his business information</h2>
              )}
            </section>
          </section>
        </header>
      </article>

    </main>
  );
}

export default Page;

const TitleValue = ({ title, value }: { title: string, value: string }) => (
  <p className="flex gap-1 max-w-full">
    <strong className="min-w-min whitespace-nowrap">{title}:</strong>
    <span className="overflow-hidden whitespace-nowrap text-ellipsis flex-grow">{value}</span>
  </p>
)