import type { TSanityMarket } from "@/sanity/queries/admin/markets";
import { dateArrayToDisplayableText, tablePriceTodisplay } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

const MarketCard = ({ market }: { market: TSanityMarket }) => {
  const dateToDisplay = dateArrayToDisplayableText(market.dates);
  const prices =
    market.daysWithTables?.flatMap((day) =>
      day.tables.map((t) => t.table.price)
    ) || [];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const priceToDisplay = tablePriceTodisplay(minPrice, maxPrice);
  return (
    <li key={market._id} className="flex flex-col gap-2 border border-white rounded-2xl p-5">
      <Link href={`/dashboard/markets/${market._id}`}>
        <Image
          src={market.marketCover.url}
          width={market.marketCover.dimensions.width}
          height={market.marketCover.dimensions.height}
          alt={market.name}
          className="w-full object-cover rounded-xl aspect-video"
        />
      </Link>
      <span>
        <strong>${minPrice}</strong> /day
      </span>
      <h3 className="text-2xl font-bold font-inter">{market.name}</h3>
      {/* <p className="font-roboto">{market.description}</p> */}
      <p className="font-roboto">{dateToDisplay}</p>
    </li>
  );
};

export default MarketCard;
