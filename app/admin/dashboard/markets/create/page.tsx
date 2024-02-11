import { getAllVenues } from "@/sanity/queries/admin/venues";
import CreateMarketForm from "./_components/CreateMarketForm";


export const dynamic = "force-dynamic";

const Page = async () => {

  const venues = await getAllVenues();

  return (
    <main className="pt-14 px-5 w-full max-w-3xl mx-auto">
      <h1 className="font-bold text-xl">Create New Market</h1>
      <section className="w-full pb-10">
        <CreateMarketForm venues={venues ?? []} />
      </section>
    </main>
  );
};

export default Page;
