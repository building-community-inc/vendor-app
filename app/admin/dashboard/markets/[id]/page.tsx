import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import MarketCard from "../_components/MarketCard";
import { areDatesSame, dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import MarketDays from "../_components/MarketDays";
import { unstable_noStore as noStore } from 'next/cache';
import CancelMarketButton from "./_components/CancelMarketButton";


const Page = async ({
  params,
  searchParams
}: {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
}) => {
  noStore();
  const market = await getMarketById(params.id);

  if (!market) return <div>loading...</div>;

  const selectedDay = searchParams.selectedDay || null;
  const dateToDisplay = dateArrayToDisplayableText(market.dates);

  const vendorsForSelectedDay = market.vendors?.filter((vendor) => {
    return vendor.datesBooked.some((bookedDate) => {
      if (selectedDay) {
        return areDatesSame(bookedDate.date, selectedDay)
      }
      return false;
    });
  });

  const dayInfo = market.daysWithTables?.find(day => areDatesSame(day.date, selectedDay || ""));

  const availableTablesForDay = dayInfo?.tables.filter((table) => table.booked === null) || null;


  return (
    <main className="pt-14 px-5 w-full flex flex-col gap-8 max-w-3xl mx-auto">
      <h1 className="font-bold text-xl">{market?.name}</h1>
      <MarketCard market={market} dateToDisplay={dateToDisplay} withOptions />
      {market.venue.venueMap && (
        <Image
          src={market.venue.venueMap.url}
          alt={market.venue.title}
          width={500}
          height={500}
          className="w-full mx-auto"
        />
      )}
      <MarketDays
        availableTablesForDay={availableTablesForDay}
        dates={market.dates}
        vendorsForSelectedDay={vendorsForSelectedDay || []}
        marketId={market._id}
        selectedDay={selectedDay}
        daysWithTables={market.daysWithTables}
        cancelled={market.cancelled}
      />
      {/* {!market.cancelled && (
        <CancelMarketButton marketId={market._id} />
      )} */}
    </main>
  );
};

export default Page;

