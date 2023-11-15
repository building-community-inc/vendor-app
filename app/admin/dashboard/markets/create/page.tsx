import CreateMarketForm from "./_components/CreateMarketForm";

const Page = () => {
  return (
    <main className="pt-10 px-5 w-full">
      <h1 className="font-bold text-xl">Create New Market</h1>
      <section className="w-full">
        <header className="flex w-full items-center gap-2">
          <h2 className="text-sm w-[19ch]">Market Information</h2>
          <div className="w-full h-0 border-b border-secondary-admin-border"/>
        </header>
        <CreateMarketForm />
      </section>
    </main>
  );
};

export default Page;
