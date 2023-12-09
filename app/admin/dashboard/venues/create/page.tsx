import CreateVenueForm from "./_components/CreateVenueForm";

const Page = () => {
  return (
    <main className="pt-14 px-5 w-full max-w-3xl mx-auto">
      <h1 className="font-bold text-xl">Create New Venue</h1>
      <section className="w-full">
        <CreateVenueForm />
      </section>
    </main>
  );
};

export default Page;
