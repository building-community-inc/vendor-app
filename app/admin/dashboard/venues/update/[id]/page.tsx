import { getVenueById } from "@/sanity/queries/admin/venues";
import CreateVenueForm from "../../create/_components/CreateVenueForm";


export const dynamic = "force-dynamic";

const Page = async (
  props: {
    params: Promise<{
      id: string
    }>
  }
) => {
  const params = await props.params;

  const {title, address, city, hours, phone, securityPhone, loadInInstructions, venueMap, _id, tableInfo} = await getVenueById(params.id)


  const defaultValues = {
    title,
    address,
    city,
    hours,
    phone,
    securityPhone,
    loadInInstructions,
    _id,
    tableInfo
  }
  return (
    <main className="pt-14 px-5 w-full max-w-3xl mx-auto">
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
