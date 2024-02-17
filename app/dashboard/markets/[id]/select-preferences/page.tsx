import { getMarketById } from "@/sanity/queries/admin/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import SelectOptions from "./_components/SelectOptions";
import VenueMap from "./_components/VenueMap";

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
    <main className="pt-14 md:pt-20 px-5 w-full flex flex-col gap-8 h-screen">
      {market.venue.venueMap && (
        <article className="flex flex-col gap-5 items-center">
          <VenueMap
            src={market.venue.venueMap.url}
            alt={market.name}
            width={market.venue.venueMap.dimensions.width}
            height={market.venue.venueMap.dimensions.height}
          />
          <SelectOptions market={market} user={sanityUser} />
        </article>
      )}
    </main>
  );
};

export default Page;
