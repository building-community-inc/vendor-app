import { TSanityMarket } from "@/sanity/queries/admin/markets/zods";
import TableView from "../../venues/_components/TableView";
import Image from "next/image";
import { formatDateString, formatDateWLuxon, tablePriceTodisplay } from "@/utils/helpers";
import Button from "@/app/_components/Button";
import DeleteMarket from "./DeleteMarket";
import Link from "next/link";

const MarketCard = ({
  market,
  dateToDisplay,
  withOptions
}: {
  market: TSanityMarket;
  dateToDisplay: string;
  withOptions?: boolean;
}) => {
  const prices =
    market.daysWithTables?.flatMap((day) =>
      day.tables.map((t) => t.table.price)
    ) || [];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const priceToDisplay = tablePriceTodisplay(minPrice, maxPrice);

  const totalBookedTables = market.daysWithTables?.reduce(
    (total, day) => total + day.tables.filter((table) => table.booked).length,
    0
  ) || 0;

  return (
    <article className="min-h-[645px] flex flex-col gap-2 border rounded-[20px] overflow-hidden  border-[#292929] shadow-[0px_3px_6px_#00000029]">
      <header className="flex justify-between h-[60%] w-full">
        <Image
          src={market.marketCover.url}
          width={500}
          height={387}
          alt={market.name}
          className="w-full max-h-full object-cover aspect-video"
        />
      </header>
      {market.cancelled && (
        <p className="m-2 text-red-600">Market has been cancelled</p>
      )}
      <section className="px-2 my-2 flex justify-between">
        <article>
          <h4 className="font-bold font-roboto text-sm">{dateToDisplay}</h4>
          <h4 className="font-bold font-roboto text-sm">{market.name}</h4>
          <p>{market.venue.title}</p>
          <p>{market.venue.address}</p>
        </article>
        <div className="flex flex-col items-end">

          <p>
            <strong> {priceToDisplay}</strong> per table
          </p>
          <div className="max-w-[20ch]">
            {market.lastDayToBook ? (
              <>
                <p>
                  <strong>
                    Last day to book:
                  </strong>
                </p>
                <p>
                  {formatDateString(market.lastDayToBook)}
                </p>
              </>
            ) : (
              <p className="text-red-600 text-right">Market is missing last day to book</p>
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center gap-4 justify-evenly pb-5">
        <ul className="flex flex-col gap-4 w-full">
          {market.daysWithTables?.map((day, index) => (
            <li
              key={`${day.date}-${index}`}
              className="flex gap-2 items-center justify-between w-full px-5"
            >
              <h4 className="font-bold font-roboto text-sm">
                {formatDateWLuxon(day.date)} {totalBookedTables}
              </h4>
              <div className="flex gap-2">
                <TableView
                  amount={day.tables.filter((tables) => !tables.booked).length}
                  title="Available Tables"
                />
                <TableView
                  amount={day.tables.filter((tables) => tables.booked).length}
                  title="Booked Tables"
                  type="confirmed"
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {withOptions && (
        <footer className="flex justify-center gap-5 py-5">
          {totalBookedTables === 0 && (
            <DeleteMarket marketId={market._id} />
          )}
          <Link href={`/admin/dashboard/markets/${market._id}/edit`}>
            <Button>
              Edit Market
            </Button>
          </Link>
        </footer>
      )}
    </article>
  );
};

export default MarketCard;
