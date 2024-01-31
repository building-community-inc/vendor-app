import { getMarketById } from "@/sanity/queries/admin/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import SelectDates from "./_components/SelectDates";
import ContinueButton from "../_components/ContinueButton";
import SelectOptions from "./_components/SelectOptions";

const Page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");

  const market = await getMarketById(params.id);

  if (!market) return <div>no market found</div>;


  // const dateToDisplay = dateArrayToDisplayableText(market.dates);
  return (
    <main className="pt-14 px-5 w-full flex flex-col gap-8 justify-center h-screen screen">
      {market.venue.venueMap && (
        <article className="flex flex-wrap justify-center">
          <Image
            src={market.venue.venueMap.url}
            alt={market.name}
            width={market.venue.venueMap.dimensions.width}
            height={market.venue.venueMap.dimensions.height}
            className="rounded-lg w-[60%] object-cover max-h-[271px]"
          />
          <SelectOptions market={market} user={sanityUser} />
        </article>
      )}
    </main>
  );
};

export default Page;
