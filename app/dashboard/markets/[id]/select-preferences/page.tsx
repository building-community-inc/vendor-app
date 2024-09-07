import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SelectOptions from "./_components/SelectOptions";
// import VenueMap from "./_components/VenueMap";
import Link from "next/link";
import { EMAIL } from "@/app/_components/constants";
import { TSanityMarket } from "@/sanity/queries/admin/markets/zods";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import Box from "./_components/Box";
import Calendar from "@/app/dashboard/_components/Calendar";

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

  if (!sanityUser.acceptedTerms || !sanityUser.acceptedTerms.accepted) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-3xl font-bold">Please accept the terms</h2>
        <p className="text-xl">
          You need to accept the terms before you can access the dashboard
        </p>
        <Link href="/create-business/accept-terms">
          <span className="text-xl underline">Terms and Conditions</span>
        </Link>
      </div>
    )
  }
  if (sanityUser.status === "suspended") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-3xl font-bold">Your account is suspended</h2>
        <p className="text-xl">
          Your vendor account has been suspended, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>         </p>
      </div>
    )
  }

  if (sanityUser.status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-3xl font-bold">Your account is pending</h2>
        <p className="text-xl">
          Your application needs further review, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>            </p>
      </div>
    )
  }

  const market = await getMarketById(params.id);

  if (!market) return <div>market not found</div>;


  // const dateToDisplay = dateArrayToDisplayableText(market.dates);
  return (
    <main className="pt-48 w-full flex flex-col gap-8 h-screen relative">
      <header className="flex items-center py-10 w-full bg-white shadow-md shadow-gray-400 border-b-2 border-title-color absolute top-0 left-0">
        <div className="flex max-w-[540px] w-full mx-auto overflow-hidden  justify-between gap-2 md:gap-4 lg:gap-20">
          <div className="min-w-[70px] flex">
            <Calendar dates={market.dates} />
          </div>
          <div className=" w-fit flex-grow">

            <h1 className="font-bold">
              {/* {market.name.length > 20 ? `${market.name.substring(0, 20)}...` : market.name} */}
              {market.name}
            </h1>
            <p>{`${market.venue.address}, ${market.venue.city}`}</p>
          </div>
        </div>
      </header>
      {market.venue.venueMap && (
        <article className="flex flex-col gap-5 items-center">
          <VenueMap
            market={market}
          />
          <SelectOptions market={market} user={sanityUser} />
        </article>
      )}
    </main>
  );
};

export default Page;


const VenueMap = ({ market }: {
  market: TSanityMarket
}) => {
  if (!market.venue.venueMap) return null;

  return (
    <Box>
      <h2 className="font-darker-grotesque font-bold text-black text-lg">{"Venue Table Map"}</h2>
      <Image
        src={market.venue.venueMap?.url}
        alt={market.name}
        width={424}
        height={409}
        className="object-cover max-h-[409px] max-w-[424px]"
      />
    </Box>
  )
}

