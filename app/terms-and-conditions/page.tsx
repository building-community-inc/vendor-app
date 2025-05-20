import { getAcceptTermsContent } from "@/sanity/queries/pages/accept-terms";
import SanityTextBlock from "../_components/SanityTextBlock";

const Page = async () => {
  const content = await getAcceptTermsContent();

  return (
    <main className="max-w-7xl mx-auto px-5 pt-14">
      <h1 className="text-2xl text-center font-darker-grotesque text-[#C5B5A4] uppercase md:text-3xl ">
        Terms and Conditions
      </h1>
      <div className="w-[85vw] max-w-full px-2 border-[#C5B5A4] bg-white border-2 mt-10 mx-auto h-[70dvh] overflow-y-scroll">
        <SanityTextBlock value={content.terms} />
      </div>
    </main>
  );
};

export default Page;
