import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SelectOptions from "./_components/SelectOptions";
import VenueMap from "./_components/VenueMap";
import Link from "next/link";
import { EMAIL } from "@/app/_components/constants";

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
