import { getAllVenues } from "@/sanity/queries/admin/venues";
import FormTitleDivider from "../_components/FormTitleDivider";
import VenueList from "./_components/VenueList";
import { unstable_noStore as noStore } from "next/cache";
import Button from "@/app/_components/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async () => {
  noStore();

  const venues = await getAllVenues();

  return (
    <main className="pt-14 px-5 min-h-screen max-w-3xl mx-auto">
      <h1 className="font-bold text-xl">Venues</h1>
      <FormTitleDivider title="Live Venues" />
      {venues && venues?.length > 1 ? <VenueList venues={venues} /> : (
        <div className="flex flex-col items-center justify-center">

          <p>No venues found</p>
          <Button>
            <Link href="/admin/dashboard/venues/create">
              Create Venue
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
};

export default Page;
