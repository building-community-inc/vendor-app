import { getAllMarkets } from "@/sanity/queries/admin/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import MarketCard from "./_components/MarketCard";
import Search from "./_components/Search";

export const dynamic = "force-dynamic";
const ExplorePage = async ({searchParams}: {
  searchParams: {
    [key: string]: string | undefined;
  }
}) => {
  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");
  const markets = await getAllMarkets();


  const filteredMarketsByName = markets?.filter(market => {
    if (searchParams.search) {
      return market.name.toLowerCase().includes(searchParams.search.toLowerCase())
    }
    return true;
  })

  return (
    <main className="flex flex-col gap-2 min-h-screen w-full">
      <header className="bg-nav-bg w-full flex justify-center py-10 items-center">
        <Search />
      </header>
      <ul className="flex flex-col w-[80%] min-h-screen max-w-3xl mx-auto gap-16 py-10">
        {filteredMarketsByName?.map((market) => (
          <MarketCard key={market._id} market={market} />
        ))}
      </ul>
    </main>
  );
};

export default ExplorePage;
