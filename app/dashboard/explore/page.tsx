import {
  getCurrentMarkets,
} from "@/sanity/queries/admin/markets/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MarketCard from "./_components/MarketCard";
import Search from "./_components/Search";
import SortBy from "./_components/SortBy";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { EMAIL } from "@/app/_components/constants";
import { exploreSorts } from "./_components/sorts";
import SelectCity from "./_components/SelectCity";

const ExplorePage = async (
  props: {
    searchParams: Promise<{
      [key: string]: string | undefined;
    }>;
  }
) => {
  const searchParams = await props.searchParams;

  noStore();
  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");

  if (!sanityUser.acceptedTerms || !sanityUser.acceptedTerms.accepted) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-10">
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
  if (sanityUser.status === "suspended") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-10">
        <h2 className="text-3xl font-bold">Your account is suspended</h2>
        <p className="text-xl">
          Your vendor account has been suspended, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>         </p>
      </div>
    )
  }

  if (sanityUser.status === "pending" || sanityUser.status === "archived") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-10">
        <h2 className="text-3xl font-bold">Your account is pending</h2>
        <p className="text-xl">
          Your application needs further review, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>            </p>
      </div>
    )
  }

  const markets = await getCurrentMarkets();

  const filteredMarketsByNameAndCity = markets?.filter((market) => {
    const matchesSearch = searchParams.search
      ? market.name.toLowerCase().includes(searchParams.search.toLowerCase())
      : true;

    const matchesCity = searchParams.city
      ? market.venue.city.toLowerCase().includes(searchParams.city.split(",")[0].trim().toLowerCase())
      : true;

    const isNotArchived = !market.archived

    return matchesSearch && matchesCity && isNotArchived;
  });

  const sort = searchParams.sort || undefined;

  let sortedMarkets = filteredMarketsByNameAndCity ? [...filteredMarketsByNameAndCity] : [];

  if (sort && exploreSorts[sort]) {
    exploreSorts[sort](sortedMarkets); // Call the sorting function
  }

  const cities = new Set<string>();

  markets?.forEach((market) => {
    cities.add(market.venue.city.split(",")[0].trim());
  });

  if (sanityUser.status === "approved") return (
    <main className="flex flex-col gap-2 min-h-screen w-full">
      <header className="w-full pt-3 max-w-[70%] md:max-w-[80%] mx-auto relative">
        <div className="relative w-full flex flex-col gap-4">
          <Search urlForSearch="/dashboard/explore" />
          <div className="flex justify-between items-center">
            <SelectCity cities={Array.from(cities)} />
            <SortBy />
          </div>
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
};

export default ExplorePage;
