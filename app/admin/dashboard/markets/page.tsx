// import { getAllVenues } from "@/sanity/queries/venues";
import { getAllMarkets } from "@/sanity/queries/admin/markets";
import FormTitleDivider from "../_components/FormTitleDivider";
// import VenueList from "./_components/VenueList";

export const dynamic = "force-dynamic";

const Page = async () => {

  // const venues = await getAllVenues();

  const markets = await getAllMarkets();

  console.log({ markets });
  return (
    <main className="pt-10 px-5 w-full">
      <h1 className="font-bold text-xl">Markets</h1>
      <FormTitleDivider title="Live Markets" />
      {/* {venues && <VenueList venues={venues} />} */}
    </main>
  );
};

export default Page;
