import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import { unstable_noStore as noStore } from "next/cache";
import EditMarketForm from "./EditMarketForm";
import Button from "@/app/_components/Button";
import Link from "next/link";
import EditMarketCoverForm from "./EditMarketCoverForm";

const Page = async (
  props: {
    params: Promise<{
      id: string;
    }>;
  }
) => {
  const params = await props.params;
  noStore();
  const market = await getMarketById(params.id);

  if (!market) return <div>loading...</div>;

  return (
    <main className="pt-14 px-5 w-full flex flex-col gap-8 max-w-3xl mx-auto">
      <EditMarketCoverForm marketCoverId={market.marketCover._id} marketCover={market.marketCover.url} marketId={market._id} marketName={market.name} />
      <EditMarketForm market={market} />
   
    </main>
  );
}

export default Page;