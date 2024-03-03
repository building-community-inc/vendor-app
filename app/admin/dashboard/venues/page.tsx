import { getAllVenues } from "@/sanity/queries/admin/venues";
import FormTitleDivider from "../_components/FormTitleDivider";
import VenueList from "./_components/VenueList";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

const Page = async () => {
  noStore();

  const venues = await getAllVenues();

  return (
    <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
      <h1 className="font-bold text-xl">Venues</h1>
      <FormTitleDivider title="Live Venues" />
      {venues && <VenueList venues={venues} />}
    </main>
  );
};

export default Page;
