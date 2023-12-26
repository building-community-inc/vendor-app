import { TSanityMarket } from "@/sanity/queries/admin/markets";
import TableView from "../../venues/_components/TableView";
import Image from "next/image";
import { formatMarketDate } from "@/utils/helpers";

const MarketCard = ({
  market,
  dateToDisplay,
}: {
  market: TSanityMarket;
  dateToDisplay: string;
}) => {
  return (
    <article className="min-h-[645px] flex flex-col gap-2 border rounded-[20px] overflow-hidden  border-[#292929] shadow-[0px_3px_6px_#00000029]">
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
      <footer className="flex gap-4 justify-evenly pb-5">
        <ul className="flex flex-col gap-4 w-full">
          {market.daysWithTables?.map((day, index) => (
            <li
              key={`${day.date}-${index}`}
              className="flex gap-2 items-center justify-between w-full px-5"
            >
              <h4 className="font-bold font-roboto text-sm">
                {formatMarketDate(day.date)}
              </h4>
              <div className="flex gap-2">
                <TableView
                  amount={
                    day.tables.filter((tables) => !tables.booked)
                      .length
                  }
                  title="Available Tables"
                />
                <TableView
                  amount={
                    day.tables.filter((tables) => tables.booked)
                      .length
                  }
                  title="Booked Tables"
                  type="confirmed"
                />
                
              </div>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
};

export default MarketCard;
