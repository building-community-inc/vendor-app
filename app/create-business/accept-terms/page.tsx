import Button from "@/app/_components/Button";
import SanityTextBlock from "@/app/_components/SanityTextBlock";
import { getAcceptTermsContent } from "@/sanity/queries/pages/accept-terms";
import Form from "./_components/form";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";


const zodUserInTerms = z.object({
  firstName: z.string(),
  lastName: z.string(),
  id: z.string(),
});

export type TUserInTerms = z.infer<typeof zodUserInTerms>;

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
    <main className="max-w-7xl mx-auto px-5 pt-10">
      <h1 className="text-2xl text-center ">Terms and Conditions</h1>
      <div className="w-[85vw] max-w-full px-2 border-white border-2 mt-10 mx-auto h-[70dvh] overflow-y-scroll">
        <SanityTextBlock value={content.terms} />
      </div>
      <Form user={parsedUser} />
    </main>
  );
};

export default Page;

