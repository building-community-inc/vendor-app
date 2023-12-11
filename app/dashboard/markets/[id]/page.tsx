import { getMarketById } from "@/sanity/queries/admin/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { dateArrayToDisplayableText, formatMarketDate } from "@/utils/helpers";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

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
    <main className="pt-14 px-5 w-full flex flex-col gap-8">
      <h1>{market.name}</h1>
      <Image
        src={market.marketCover.url}
        alt={market.name}
        width={market.marketCover.dimensions.width}
        height={market.marketCover.dimensions.height}
        className="rounded-lg w-full object-cover max-h-[271px]"
      />
      <p>{market.description}</p>
      <span className="flex gap-[1ch]">
        <strong>{market.price}</strong>/ day
      </span>
      <h2 className="font-bold text-lg">Dates:</h2>
      <ul className="flex gap-[1ch]">
        {market.dates.map((date, index) => (
          <li key={`${date}-${index}`}>
            {formatMarketDate(date)} {index !== market.dates.length - 1 && "-"}{" "}
          </li>
        ))}
      </ul>
      <h2 className="font-bold text-lg">Venue Details:</h2>
      <div className="flex gap-[1ch]">
        <h3 className="font-bold">Address:</h3>
        <span>{market.venue.address}</span>
      </div>
      <div className="flex gap-[1ch]">
        <h3 className="font-bold">Hours:</h3>
        <span className="max-w-[30ch]">{market.venue.hours}</span>
      </div>
    </main>
  );
};

export default Page;
