import {
  TSanityMarket,
  getCurrentMarkets,
} from "@/sanity/queries/admin/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import MarketCard from "./_components/MarketCard";
import Search from "./_components/Search";
import SortBy from "./_components/SortBy";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";


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

const ExplorePage = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) => {

  noStore();
  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");

  if (!sanityUser.acceptedTerms || !sanityUser.acceptedTerms.accepted) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-3xl font-bold">Please accept the terms</h2>
        <p className="text-xl">
          You need to accept the terms before you can access the dashboard
        </p>
        <Link href="/create-business/accept-terms">
          <span className="text-xl underline">Terms and Conditions</span>
        </Link>
      </div>
    )
  }
  console.log({ sanityUser })

  if (sanityUser.status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-3xl font-bold">Your account is pending</h2>
        <p className="text-xl">
          You need to be approved before you can access the dashboard
        </p>
      </div>
    )
  } else {
    const markets = await getCurrentMarkets();

    const filteredMarketsByName = markets?.filter((market) => {
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
      <main className="flex flex-col gap-2 min-h-screen w-full">
        <header className="bg-nav-bg w-full flex justify-center  items-center relative">
          <div className="relative max-w-xl min-w-[250px] w-[40%] py-10 h-full flex items-center">
            <Search urlForSearch="/dashboard/explore" />
            <SortBy />
          </div>
        </header>
        {sortedMarkets?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-3xl font-bold">No Markets Found</h2>
            <p className="text-xl">Try searching for something else</p>
          </div>
        ) : (
          <ul className="flex flex-col w-[80%] min-h-screen max-w-3xl mx-auto gap-16 py-10">
            {sortedMarkets?.map((market) => (
              <MarketCard key={market._id} market={market} />
            ))}
          </ul>
        )}
      </main>
    );
  }
};

export default ExplorePage;
