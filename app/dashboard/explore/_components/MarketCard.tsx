import type { TSanityMarket } from "@/sanity/queries/admin/markets/zods";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import Date from "./Date";
import Button from "@/app/_components/Button";

const MarketCard = ({ market }: { market: TSanityMarket }) => {
  const dateToDisplay = dateArrayToDisplayableText(market.dates);
  const prices =
    market.daysWithTables?.flatMap((day) =>
      day.tables.map((t) => t.table.price)
    ) || [];
  const minPrice = Math.min(...prices);
  // const maxPrice = Math.max(...prices);

  // const priceToDisplay = tablePriceTodisplay(minPrice, maxPrice);
  return (
    <li key={market._id} className="flex flex-col gap-3 shadow-md shadow-title-color rounded-b-none rounded-2xl">
      <header className="relative h-fit">

        <Image
          src={market.marketCover.url}
          width={market.marketCover.dimensions.width}
          height={market.marketCover.dimensions.height}
          alt={market.name}
          className="w-full object-cover rounded-xl rounded-b-none aspect-video mb-2"
        />
        <div className="absolute bottom-2 right-10">

          <PriceTag price={minPrice} />
        </div>
      </header>
      {/* <span className="">
          <strong>{priceToDisplay}</strong> /day
        </span>
        <h3 className="text-2xl font-bold font-inter">{market.name}</h3>
        {/* <p className="font-roboto">{market.description}</p> */}
      {/* <p className="font-roboto">{dateToDisplay}</p> */}
      {/* </Link> */}
      <footer className="flex items-center justify-evenly flex-wrap py-10 gap-5 text-center">
        <Date dates={market.dates} />
        <div className="flex flex-col">

          <h3 className="text-2xl font-bold font-darker-grotesque">{market.name.split("-")[0]}</h3>
          <span className="text-[#C5B5A4]">
            {market.venue.address}, {market.venue.city}
          </span>
        </div>
        <Button type="button" className="bg-[#C5B5A4] uppercase font-semibold px-5">
          <Link href={`/dashboard/markets/${market._id}`}>
            Book Now
          </Link>
        </Button>
      </footer>
      {/* {priceToDisplay} */}
    </li>
  );
};

export default MarketCard;

const PriceTag = ({ price }: { price: number }) => {
  return (
    <div className="bg-[#C5B5A4] opacity-80 text-black p-2 font-darker-grotesque flex gap-1 items-center">
      <span> From</span>
      <span className="text-lg font-semibold">
        ${price} /day
      </span>
    </div>
  )
}
