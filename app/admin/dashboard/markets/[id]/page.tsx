import { getMarketById } from "@/sanity/queries/admin/markets";
import MarketCard from "../_components/MarketCard";
import { areDatesSame, dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import MarketDays from "../_components/MarketDays";
import { unstable_noStore as noStore } from 'next/cache';


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
  // console.log({ dayInfo, availableTablesForDay })


  // const availableTables = typeof market.daysWithTables?[0].tables === "object" ?.filter(table => table.booked === null);

  // const availableTables = market.daysWithTables?.filter(day => day.tables?.filter(table => table.booked === null));
  // console.log(market.daysWithTables)

  // const 


  // console.log({
    // market,
    // availableTablesForDay,
    // tables: availableTables && availableTables[0],
    // daysWithTables: market.daysWithTables,
    // tables: market.daysWithTables[0].tables[0].table,
    // tables: market.daysWithTables[0]
  // })

  return (
    <main className="pt-14 px-5 w-full flex flex-col gap-8 max-w-3xl mx-auto">
      <h1 className="font-bold text-xl">{market?.name}</h1>
      <MarketCard market={market} dateToDisplay={dateToDisplay} />
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
      />
    </main>
  );
};

export default Page;

