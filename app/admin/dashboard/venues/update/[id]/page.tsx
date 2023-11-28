import { getVenueById } from "@/sanity/queries/venues";
import CreateVenueForm from "../../create/_components/CreateVenueForm";


export const dynamic = "force-dynamic";

const Page = async ({params}: {
  params: {
    id: string
  }
}) => {

  const {title, address, city, hours, phone, securityPhone, loadInInstructions, venueMap, _id, tables} = await getVenueById(params.id)


  const defaultValues = {
    title,
    address,
    city,
    hours,
    phone,
    securityPhone,
    loadInInstructions,
    _id,
    tables
  }
  return (
    <main className="pt-10 px-5 w-full">
      <h1 className="font-bold text-xl">Update Venue {defaultValues?.title}</h1>
      <section className="w-full">
        <CreateVenueForm
          defaultValues={defaultValues}
          defaultImage={venueMap}
        />
      </section>
    </main>
  );
};

export default Page;
