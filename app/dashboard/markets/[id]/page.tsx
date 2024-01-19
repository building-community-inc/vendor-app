import { getMarketById } from "@/sanity/queries/admin/markets";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { formatMarketDate, tablePriceTodisplay } from "@/utils/helpers";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ContinueButton from "./_components/ContinueButton";

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

  const prices =
    market.daysWithTables?.flatMap((day) =>
      day.tables.map((t) => t.table.price)
    ) || [];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const priceToDisplay = tablePriceTodisplay(minPrice, maxPrice);

  return (
    <main className="pt-14 px-5 w-full max-w-3xl mx-auto flex flex-col gap-8">
      <h1>{market.name}</h1>
      <Image
        src={market.marketCover.url}
        alt={market.name}
        width={market.marketCover.dimensions.width}
        height={market.marketCover.dimensions.height}
        className="rounded-lg w-full object-cover max-h-[271px]"
      />
      {/* <p>{market.description}</p> */}
      <span className="flex gap-[1ch]">
        <strong>{priceToDisplay}</strong>/ day
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

      <DetailSection title={market.venue.title} description={""} />
      <DetailSection title={"Address:"} description={market.venue.address} />
      {market.venue.hours && (
        <DetailSection title={"Hours:"} description={market.venue.hours} />
      )}
      {market.venue.phone && (
        <DetailSection title={"Phone:"} description={market.venue.phone} />
      )}
      {market.venue.securityPhone && (
        <DetailSection
          title={"Security:"}
          description={market.venue.securityPhone}
        />
      )}
      {market.venue.loadInInstructions && (
        <DetailSection
          title={"Load In Instructions:"}
          description={market.venue.loadInInstructions}
        />
      )}
      {market.vendorInstructions && (
        <DetailSection
          title={"Load In Instructions:"}
          description={market.vendorInstructions}
        />
      )}

      <ContinueButton>
        <Link href={`/dashboard/markets/${market._id}/select-preferences`}>
          Book this market
        </Link>
      </ContinueButton>
      {/* <ContinueButton>
          coming soon!
      </ContinueButton> */}
    </main>
  );
};

export default Page;

const DetailSection = ({
  description,
  title,
}: {
  description: string;
  title: string;
}) => {
  return (
    <div className="flex gap-[1ch]">
      <h3 className="font-bold">{title}</h3>
      <span className="max-w-[30ch]">{description}</span>
    </div>
  );
};
