import { getAllVenues } from "@/sanity/queries/venues";
import FormTitleDivider from "../_components/FormTitleDivider";
import VenueList from "./_components/VenueList";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export const revalidate = 0;
const Page = async () => {

  const venues = await getAllVenues();

  return (
    <main className="pt-10 px-5 w-full">
      <h1 className="font-bold text-xl">Venues</h1>
      <FormTitleDivider title="Live Venues" />
      {venues && <VenueList venues={venues} />}
    </main>
  );
};

export default Page;
