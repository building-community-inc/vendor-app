import { getMarketById } from "@/sanity/queries/admin/markets";
import MarketCard from "../_components/MarketCard";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import MarketDays from "../_components/MarketDays";

const Page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const market = await getMarketById(params.id);

  if (!market) return <div>loading...</div>;

  const dateToDisplay = dateArrayToDisplayableText(market.dates);

  return (
    <main className="pt-14 px-5 w-full flex flex-col gap-8">
      <h1 className="font-bold text-xl">{market?.name}</h1>
      <MarketCard market={market} dateToDisplay={dateToDisplay} />
      {market.venue.venueMap && (
        <Image
          src={market.venue.venueMap}
          alt={market.venue.title}
          width={500}
          height={500}
          className="w-full mx-auto"
        />
      )}
      <MarketDays dates={market.dates} />
    </main>
  );
};

export default Page;

