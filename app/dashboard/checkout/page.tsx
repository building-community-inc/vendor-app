import Checkout from "./_components/Checkout";

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return (
    <main className="min-h-full flex flex-col items-center justify-center">
      <Checkout searchParams={searchParams} />
    </main>
  );
}

export default Page;