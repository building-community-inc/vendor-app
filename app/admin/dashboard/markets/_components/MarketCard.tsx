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
    <article className="flex flex-col gap-2 border rounded-[20px] p-2  border-[#292929] shadow-[0px_3px_6px_#00000029]">
      <header className="flex justify-between">
        <div>
          <h4 className="font-bold font-roboto text-sm">{dateToDisplay}</h4>
          <h4 className="font-bold font-roboto text-sm">{market.name}</h4>
          <p>{market.venue.title}</p>
          <p>{market.venue.address}</p>
        </div>
        <Image
          src={market.marketCover}
          width={500}
          height={350}
          alt={market.name}
          className="w-1/2 object-cover"
        />
      </header>
      <div className="flex gap-4 justify-evenly">
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
      </div>
    </article>
  );
};

export default MarketCard;
