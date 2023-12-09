import { TSanityMarket } from "@/sanity/queries/admin/markets";
import TableView from "../../venues/_components/TableView";
import Image from "next/image";

const MarketCard = ({
  market,
  dateToDisplay,
}: {
  market: TSanityMarket;
  dateToDisplay: string;
}) => {
  return (
    <article className="h-[645px] flex flex-col gap-2 border rounded-[20px] overflow-hidden  border-[#292929] shadow-[0px_3px_6px_#00000029]">
      <header className="flex justify-between h-[60%] w-full">
        <Image
          src={market.marketCover.url}
          width={500}
          height={387}
          alt={market.name}
          className="w-full max-h-full object-cover"
        />
      </header>
      <section className="px-2 my-2 flex justify-between">
        <article>
          <h4 className="font-bold font-roboto text-sm">{dateToDisplay}</h4>
          <h4 className="font-bold font-roboto text-sm">{market.name}</h4>
          <p>{market.venue.title}</p>
          <p>{market.venue.address}</p>
        </article>
        <p>
          <strong> {market.price}</strong> per table
        </p>
      </section>
      <footer className="flex gap-4 justify-evenly">
        <TableView
          amount={market.venue.tables.length}
          title="Available Tables"
        />
        <TableView
          amount={market.venue.tables.length}
          title="Vendors Applied"
          type="applied"
        />
        <TableView
          amount={market.venue.tables.length}
          title="Vendors Confirmed"
          type="confirmed"
        />
      </footer>
    </article>
  );
};

export default MarketCard;
