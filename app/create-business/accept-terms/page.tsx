import Button from "@/app/_components/Button";
import { Input } from "@/app/_components/Input";
import SanityTextBlock from "@/app/_components/SanityTextBlock";
import { getAcceptTermsContent } from "@/sanity/queries/pages/accept-terms";

const Page = async () => {
  const content = await getAcceptTermsContent();

  return (
    <main className="max-w-7xl mx-auto px-5 pt-10">
      <h1 className="text-2xl text-center ">Terms and Conditions</h1>
      <div className="w-[85vw] max-w-full px-2 border-white border-2 mt-10 mx-auto h-[70dvh] overflow-y-scroll">
        <SanityTextBlock value={content.terms} />
      </div>
      <form action="" className="mt-10 flex flex-col items-center">
        <label htmlFor="acceptance" className="flex items-center gap-2">
          <input type="checkbox" name="acceptance" />I accept the terms and
          conditions
        </label>
        <div className="my-4">
          <Input name="name" placeholder="Name" />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </main>
  );
};

export default Page;
