// import { getAllVenues } from "@/sanity/queries/venues";
import { TSanityMarket } from "@/sanity/queries/admin/markets/zods";
import FormTitleDivider from "../_components/FormTitleDivider";
import Link from "next/link";
import MarketCard from "./_components/MarketCard";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import { unstable_noStore as noStore } from 'next/cache';
import Search from "@/app/dashboard/explore/_components/Search";
import { getAllMarkets } from "@/sanity/queries/admin/markets/markets";
import SortBy from "@/app/dashboard/explore/_components/SortBy";
import MarketFilters from "./_components/MarketFilters";
// import VenueList from "./_components/VenueList";

// export const dynamic = "force-dynamic";
const exploreSorts: { [key: string]: (markets: TSanityMarket[]) => void } = {
  date_upcoming: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      const nextADate = a.dates.find((date) => new Date(date) >= new Date());
      const nextBDate = b.dates.find((date) => new Date(date) >= new Date());
      if (!nextADate || !nextBDate) {
        return 0;
      }

      return new Date(nextADate).getTime() - new Date(nextBDate).getTime();
    });
  },
  price_highest: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      const pricesA =
        a.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];
      const pricesB =
        b.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];

      const maxPriceA = Math.max(...pricesA);
      const maxPriceB = Math.max(...pricesB);

      return maxPriceB - maxPriceA;
    });
  },
  price_lowest: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      const pricesA =
        a.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];
      const pricesB =
        b.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];

      const minPriceA = Math.min(...pricesA);
      const minPriceB = Math.min(...pricesB);
      return minPriceA - minPriceB;
    });
  },
  venue_az: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      if (a.venue.title < b.venue.title) {
        return -1;
      }
      if (a.venue.title > b.venue.title) {
        return 1;
      }
      return 0;
    });
  },
  venue_za: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      if (a.venue.title > b.venue.title) {
        return -1;
      }
      if (a.venue.title < b.venue.title) {
        return 1;
      }
      return 0;
    });
  },
};
const Page = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) => {
  noStore();
  // const venues = await getAllVenues();

  const markets = await getAllMarkets();

  const filteredMarketsByName = markets?.filter((market) => {
    const marketFilter = searchParams.marketFilter;
    if (marketFilter === "archived" && !market.archived) {
      return false;
    }

    if (marketFilter === "active" && market.archived) {
      return false;
    }

    if (searchParams.search) {
      return market.name
        .toLowerCase()
        .includes(searchParams.search.toLowerCase());
    }

    return true;
  });

  const sort = searchParams.sort || undefined;

  let sortedMarkets = filteredMarketsByName ? [...filteredMarketsByName] : [];

  if (sort && exploreSorts[sort]) {
    exploreSorts[sort](sortedMarkets); // Call the sorting function
  }

  return (
    <main className="pt-14 px-5 min-h-screen max-w-3xl mx-auto w-[80%]">
      <Search urlForSearch="/admin/dashboard/markets" theme="light" />
      <h1 className="font-bold text-xl">Markets</h1>
      <FormTitleDivider title="Live Markets" />
      <div className="flex justify-between">
        <SortBy />
        <MarketFilters />
      </div>
      <MarketList markets={sortedMarkets || []} />

      {/* {venues && <VenueList venues={venues} />} */}
      {/* <Image src={markets.} */}
    </main>
  );
};

export default Page;

const MarketList = ({ markets }: { markets: TSanityMarket[] }) => {
  return (
    <ul className="flex flex-col gap-[15px] mt-5">
      {markets.length > 0 ? (
        markets.map((market) => {
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
        })
      ) : (
        <p className="place-self-center">No markets found</p>
      )}
    </ul>
  );
};
