import { currentUser } from "@clerk/nextjs/server";
import Checkout from "./_components/Checkout";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { unstable_noStore } from "next/cache";

const Page = async () => {
    unstable_noStore();
    const user = await currentUser();
  
    if (!user) {
      return <div>Not authorized</div>
    }
  
    const sanityUser = await getSanityUserByEmail(user.emailAddresses[0].emailAddress);
  
    if (!sanityUser) {
      return <div>Not authorized</div>
    }
  
  return (
    <main className="min-h-full text-white flex flex-col items-center justify-center">
      <Checkout userEmail={sanityUser.email} />
    </main>
  );
}

export default Page;