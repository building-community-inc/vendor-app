// import { getAllVenues } from "@/sanity/queries/venues";
import { TSanityMarket, getAllMarkets } from "@/sanity/queries/admin/markets";
import FormTitleDivider from "../_components/FormTitleDivider";
import Link from "next/link";
import MarketCard from "./_components/MarketCard";
import { dateArrayToDisplayableText } from "@/utils/helpers";
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
      <MarketList markets={markets || []} />
      {/* {venues && <VenueList venues={venues} />} */}
      {/* <Image src={markets.} */}

    </main>
  );
};

export default Page;

const MarketList = ({ markets }: { markets: TSanityMarket[] }) => {
  // console.log("dates", markets[0].dates);
  return (
    <ul>
      {markets.map((market) => {
        const dateToDisplay = dateArrayToDisplayableText(market.dates);
        return (
          <li
            // className="border rounded-[20px] p-2  border-[#292929]"
            key={market._id}
          >
            <Link href={`/admin/dashboard/markets/${market._id}`}>
              <MarketCard market={market} dateToDisplay={dateToDisplay} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};


