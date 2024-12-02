import SanityTextBlock from "@/app/_components/SanityTextBlock";
import { getAcceptTermsContent } from "@/sanity/queries/pages/accept-terms";
import Form from "./_components/newForm";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { zodUserInTerms } from "./_components/zod";

const Page = async () => {
  const content = await getAcceptTermsContent();

  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const parsedUser = zodUserInTerms.safeParse(user);

  if (!parsedUser.success) {
    redirect("/login");
  }

  return (
    <main className="max-w-7xl mx-auto px-5 pt-14">
      <h1 className="text-2xl text-center font-darker-grotesque text-[600] text-[#C5B5A4] uppercase md:text-3xl ">Terms and Conditions</h1>
      <div className="w-[85vw] max-w-full px-2 border-[#C5B5A4] bg-white border-2 mt-10 mx-auto h-[70dvh] overflow-y-scroll">
        <SanityTextBlock value={content.terms} />
      </div>
      <Form />
    </main>
  );
};

export default Page;

