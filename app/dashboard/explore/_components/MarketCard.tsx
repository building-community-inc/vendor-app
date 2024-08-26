"use client";
import type { TSanityMarket } from "@/sanity/queries/admin/markets/zods";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import Calendar from "../../_components/Calendar";
import Button from "@/app/_components/Button";
import { ChevronDownIcon, ChevronUpIcon } from '@sanity/icons'
import { useState } from "react";
import NewDetailsSection from "./DetailsSection";


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
    <li key={market._id} className="flex flex-col shadow-md shadow-title-color gap-3 border-b-none rounded-2xl overflow-hidden">
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

      <footer className="flex items-center justify-evenly flex-wrap py-10 gap-5 text-center">
        <Calendar dates={market.dates} />
        <div className="flex flex-col">

          <h3 className="text-2xl font-bold font-darker-grotesque">{market.name.split("-")[0]}</h3>
          <span className="text-[#C5B5A4]">
            {market.venue.address}, {market.venue.city}
          </span>
        </div>
        <Button type="button" className="bg-[#C5B5A4] uppercase font-semibold px-5">
          <Link href={`/dashboard/markets/${market._id}/select-preferences`}>
            Book Now
          </Link>
        </Button>
      </footer>
      {/* {priceToDisplay} */}
      <NewDetailsSection datesToDisplay={dateToDisplay} hours={market.venue.hours} loadInInstructions={market.venue.loadInInstructions} phone={market.venue.phone} />
      {/* <DetailsSection datesToDisplay={dateToDisplay} hours={market.venue.hours} loadInInstructions={market.venue.loadInInstructions} phone={market.venue.phone} /> */}
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

const DetailsSection = ({ datesToDisplay, hours, loadInInstructions, phone }: {
  datesToDisplay: string;
  hours?: string;
  loadInInstructions?: string | null;
  phone?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="border-t-2 border-[#C5B5A4] transition-all ">
      {isOpen && (
        <div className={`w-full flex p-10 flex-col border-b-2 border-[#C5B5A4] transition-all 
      `}>
          <div className="flex flex-col">
            <strong>Dates</strong>
            <span>{datesToDisplay}</span>
          </div>
          {hours && (
            <div className="flex flex-col">
              <strong>Hours</strong>
              <span>{hours}</span>
            </div>
          )}
          {phone && (
            <div className="flex flex-col">
              <strong>Phone</strong>
              <span>{phone}</span>
            </div>
          )}
          {loadInInstructions && (

            <div className="flex flex-col">
              <strong>Load In Instructions:</strong>
              <span>{loadInInstructions}</span>
            </div>
          )}
        </div>
      )}
      <button className="w-full flex flex-col items-center" onClick={() => setIsOpen(!isOpen)}>
        <span>
          {isOpen ? "Hide" : "See"} Details
        </span>
        {isOpen ? (
          <ChevronUpIcon className="text-xl" />
        ) : (
          <ChevronDownIcon className="text-xl" />
        )}
      </button>
    </section>
  )
}

