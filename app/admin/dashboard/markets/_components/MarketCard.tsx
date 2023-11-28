import { TSanityMarket } from "@/sanity/queries/admin/markets";
import TableView from "../../venues/_components/TableView";

const MarketCard = ({
  market,
  dateToDisplay,
}: {
  market: TSanityMarket;
  dateToDisplay: string;
}) => {
  return (
    <div className="border rounded-[20px] p-2  border-[#292929] shadow-[0px_3px_6px_#00000029]">
      <h4 className="font-bold font-roboto text-sm">{dateToDisplay}</h4>
      <h4 className="font-bold font-roboto text-sm">{market.name}</h4>
      <p>{market.venue.title}</p>
      <p>{market.venue.address}</p>
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
    </div>
  );
};

export default MarketCard;