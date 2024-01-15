import Checkout from "./_components/Checkout";

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return (
    <main>
      <Checkout searchParams={searchParams} />
    </main>
  );
}

export default Page;