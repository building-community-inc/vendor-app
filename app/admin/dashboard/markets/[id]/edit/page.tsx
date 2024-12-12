import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import { unstable_noStore as noStore } from "next/cache";
import EditMarketForm from "./EditMarketForm";
import Button from "@/app/_components/Button";
import Link from "next/link";

const Page = async ({ params }: {
  params: {
    id: string;
  };
}) => {
  noStore();
  const market = await getMarketById(params.id);

  if (!market) return <div>loading...</div>;

  return (
    <main className="pt-14 px-5 w-full flex flex-col gap-8 max-w-3xl mx-auto">
      <EditMarketForm market={market} />

      <Link href={`/admin/dashboard/markets/${market._id}`} className="mx-auto">
        <Button className="w-fit text-sm">
          Back to market
        </Button>
      </Link>
    </main>
  );
}

export default Page;