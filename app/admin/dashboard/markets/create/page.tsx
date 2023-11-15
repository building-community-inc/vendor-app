import CreateMarketForm from "./_components/CreateMarketForm";

const Page = () => {
  return (
    <main className="pt-10 px-5 w-full">
      <h1 className="font-bold text-xl">Create New Market</h1>
      <section className="w-full">
        <CreateMarketForm />
      </section>
    </main>
  );
};

export default Page;