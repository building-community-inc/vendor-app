import { getAllMarkets } from "@/sanity/queries/admin/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import MarketCard from "./_components/MarketCard";

export const dynamic = "force-dynamic";
const ExplorePage = async () => {
  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");
  const markets = await getAllMarkets();

  // console.log({ markets });
  return (
    <main className="flex flex-col gap-2 min-h-screen w-full">
      <header className="bg-nav-bg w-full flex justify-center py-10 items-center">
        <input
          type="text"
          placeholder="FIND A MARKET"
          className="bg-background rounded-full px-3 py-2 max-w-[654px] w-[40%]"
        />
      </header>
      <ul className="flex flex-col w-[80%] min-h-screen max-w-3xl mx-auto gap-16 py-10">
        {markets?.map((market) => (
          <MarketCard key={market._id} market={market} />
        ))}
      </ul>
    </main>
  );
};

export default ExplorePage;
