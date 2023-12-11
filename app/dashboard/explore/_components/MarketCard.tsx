import type { TSanityMarket } from "@/sanity/queries/admin/markets";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

const MarketCard = ({ market }: { market: TSanityMarket }) => {
  const dateToDisplay = dateArrayToDisplayableText(market.dates);

  return (
    <li key={market._id} className="flex flex-col gap-2">
      <Link href={`/dashboard/markets/${market._id}`}>
        <Image
          src={market.marketCover.url}
          width={market.marketCover.dimensions.width}
          height={market.marketCover.dimensions.height}
          alt={market.name}
          className="w-full object-cover max-h-[271px] rounded-xl"
        />
      </Link>
      <strong>{market.price} per day</strong>
      <h3 className="text-2xl font-bold font-inter">{market.name}</h3>
      <p className="font-roboto">{market.description}</p>
      <p className="font-roboto">{dateToDisplay}</p>
    </li>
  );
};

export default MarketCard;
