import { getAllVenues } from "@/sanity/queries/venues";
import CreateMarketForm from "./_components/CreateMarketForm";

const Page = async () => {

  const venues = await getAllVenues();

  console.log({ venues });
  return (
    <main className="pt-10 px-5 w-full">
      <h1 className="font-bold text-xl">Create New Market</h1>
      <section className="w-full">
        <CreateMarketForm venues={venues ?? []} />
      </section>
    </main>
  );
};

export default Page;
