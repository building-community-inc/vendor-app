import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "../_components/Button";
import NoBz from "./_components/NoBz";

const page = async () => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );
  // console.log({ sanityUser, pdf: saityUser.business?.pdfs });

  return (
    <main className="flex gap-2 min-h-screen w-full">
      {sanityUser.business ? (
        <section className="flex flex-wrap gap-5 xl:gap-10 items-center justify-center w-full px-10">
          {sanityUser.business.logoUrl ? (
            <Image
              src={sanityUser.business.logoUrl}
              alt={sanityUser.business.businessName}
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
          <section className="w-fit flex flex-col gap-2">
            <h2 className="rounded-full bg-white text-black font-bold px-4 py-1">
              {sanityUser.business.businessName}
            </h2>
            <p className="flex gap-2">
              <strong>Product Category:</strong>
              {sanityUser.business.industry}
            </p>
            <p className="flex gap-2">
              <strong>Owner Name:</strong>
              {`${sanityUser.firstName} ${sanityUser.lastName}`}
            </p>
            <p className="flex gap-2">
              <strong>Address:</strong>
              {`${sanityUser.business.address1} ${sanityUser.business.address2}`}
            </p>
            <p className="flex gap-2">
              <strong>City:</strong>
              {sanityUser.business.city}
            </p>
            <p className="flex gap-2">
              <strong>Province:</strong>
              {sanityUser.business.province}
            </p>
            <p className="flex gap-2">
              <strong>Postal Code:</strong>
              {sanityUser.business.postalCode}
            </p>
            <p className="flex gap-2">
              <strong>Country:</strong>
              {sanityUser.business.country}
            </p>
            <p className="flex gap-2">
              <strong>Email:</strong>
              {sanityUser.email}
            </p>
            <p className="flex gap-2">
              <strong>Phone:</strong>
              {sanityUser.business.phone}
            </p>
            <p className="flex gap-2">
              <strong>Instagram Handle:</strong>
              <span className="text-[#0A6FA2]">
                @{sanityUser.business.instagramHandle ?? ""}
              </span>
            </p>
            {sanityUser.business.pdfs && (
              <ul className="flex gap-2 flex-col">
                <strong>Supporting Documents:</strong>
                {sanityUser.business.pdfs.map((pdf) => (
                  <li key={pdf.url}>- {pdf.name}</li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3>My Markets</h3>
          </section>
        </section>
      ) : (
        <NoBz />
      )}
    </main>
  );
};

export default page;
